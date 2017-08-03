const _ = require(`lodash`)

exports.packageJson = _.template(
  `
{
  "name": "typeface-<%= typefaceId %>",
  "version": "0.0.0",
  "description": "<%= typefaceName %> typeface",
  "main": "index.css",
  "keywords": [
    "typeface",
    "font",
    "font family",
    "google fonts",
    "<%= typefaceId %>"
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
  font-display: swap;
  font-weight: <%= weight %>;
  src: url('<%= eotPath %>'); /* IE9 Compat Modes */
  src:
    local('<%= typefaceName %> <%= commonWeightName %> <%= style %>'),
    local('<%= typefaceName %>-<%= commonWeightName %><%= style %>'),
    url('<%= eotPath %>?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('<%= woff2Path %>') format('woff2'), /* Super Modern Browsers */
    url('<%= woffPath %>') format('woff'), /* Modern Browsers */
    url('<%= svgPath %>#<%= _.upperFirst(_.camelCase(typefaceId)) %>') format('svg'); /* Legacy iOS */
}

`
)

exports.readme = _.template(
  `
# typeface-<%= typefaceId %>

The CSS and web font files to easily self-host “<%= typefaceName %>”.

## Install

\`npm install --save typeface-<%= typefaceId %>\`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff, eot, ttf, svg) and
a CSS file with font-face declerations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

\`\`\`javascript
// Load <%= typefaceName %> typeface
require('typeface-<%= typefaceId %>')
\`\`\`

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining <%= count %> typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
`
)
