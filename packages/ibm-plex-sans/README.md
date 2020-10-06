>The Typefaces project is now deprecated.

@DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weights, styles, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-ibm-plex-sans" with "fontsource-ibm-plex-sans".
>
> Then change imports from "import 'typeface-ibm-plex-sans'" to "import 'fontsource-ibm-plex-sans/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-ibm-plex-sans

The CSS and web font files to easily self-host “IBM Plex Sans”.

## Install

`npm install --save typeface-ibm-plex-sans`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load IBM Plex Sans typeface
require('typeface-ibm-plex-sans')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 1037 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
