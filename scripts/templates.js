const _ = require(`lodash`);

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
  "license": "MIT",
  "repository": "https://github.com/KyleAMathews/typefaces/tree/master/packages/<%= typefaceId %>"
}
`
);

exports.fontFace = _.template(
  `/* <%= typefaceId %>-<%= weight %><%= styleWithNormal %> - latin */
@font-face {
  font-family: '<%= typefaceName %>';
  font-style: <%= styleWithNormal %>;
  font-display: swap;
  font-weight: <%= weight %>;
  src:
    local('<%= typefaceLocalName %>'),
    local('<%= typefaceLocalName2 %>'),
    url('<%= woff2Path %>') format('woff2'), /* Super Modern Browsers */
    url('<%= woffPath %>') format('woff'); /* Modern Browsers */
}

`
);

exports.readme = _.template(
  `>The Typefaces project is now deprecated.
>
>@DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weights, styles, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-<%= typefaceId %>" with "fontsource-<%= typefaceId %>".
>
> Then change imports from "import 'typeface-<%= typefaceId %>'" to "import 'fontsource-<%= typefaceId %>/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-<%= typefaceId %>

The CSS and web font files to easily self-host “<%= typefaceName %>”.

## Install

\`npm install --save typeface-<%= typefaceId %>\`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

\`\`\`javascript
// Load <%= typefaceName %> typeface
require('typeface-<%= typefaceId %>')
\`\`\`

By default only basic subset of characters is included in the font file (it's Latin in most cases).
To add another one along the default, import specific CSS file.

\`\`\`javascript
// Load <%= typefaceName %> typeface with Latin plus Latin Extended subset
require('typeface-<%= typefaceId %>/latin-ext.css')

// Default subset is Latin
require('typeface-<%= typefaceId %>/latin.css') === require('typeface-<%= typefaceId %>')
\`\`\`

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining <%= count %> typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
`
);
