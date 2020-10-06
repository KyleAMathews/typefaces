>The Typefaces project is now deprecated. @DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weights, styles, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-bilbo-swash-caps" with "fontsource-bilbo-swash-caps".
>
> Then change imports from "import 'typeface-bilbo-swash-caps'" to "import 'fontsource-bilbo-swash-caps/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-bilbo-swash-caps

The CSS and web font files to easily self-host “Bilbo Swash Caps”.

## Install

`npm install --save typeface-bilbo-swash-caps`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load Bilbo Swash Caps typeface
require('typeface-bilbo-swash-caps')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 1038 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
