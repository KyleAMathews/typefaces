require('shelljs/global')
const requestSync = require(`sync-request`)
const request = require(`request`)
const async = require(`async`)
const download = require(`./download-file`)
const fs = require(`fs`)
const path = require(`path`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const id = `lato`

const res = requestSync(`GET`, baseurl + id)
const typeface = JSON.parse(res.getBody(`UTF-8`))
console.log(typeface)

const typefaceDir = `packages/${typeface.id}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, '/files')
fs.writeFileSync(typefaceDir + `/.npmignore`, '')
fs.writeFileSync(typefaceDir + `/files/.gitignore`, '')

const commonWeightNameMap = (numericWeight) => {
  switch (numericWeight) {
    case '100':
      return `Thin`
      break;
    case '200':
      return `Extra Light`
      break;
    case '300':
      return `Light`
      break;
    case '400':
      return `Regular`
      break;
    case '500':
      return `Medium`
      break;
    case '600':
      return `SemiBold`
      break;
    case '700':
      return `Bold`
      break;
    case '800':
      return `ExtraBold`
      break;
    case '900':
      return `Black`
      break;
    default:
      return `normal`
  }
}

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
  const packageJSON = `{
  "name": "typeface-${typeface.id}",
  "version": "0.0.2",
  "description": "${typeface.family} typeface",
  "main": "index.css",
  "keywords": [
    "typeface",
    "${typeface.id}"
  ],
  "author": "Kyle Mathews <mathews.kyle@gmail.com>",
  "license": "MIT"
}`
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
  src: url('${makeFontFilePath(item, 'eot')}'); /* IE9 Compat Modes */
  src: local('${typeface.family} ${commonWeightNameMap(item.fontWeight)} ${style}'), local('${typeface.family}-${commonWeightNameMap(item.fontWeight)}${style}'),
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
