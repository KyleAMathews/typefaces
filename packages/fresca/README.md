
# typeface-fresca

The CSS and web font files to easily self-host “Fresca”.

## Install

`npm install --save typeface-fresca`

## Use

Typefaces assume you’re using webpack to process CSS and files. Each typeface
package includes all necessary font files (woff2, woff, eot, ttf, svg) and
a CSS file with font-face declerations pointing at these files.

You will need to have webpack setup to load css and font files. Many tools built
with Webpack will work out of the box with Typefaces such as [Gatsby](https://github.com/gatsbyjs/gatsby)
and [Create React App](https://github.com/facebookincubator/create-react-app).

To use, simply require the package in your project’s entry file e.g.

```javascript
// Load Fresca typeface
require('typeface-fresca')
```

## About the Typefaces project.

Our goal is to add all open source fonts to NPM to simplify using great fonts in
our web projects. We’re currently maintaining 845 typeface packages
including all typefaces on Google Fonts.

If your favorite typeface isn’t published yet, [let us know](https://github.com/KyleAMathews/typefaces)
and we’ll add it!
