const glob = require(`glob`)
const ttf2woff2 = require(`ttf2woff2`)
const path = require(`path`)
const fs = require(`fs-extra`)
const _ = require(`lodash`)
const md5Dir = require(`md5-dir`)

const { packageJson, fontFace, readme } = require(`./templates`)
const commonWeightNameMap = require(`./common-weight-name-map`)

// Get current count of packages to put in the package README
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory())
const packagesCount = dirs(`./packages`).length
console.log(`package count`, packagesCount)

module.exports = (extractionPath, typefaceDir, lowercaseId, familyName) => {
  // Try to copy the License file.
  const licenseFiles = glob.sync(`*license*`, {
    cwd: extractionPath,
    nocase: true,
  })
  if (licenseFiles.length > 0) {
    licenseFiles.forEach((file) => {
      fs.copySync(path.join(extractionPath, file), `${typefaceDir}/${file}`)
    })
  }

  const globPattern = `**/?(*.eot|*.svg|*.ttf|*.woff)`
  const globOptions = {
    cwd: extractionPath,
  }
  //console.log(globPattern, globOptions)

  const fontFiles = glob.sync(globPattern, globOptions)
  console.log(`found fontFiles`, fontFiles)

  // Copy files
  let variants = []
  fontFiles.forEach((fontFile) => {
    const fullPath = extractionPath + `/` + fontFile

    // Determine weight.
    let weight
    if (fontFile.match(/regular/)) {
      weight = `400`
    } else if (fontFile.match(/thin/)) {
      weight = `100`
    } else if (fontFile.match(/ultra_light/)) {
      weight = `200`
    } else if (fontFile.match(/light/)) {
      weight = `300`
    } else if (fontFile.match(/book/)) {
      weight = `400`
    } else if (fontFile.match(/medium/)) {
      weight = `500`
    } else if (fontFile.match(/semibold/)) {
      weight = `600`
    } else if (fontFile.match(/bold/)) {
      weight = `700`
    } else if (fontFile.match(/heavy/)) {
      weight = `800`
    } else {
      weight = `400`
    }

    // Determine style
    let style = ``
    if (fontFile.match(/italic/)) {
      style = `italic`
    }

    // Find the variant to add this file to (or create new one).
    let variant = _.find(variants, (v) => v.fontStyle === style && v.fontWeight === weight)
    if (!variant) {
      variant = {
        fontStyle: style,
        fontWeight: weight,
      }
      variants.push(variant)
    }

    const parsedPath = path.parse(fontFile)
    const relativePath = `./files/${lowercaseId}-${weight}${style}${parsedPath.ext}`
    variant[parsedPath.ext.slice(1)] = relativePath
    const toPath = path.join(typefaceDir, relativePath)
    console.log(toPath)
    fs.copySync(fullPath, toPath)

    // If this is a ttf file, use ttf2woff2 to make a woff2 version.
    if (parsedPath.ext === `.ttf`) {
      console.log(`converting .ttf file to .woff2`)
      const input = fs.readFileSync(fullPath)
      const woff2RelativePath = `./files/${lowercaseId}-${weight}${style}.woff2`
      variant['woff2'] = woff2RelativePath
      const woff2ToPath = path.join(typefaceDir, woff2RelativePath)
      fs.writeFileSync(woff2ToPath, ttf2woff2(input))
    }
  })
  console.log(variants)

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
      typefaceId: lowercaseId,
      typefaceName: familyName,
      count: packagesCount,
    })

    fs.writeFileSync(`${typefaceDir}/README.md`, packageReadme)

    // Write out package.json
    const packageJSON = packageJson({
      typefaceId: lowercaseId,
      typefaceName: familyName,
    })

    fs.writeFileSync(`${typefaceDir}/package.json`, packageJSON)

    // Write out index.css file
    // Sort variants first.
    variants = _.sortBy(typeface.variants, (item) => {
      let sortString = item.fontWeight
      if (item.fontStyle === `italic`) {
        sortString += item.fontStyle
      }
      return sortString
    })
    css = variants.map((item) => {
      let style = item.fontStyle
      if (!style) {
        style = `normal`
      }
      return fontFace({
        typefaceId: lowercaseId,
        typefaceName: familyName,
        style,
        styleWithNormal: style,
        weight: item.fontWeight,
        commonWeightName: commonWeightNameMap(item.fontWeight),
        eotPath: item['eot'],
        woffPath: item['woff'],
        woff2Path: item['woff2'],
        svgPath: item['svg'],
      })
    })

    console.log(css)
    fs.writeFileSync(`${typefaceDir}/index.css`, css.join(''))
  })
}
