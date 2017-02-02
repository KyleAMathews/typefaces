require('shelljs/global')
const async = require(`async`)
//require('shelljs').config.silent = true
const requestSync = require(`sync-request`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const res = requestSync(`GET`, baseurl)
const typefaces = JSON.parse(res.getBody(`UTF-8`))

async.forEachLimit(typefaces, 10, (typeface, cb) => {
  console.log(`downloading ${typeface.id} ${typefaces.indexOf(typeface)}/${typefaces.length}`)
  exec(`node scripts/create-package-from-google-font-id.js ${typeface.id}`, () => {
    cb()
  })
})
