require('shelljs/global')
const requestSync = require(`sync-request`)
const request = require(`request`)
const async = require(`async`)
const download = require(`./download-file`)
const fs = require(`fs`)
const path = require(`path`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const id = `space-mono`

const res = requestSync(`GET`, baseurl + id)
const typeface = JSON.parse(res.getBody(`UTF-8`))
console.log(typeface)

const typefaceDir = `packages/${typeface.id}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

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
      console.log(`Finished downloading "${url}" to "${dest}"`)
      cb(err)
    })
  }, callback)
}, (err, results) => {
  // Write out package.json file
  const packageJSON = `
{
  "name": "typeface-${typeface.id}",
  "version": "0.0.2",
  "description": "${typeface.family} typeface",
  "main": "index.css",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "typeface",
    "${typeface.id}"
  ],
  "author": "Kyle Mathews <mathews.kyle@gmail.com>",
  "license": "MIT"
}
  `
  fs.writeFileSync(`${typefaceDir}/package.json`, packageJSON)

  // Write out index.css file
  css = typeface.variants.map((item) => {
    let style = ""
    if (item.fontStyle !== `normal`) {
      style = item.fontStyle
    }
    return `
/* ${typeface.id}-${item.fontWeight}${item.fontStyle} - latin */
@font-face {
  font-family: '${typeface.family}';
  font-style: ${item.fontStyle};
  font-weight: ${item.fontWeight};
  src: url('./files/alegreya-v7-latin-900italic.eot'); /* IE9 Compat Modes */
  src: local('Alegreya Black Italic'), local('Alegreya-BlackItalic'),
       url('${makeFontFilePath(item, 'eot')}?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('${makeFontFilePath(item, 'woff2')}') format('woff2'), /* Super Modern Browsers */
       url('${makeFontFilePath(item, 'woff')}') format('woff'), /* Modern Browsers */
       url('${makeFontFilePath(item, 'svg')}#Alegreya') format('svg'); /* Legacy iOS */
}
    `
  })

  console.log(css)
  fs.writeFileSync(`${typefaceDir}/index.css`, css.join(''))
})
