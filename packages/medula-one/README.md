>The Typefaces project is now deprecated. @DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weight, style, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-medula-one" with "fontsource-medula-one".
>
> Then change imports from "import 'typeface-medula-one'" to "import 'fontsource-medula-one/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# typeface-medula-one

The CSS and web font files to easily self-host “Medula One”.

## Install

`npm install --save typeface-medula-one`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff) and a CSS file with
font-face declarations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load Medula One typeface
require('typeface-medula-one')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 1039 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
