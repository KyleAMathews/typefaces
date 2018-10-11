require("shelljs/global")
require("shelljs").config.silent = true
const requestSync = require(`sync-request`)
const async = require(`async`)
const fs = require(`fs-extra`)
const path = require(`path`)
const md5Dir = require(`md5-dir`)
const _ = require("lodash")

const { packageJson, readme } = require(`./templates`)
const download = require(`./download-file`)
const commonWeightNameMap = require(`./common-weight-name-map`)

// Get current count of packages to put in the package README
const dirs = p =>
  fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory())
const packagesCount = dirs(`./packages`).length

typeface = {
  "id":"material-icons",
  "family":"Material Icons",
  "variants":[
    {
      "fontFamily":"'Material Icons'",
      "fontStyle":"normal",
      "fontWeight":"400",
      "woff2":"https://github.com/google/material-design-icons/raw/3.0.1/iconfont/MaterialIcons-Regular.woff2",
      "woff":"https://github.com/google/material-design-icons/raw/3.0.1/iconfont/MaterialIcons-Regular.woff"
    }
  ],
}

fontFace = _.template(
  `/* fallback */
@font-face {
  font-family: '<%= typefaceName %>';
  font-style: <%= styleWithNormal %>;
  font-display: swap;
  font-weight: <%= weight %>;
  src:
    local('<%= typefaceName %> <%= commonWeightName %> <%= style %>'),
    local('<%= typefaceName %>-<%= commonWeightName %><%= style %>'),
    url('<%= woff2Path %>') format('woff2'), /* Super Modern Browsers */
    url('<%= woffPath %>') format('woff'); /* Modern Browsers */
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
`)

const typefaceDir = `packages/material-icons`

// Create the directories for this typeface.
fs.ensureDirSync(typefaceDir)
fs.ensureDirSync(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, "/files")
fs.writeFileSync(typefaceDir + `/.npmignore`, "")
fs.writeFileSync(typefaceDir + `/files/.gitignore`, "")

const makeFontFilePath = (item, extension) => {
  let style = ""
  if (item.fontStyle !== `normal`) {
    style = item.fontStyle
  }
  return `./files/${typeface.id}-${item.fontWeight}${style}.${extension}`
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

      // Write out index.css file
      const variants = _.sortBy(typeface.variants, item => {
        let sortString = item.fontWeight
        if (item.fontStyle === `italic`) {
          sortString += item.fontStyle
        }
        return sortString
      })
      css = variants.map(item => {
        if (item.errored) {
          return false
        }
        let style = ""
        if (item.fontStyle !== `normal`) {
          style = item.fontStyle
        }
        return fontFace({
          typefaceName: typeface.family,
          style,
          styleWithNormal: item.fontStyle,
          weight: item.fontWeight,
          commonWeightName: commonWeightNameMap(item.fontWeight),
          woffPath: makeFontFilePath(item, "woff"),
          woff2Path: makeFontFilePath(item, "woff2"),
        })
      })

      fs.writeFileSync(`${typefaceDir}/index.css`, css.join(""))
      console.log("finished downloading", typeface.family)
    })
  }
)
