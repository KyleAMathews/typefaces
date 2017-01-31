require('shelljs/global')
const requestSync = require(`sync-request`)
const fs = require(`fs-extra`)
const processFontsquirrelKit = require(`./process-fontsquirrel-kit`)

const apiBase = `https://www.fontsquirrel.com/api/`
const id = process.argv[2]
const extractionPath = process.argv[3]
if (!id) {
  console.warn(`You need to pass in the fontsquirrel id as an argument`)
  process.exit()
}
if (!extractionPath) {
  console.warn(`You need to pass in the path to the unzipped fontsquirrel package as an argument`)
  process.exit()
}

// Ensure we're using a lowercase version of the id for file paths.
const lowercaseId = id.toLowerCase()

// Get info about font family.
const res = requestSync(`GET`, `${apiBase}familyinfo/${id}`)
const typeface = JSON.parse(res.getBody(`UTF-8`))
console.log(typeface)
if (!typeface.id) {
  console.log("Couldn't find information about this font id on fontsquirrel. Doublecheck if it's correct?")
}

const typefaceDir = `packages/${lowercaseId}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, '/files')
fs.writeFileSync(typefaceDir + `/.npmignore`, '')
fs.writeFileSync(typefaceDir + `/files/.gitignore`, '')

processFontsquirrelKit(extractionPath, typeface, typefaceDir, lowercaseId)
