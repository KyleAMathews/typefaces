require("shelljs/global")
const async = require(`async`)
//require('shelljs').config.silent = true
const requestSync = require(`sync-request`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const res = requestSync(`GET`, baseurl)
const typefaces = JSON.parse(res.getBody(`UTF-8`))

async.forEachLimit(typefaces, 10, (typeface, cb) => {
  // For some reason NPM complains that I can't publish this as it's
  // too similar to an existing package :shrug:
  if (typeface.id === `do-hyeon`) {
    return cb()
  }
  console.log(
    `downloading ${typeface.id} ${typefaces.indexOf(typeface)}/${
      typefaces.length
    }`
  )
  exec(
    `node scripts/create-package-from-google-font-id.js ${typeface.id}`,
    () => {
      cb()
    }
  )
})
