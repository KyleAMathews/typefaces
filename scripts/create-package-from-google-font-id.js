require("shelljs/global")
require("shelljs").config.silent = true
const requestSync = require(`sync-request`)
const request = require(`request`)
const async = require(`async`)
const fs = require(`fs-extra`)
const path = require(`path`)
const md5Dir = require(`md5-dir`)
const log = require("single-line-log").stdout
const _ = require("lodash")

const { packageJson, fontFace, readme } = require(`./templates`)
const download = require(`./download-file`)
const commonWeightNameMap = require(`./common-weight-name-map`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
// const baseurl = `http://localhost:9000/api/fonts/`
const id = process.argv[2]
if (!id) {
  console.warn(`You need to pass in the google font id as an argument`)
  process.exit()
}

// Get current count of packages to put in the package README
const dirs = p =>
  fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory())
const packagesCount = dirs(`./packages`).length

const res = requestSync(`GET`, baseurl + id)
const defSubsetTypeface = JSON.parse(res.getBody(`UTF-8`))
const subsetsWithoutDefault = defSubsetTypeface.subsets.filter((subset) => subset !== defSubsetTypeface.defSubset)

const subsets = [[
  defSubsetTypeface.defSubset,
  defSubsetTypeface
]].concat(subsetsWithoutDefault.map((subset) => {
  const subsetRes = requestSync(`GET`, baseurl + id + '?subsets=' + defSubsetTypeface.defSubset + ',' + subset)
  return [subset, JSON.parse(subsetRes.getBody(`UTF-8`))]
}))

const typefaceDir = `packages/${defSubsetTypeface.id}`

// Create the directories for this typeface.
fs.ensureDirSync(typefaceDir)
fs.ensureDirSync(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, "/files")
fs.writeFileSync(typefaceDir + `/.npmignore`, "")
fs.writeFileSync(typefaceDir + `/files/.gitignore`, "")

const makeFontFilePath = (item, subset, extension) => {
  let style = ""
  if (item.fontStyle !== `normal`) {
    style = item.fontStyle
  }
  return `./files/${defSubsetTypeface.id}-${subset}-${item.fontWeight}${style ? '-' + style : ''}.${extension}`
}

async.map(
  subsets,
  ([subset, typeface], callback) => {
    // Download all font files.
    async.map(
      typeface.variants,
      (item, callback) => {
        // Download woff, and woff2 in parallal.
        const downloads = [`woff`, `woff2`].map(extension => {
          const dest = path.join(typefaceDir, makeFontFilePath(item, subset, extension))
          const url = item[extension]
          return {
            extension,
            url,
            dest,
            subset,
          }
        })

        item.errored = false
        async.map(
          downloads,
          (d, downloadDone) => {
            const { url, dest, extension, subset } = d
            download(url, dest, err => {
              if (err) {
                console.log("error downloading", typeface.id, url, err)
                // Track if a download errored.
                item.errored = true
              }
              // log(`Finished downloading "${url}" to "${dest}"`)
              downloadDone()
            })
          },
          callback
        )
      },
      callback
    )
  },
  (err, results) => {
    // Create md5 hash of directory and write this out so git/lerna knows if anything
    // has changed.
    md5Dir(`${typefaceDir}/files`, (err, filesHash) => {
      // If a hash file already exists, check if anything has changed. If it has
      // then update the hash, otherwise exit.
      if (fs.existsSync(`${typefaceDir}/files-hash.json`)) {
        const filesHashJson = JSON.parse(
          fs.readFileSync(`${typefaceDir}/files-hash.json`, `utf-8`)
        )
        if (filesHashJson.hash === filesHash) {
          // Exit
          // console.log(
          // `The md5 hash of the new font files haven't changed (meaning no font files have changed) so exiting`
          // )
          process.exit()
        } else {
        }
      }

      // Either the files hash file needs updated or written new.
      fs.writeFileSync(
        `${typefaceDir}/files-hash.json`,
        JSON.stringify({
          hash: filesHash,
          updatedAt: new Date().toJSON(),
        })
      )

      // Write out the README.md
      const packageReadme = readme({
        typefaceId: defSubsetTypeface.id,
        typefaceName: defSubsetTypeface.family,
        count: packagesCount,
      })

      fs.writeFileSync(`${typefaceDir}/README.md`, packageReadme)

      // Write out package.json file
      const packageJSON = packageJson({
        typefaceId: defSubsetTypeface.id,
        typefaceName: defSubsetTypeface.family,
      })

      fs.writeFileSync(`${typefaceDir}/package.json`, packageJSON)

      // Write out index.css file
      const variants = _.sortBy(defSubsetTypeface.variants, item => {
        let sortString = item.fontWeight
        if (item.fontStyle === `italic`) {
          sortString += item.fontStyle
        }
        return sortString
      })
      defSubsetTypeface.subsets.forEach((subset, _, subsets) => {
        css = variants.map(item => {
          if (item.errored) {
            return false
          }
          let style = ""
          if (item.fontStyle !== `normal`) {
            style = item.fontStyle
          }
          return fontFace({
            typefaceId: defSubsetTypeface.id,
            typefaceName: defSubsetTypeface.family,
            typefaceLocalName: item.local[0],
            typefaceLocalName2: item.local[1],
            style,
            subset,
            styleWithNormal: item.fontStyle,
            weight: item.fontWeight,
            commonWeightName: commonWeightNameMap(item.fontWeight),
            woffPath: makeFontFilePath(item, subset, "woff"),
            woff2Path: makeFontFilePath(item, subset, "woff2"),
          })
        })

        const fileContent = css.join("")
        const cssPath = `${typefaceDir}/${subset}.css`
        console.log(`writing file ${cssPath}...`)
        fs.writeFileSync(cssPath, fileContent)
        if (subset === 'latin' || (subsets.length === 1)) {
          fs.writeFileSync(`${typefaceDir}/index.css`, fileContent)
        }
      })

      console.log("finished downloading", defSubsetTypeface.family)
    })
  }
)
