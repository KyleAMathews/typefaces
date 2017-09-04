require("shelljs/global")
const requestSync = require(`sync-request`)
const fs = require(`fs-extra`)
const processFontsquirrelKit = require(`./process-fontsquirrel-kit`)

const download = require(`./download-file`)

const apiBase = `https://www.fontsquirrel.com/api/`
const id = process.argv[2]
if (!id) {
  console.warn(`You need to pass in the fontsquirrel id as an argument`)
  process.exit()
}
// Ensure we're using a lowercase version of the id for file paths.
const lowercaseId = id.toLowerCase()

// Get info about font family.
const res = requestSync(`GET`, `${apiBase}familyinfo/${id}`)
const typeface = JSON.parse(res.getBody(`UTF-8`))
console.log(typeface)

const typefaceDir = `packages/${lowercaseId}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, "/files")
fs.writeFileSync(typefaceDir + `/.npmignore`, "")
fs.writeFileSync(typefaceDir + `/files/.gitignore`, "")

// Download the webfont zipped file.
const downloadUrl = `https://www.fontsquirrel.com/fontfacekit/${id}`
const dest = `${require(`os`).tmpdir()}/${id}.zip`
const extractionPath = `${dest}_extracted`
download(downloadUrl, dest, err => {
  console.log(`downloaded ${downloadUrl} to ${dest}`)
  exec(`unzip ${dest} -d ${extractionPath}`)
  processFontsquirrelKit(
    extractionPath,
    typefaceDir,
    lowercaseId,
    typeface[0].family_name
  )
})
