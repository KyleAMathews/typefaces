const fs = require('fs')
const compile = require("string-template/compile")

const fontFaceTemplate = compile(`
/* {name}-{style} - latin */
@font-face {
  font-family: '{nameHuman}';
  font-style: {style};
  font-weight: {weightInt};
  src: url('{fileEOT}'); /* IE9 Compat Modes */
  src: local('{nameHuman}'), local('{nameHuman}-{weightStr}'),
       url('{fileEOT}?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('{fileWOFF2}') format('woff2'), /* Super Modern Browsers */
       url('{fileWOFF}') format('woff'), /* Modern Browsers */
       url('{fileTTF}') format('truetype'), /* Safari, Android, iOS */
       url('{fileSVG}#{name}') format('svg'); /* Legacy iOS */
}
`)

let str = ""
module.exports = (fonts) => {
  fonts.forEach((font) => {
    str += fontFaceTemplate(font)
  })

  return str
  //console.log(fontFaceTemplate({
    //name: 'clear-sans',
    //nameHuman: 'Clear Sans',
    //style: 'regular',
    //weightInt: 400,
    //weightStr: 'normal',
    //fileEOT: 'clear-sans.eot',
    //fileWOFF2: 'clear-sans.woff2',
    //fileWOFF: 'clear-sans.woff',
    //fileTTF: 'clear-sans.ttf',
    //fileSVG: 'clear-sans.svg',
  //}))
}

//module.exports()
