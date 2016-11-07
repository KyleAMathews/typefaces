require('shelljs/global')
var request = require('request');
var progress = require('request-progress');
const zlib = require('zlib')
const fs = require('fs')
const ProgressBar = require('progress');
const makeCSS = require('./make-css')
const ttf2woff2 = require('ttf2woff2')
const glob = require('glob')
const parsePath = require('parse-filepath')

// Clean up previous make run.
//rm('-rf', 'files')

const DOWNLOAD_LINK = 'https://01.org/sites/default/files/downloads/clear-sans/clearsans-1.00.zip'

//let bar
//let lastTransferred = 0
//console.log('downloading archive ' + DOWNLOAD_LINK)
//progress(request(DOWNLOAD_LINK), {
    //throttle: 500,                    // Throttle the progress event to 2000ms, defaults to 1000ms
//})
//.on('progress', function (state) {
  //if (!bar) {
    //bar = new ProgressBar('[:bar] :percent :etas', {
      //complete: '=',
      //incomplete: ' ',
      //width: 20,
      //total: state.size.total
    //})
  //}

  //const tickSize = state.size.transferred - lastTransferred
  //lastTransferred = state.size.transferred
  //bar.tick(tickSize)
//})
//.on('end', () => {
  //console.log('done!')
  //console.log('unzipping archive')
  //exec('unzip clearsans.zip -d files')
  //rm('clearsans.zip')
  //console.log('finished unzipping')

  //// Convert TTF files to WOFF2
  //mkdir('files/WOFF2')
//const styles = glob.sync('files/TTF/*')
//const bar = new ProgressBar('Converting styles to WOFF2 [:bar] :current/:total :etas', {
  //complete: '=',
  //incomplete: ' ',
  //width: 20,
  //total: styles.length
//})
//let completed = 0
//styles.forEach((stylePath) => {
  //const parsedPath = parsePath(stylePath)
  ////console.log('parsedPath', parsedPath)
  //const input = fs.readFileSync(stylePath)
  //fs.writeFileSync(`./files/WOFF2/${parsedPath.name}.woff2`, ttf2woff2(input))
  //completed += 1
  //bar.tick()
//})
//console.log('done!')


// Create font objects
const stylesObjs = [
  {
    style: 'regular',
    weightInt: 100,
  },
  {
    style: 'regular',
    weightInt: 300,
  },
  {
    style: 'regular',
    weightInt: 400,
  },
  {
    style: 'italic',
    weightInt: 400,
  },
  {
    style: 'regular',
    weightInt: 500,
  },
  {
    style: 'italic',
    weightInt: 500,
  },
  {
    style: 'regular',
    weightInt: 700,
  },
  {
    style: 'italic',
    weightInt: 700,
  },
]

// Expand styles into full font declaration
const fonts = stylesObjs.map((style) => {
  let weightStr
  let weightFileStr
  switch (`${style.weightInt}${style.style}`) {
    case '100regular':
      weightStr = 'Thin'
      weightFileStr = 'Thin'
      break;
    case '300regular':
      weightStr = 'Light'
      weightFileStr = 'Light'
      break;
    case '400regular':
      weightStr = 'Normal'
      weightFileStr = 'Regular'
      break;
    case '400italic':
      weightStr = 'Italic'
      weightFileStr = 'Italic'
      break;
    case '500regular':
      weightStr = 'Medium'
      weightFileStr = 'Medium'
      break;
    case '500italic':
      weightStr = 'Medium'
      weightFileStr = 'MediumItalic'
      break;
    case '700regular':
      weightStr = 'Bold'
      weightFileStr = 'Bold'
      break;
    case '700italic':
      weightStr = 'Bold'
      weightFileStr = 'BoldItalic'
      break;
  }
  const font = Object.assign({
    weightStr,
    name: 'clear-sans',
    nameHuman: 'Clear Sans',
    fileEOT: `./files/EOT/ClearSans-${weightFileStr}.eot`,
    fileWOFF2: `./files/WOFF2/ClearSans-${weightFileStr}.woff2`,
    fileWOFF: `./files/WOFF/ClearSans-${weightFileStr}.woff`,
    fileTTF: `./files/TTF/ClearSans-${weightFileStr}.ttf`,
    fileSVG: `./files/SVG/ClearSans-${weightFileStr}.svg`,
  }, style)

  return font
})

fs.writeFileSync('./index.css', makeCSS(fonts))

//})
//.pipe(fs.createWriteStream('./clearsans.zip'))
