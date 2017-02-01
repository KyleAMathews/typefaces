const _ = require(`lodash`)

exports.packageJson = _.template(
`
{
  "name": "typeface-<%= templateId %>",
  "version": "0.0.0",
  "description": "<%= templateName %> typeface",
  "main": "index.css",
  "keywords": [
    "typeface",
    "<%= templateId %>"
  ],
  "author": "Kyle Mathews <mathews.kyle@gmail.com>",
  "license": "MIT"
}
`
)

exports.fontFace = _.template(
`/* <%= typefaceId %>-<%= weight %><%= styleWithNormal %> - latin */
@font-face {
  font-family: '<%= typefaceName %>';
  font-style: <%= styleWithNormal %>;
  font-weight: <%= weight %>;
  src: url('<%= eotPath %>'); /* IE9 Compat Modes */
  src: local('<%= typefaceName %> <%= commonWeightName %> <%= style %>'), local('<%= typefaceName %>-<%= commonWeightName %><%= style %>'),
       url('<%= eotPath %>?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('<%= woff2Path %>') format('woff2'), /* Super Modern Browsers */
       url('<%= woffPath %>') format('woff'), /* Modern Browsers */
       url('<%= svgPath %>#<%= typefaceName %>') format('svg'); /* Legacy iOS */
}
`
)
