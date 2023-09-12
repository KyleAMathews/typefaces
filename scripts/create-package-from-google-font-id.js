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

const { packageJson, fontFace, scssHeader, readme } = require(`./templates`)
const download = require(`./download-file`)
const commonWeightNameMap = require(`./common-weight-name-map`)

//const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const baseurl = `http://localhost:9000/api/fonts/`
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
const typeface = JSON.parse(res.getBody(`UTF-8`))

const typefaceDir = `packages/${typeface.id}`

// Create the directories for this typeface.
fs.ensureDirSync(typefaceDir)
fs.ensureDirSync(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, "/files")
fs.writeFileSync(typefaceDir + `/.npmignore`, "")
fs.writeFileSync(typefaceDir + `/files/.gitignore`, "")

const makeFontFilePath = (item, extension, syntax) => {
  let style = ""
  if (item.fontStyle !== `normal`) {
    style = item.fontStyle
  }
  let basePath = "./files"
  switch (syntax) {
    case "scss":
      basePath = `#{$${typeface.id}-font-path}`
      break;
  }
  return `${basePath}/${typeface.id}-${typeface.defSubset}-${item.fontWeight}${style}.${extension}`
}

// Download all font files.
async.map(
  typeface.variants,
  (item, callback) => {
    // Download woff, and woff2 in parallal.
    const downloads = [`woff`, `woff2`].map(extension => {
      const dest = path.join(typefaceDir, makeFontFilePath(item, extension))
      const url = item[extension]
      return {
        extension,
        url,
        dest,
      }
    })
    item.errored = false
    async.map(
      downloads,
      (d, downloadDone) => {
        const { url, dest, extension } = d
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
          //process.exit()
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
        typefaceId: typeface.id,
        typefaceName: typeface.family,
        count: packagesCount,
      })

      fs.writeFileSync(`${typefaceDir}/README.md`, packageReadme)

      // Write out package.json file
      const packageJSON = packageJson({
        typefaceId: typeface.id,
        typefaceName: typeface.family,
      })

      fs.writeFileSync(`${typefaceDir}/package.json`, packageJSON)

      // Write out index.css and index.scss files
      const variants = _.sortBy(typeface.variants, item => {
        let sortString = item.fontWeight
        if (item.fontStyle === `italic`) {
          sortString += item.fontStyle
        }
        return sortString
      })
      for (const syntax of ['css', 'scss']) {
        const styles = []
        let filename = "index.css"
        switch (syntax) {
          case "scss":
            styles.push(scssHeader({
              typefaceId: typeface.id,
            }))
            filename = "_typeface.scss"
            break;
        }
        variants.forEach(item => {
          if (item.errored) {
            return false
          }
          let style = ""
          if (item.fontStyle !== `normal`) {
            style = item.fontStyle
          }
          styles.push(fontFace({
            typefaceId: typeface.id,
            typefaceName: typeface.family,
            style,
            styleWithNormal: item.fontStyle,
            weight: item.fontWeight,
            commonWeightName: commonWeightNameMap(item.fontWeight),
            woffPath: makeFontFilePath(item, "woff", syntax),
            woff2Path: makeFontFilePath(item, "woff2", syntax),
          }))
        })

        fs.writeFileSync(`${typefaceDir}/${filename}`, styles.join(""))
      }

      console.log("finished downloading", typeface.family)
    })
  }
)
