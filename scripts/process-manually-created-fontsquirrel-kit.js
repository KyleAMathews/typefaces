require('shelljs/global')
const requestSync = require(`sync-request`)
const fs = require(`fs-extra`)
const processFontsquirrelKit = require(`./process-fontsquirrel-kit`)
const _ = require('lodash')

const apiBase = `https://www.fontsquirrel.com/api/`
const id = process.argv[2]
const familyName = process.argv[3]
const extractionPath = process.argv[4]
if (!id) {
  console.warn(`You need to pass in the fontsquirrel id as the first argument`)
  process.exit()
}
if (!familyName) {
  console.warn(`You need to pass in a family name as the second argument`)
  process.exit()
}
if (!extractionPath) {
  console.warn(`You need to pass in the path to the unzipped fontsquirrel package as the third argument`)
  process.exit()
}

// Ensure we're using a lowercase version of the id for file paths.
const lowercaseId = id.toLowerCase()
const typefaceDir = `packages/${lowercaseId}`

// Create the directories for this typeface.
mkdir(typefaceDir)
mkdir(typefaceDir + `/files`)

// Make git ignore typeface files so we're not checking in GBs of data.
fs.writeFileSync(typefaceDir + `/.gitignore`, '/files')
fs.writeFileSync(typefaceDir + `/.npmignore`, '')
fs.writeFileSync(typefaceDir + `/files/.gitignore`, '')

processFontsquirrelKit(extractionPath, typefaceDir, lowercaseId, familyName)
