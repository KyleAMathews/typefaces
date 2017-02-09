require('shelljs/global')
require('shelljs').config.silent = true
const requestSync = require(`sync-request`)
const request = require(`request`)
const async = require(`async`)
const fs = require(`fs`)
const path = require(`path`)
const md5Dir = require(`md5-dir`)
const log = require('single-line-log').stdout

const { packageJson, fontFace, readme } = require(`./templates`)
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
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory())
const packagesCount = dirs(`./packages`).length

const res = requestSync(`GET`, baseurl + id)
const typeface = JSON.parse(res.getBody(`UTF-8`))

const typefaceDir = `packages/${typeface.id}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, '/files')
fs.writeFileSync(typefaceDir + `/.npmignore`, '')
fs.writeFileSync(typefaceDir + `/files/.gitignore`, '')

const makeFontFilePath = (item, extension) => {
  let style = ""
  if (item.fontStyle !== `normal`) {
    style = item.fontStyle
  }
  return `./files/${typeface.id}-${typeface.defSubset}-${item.fontWeight}${style}.${extension}`
}

// Download all font files.
async.map(typeface.variants, (item, callback) => {
  // Download eot, svg, woff, and woff2 in parallal.
  const downloads = [`eot`, `svg`, `woff`, `woff2`].map((extension) => {
    const dest = path.join(typefaceDir, makeFontFilePath(item, extension))
    const url = item[extension]
    return {
      url,
      dest,
    }
  })
  async.map(downloads, (d, cb) => {
    const { url, dest } = d
    download(url, dest, (err) => {
      log(`Finished downloading "${url}" to "${dest}"`)
      cb(err)
    })
  }, callback)
}, (err, results) => {
  // Create md5 hash of directory and write this out so git/lerna knows if anything
  // has changed.
  md5Dir(`${typefaceDir}/files`, (err, filesHash) => {
    // If a hash file already exists, check if anything has changed. If it has
    // then update the hash, otherwise exit.
    if (fs.existsSync(`${typefaceDir}/files-hash.json`)) {
      const filesHashJson = JSON.parse(fs.readFileSync(`${typefaceDir}/files-hash.json`, `utf-8`))
      if (filesHashJson.hash === filesHash) {
        // Exit
        console.log(`The md5 hash of the new font files haven't changed (meaning no font files have changed) so exiting`)
        process.exit()
      } else {
      }
    }

    // Either the files hash file needs updated or written new.
    fs.writeFileSync(`${typefaceDir}/files-hash.json`, JSON.stringify({
      hash: filesHash,
      updatedAt: new Date().toJSON(),
    }))

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
    css = typeface.variants.map((item) => {
      let style = ""
      if (item.fontStyle !== `normal`) {
        style = item.fontStyle
      }
      return fontFace({
        typefaceId: typeface.id,
        typefaceName: typeface.family,
        style,
        styleWithNormal: item.fontStyle,
        weight: item.fontWeight,
        commonWeightName: commonWeightNameMap(item.fontWeight),
        eotPath: makeFontFilePath(item, 'eot'),
        woffPath: makeFontFilePath(item, 'woff'),
        woff2Path: makeFontFilePath(item, 'woff2'),
        svgPath: makeFontFilePath(item, 'svg'),
      })
    })

    fs.writeFileSync(`${typefaceDir}/index.css`, css.join(''))
    console.log(`\nfinished`)
  })
})
