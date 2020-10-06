>The Typefaces project is now deprecated. @DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing weight, style, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-lexend-tera" with "fontsource-lexend-tera"
>
> Then change imports from "import 'typeface-lexend-tera'" to "import 'fontsource-lexend-tera/latin.css'"
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-lexend-tera

The CSS and web font files to easily self-host “Lexend Tera”.

## Install

`npm install --save typeface-lexend-tera`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load Lexend Tera typeface
require('typeface-lexend-tera')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 1040 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
