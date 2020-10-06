>The Typefaces project is now deprecated. @DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weight, style, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-modern-antiqua" with "fontsource-modern-antiqua".
>
> Then change imports from "import 'typeface-modern-antiqua'" to "import 'fontsource-modern-antiqua/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-modern-antiqua

The CSS and web font files to easily self-host “Modern Antiqua”.

## Install

`npm install --save typeface-modern-antiqua`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load Modern Antiqua typeface
require('typeface-modern-antiqua')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 1039 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
