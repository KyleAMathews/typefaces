require('shelljs/global')
//require('shelljs').config.silent = true
const requestSync = require(`sync-request`)

const baseurl = `https://google-webfonts-helper.herokuapp.com/api/fonts/`
const res = requestSync(`GET`, baseurl)
const typefaces = JSON.parse(res.getBody(`UTF-8`))

typefaces.forEach((typeface, i) => {
  console.log(`downloading ${typeface.id} ${i}/${typefaces.length}`)
  exec(`node scripts/create-package-from-google-font-id.js ${typeface.id}`)
})
