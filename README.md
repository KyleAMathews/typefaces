# typefaces
NPM packages for Open Source typefaces — making it easier to self-host
webfonts.

## Why
* Self-hosting is faster. Loading a typeface from Google Fonts or other
  hosted font service adds two extra network requests compared to
self-hosting — one to load their css file and then to load fonts.
Replacing Google Fonts with Typeface can speed page loads by
~300 miliseconds on desktop and 1+ seconds on 3g.
* Works offline. It's annoying to start working on a web project on the
  train or airplane and have your interface be screwed up because you
can't access Google fonts.
* Go beyond Google Fonts — there are many amazing fonts not on Google
  Fonts like [Clear Sans](https://01.org/clear-SANS), [Cooper
Hewitt](https://www.cooperhewitt.org/open-source-at-cooper-hewitt/cooper-hewitt-the-typeface-by-chester-jenkins/),
and [Aleo](https://www.fontsquirrel.com/fonts/aleo). Now they're easy to use with
Typefaces.

## What
Each typeface package ships with all the necessary font files and css to
serve an open source typeface.

All Google Fonts have been added as well as a small but growing list of
other open source fonts. Open an issue if you want a font added!

## How
Couldn't be easier. This is how you'd add Open Sans.

```
npm install --save typeface-open-sans
```

Then in your app or site's entry file.

```javascript
require("typeface-open-sans")
```

And that's it! You're now self-hosting Open Sans!

It should take < 5 minutes to swap out Google Fonts.

Typeface assumes you're using webpack with loaders setup for loading css
and font files (you can use Typeface with other setups but webpack makes
things really really simple). Assuming your webpack configuration is
setup correctly you then just need to require the typeface in the entry
file for your project.

Many tools built with webpack such as
[Gatsby](github.com/gatsbyjs/gatsby) and [Create React
App](https://github.com/facebookincubator/create-react-app) are already
setup to work with Typefaces. Gatsby by default also embeds your CSS in
your `<head>` for even faster loading.

If you're not using webpack or equivalent tool that allows you to
require css, then you'll need to manually integrate the index.css and font files from
the package into your build system.

## Adding other fonts
I'd love to see every open source font on NPM! Open an issue if a
favorite typeface of yours is missing. I've programmatically published
all fonts from Google Fonts and am planning on doing the same with fonts
hosted on FontSquirrel through [their
API](https://www.fontsquirrel.com/blog/2010/12/the-font-squirrel-api).

## Other ideas to explore

* Add subsetted version of every font.
* Initially I've just added support for the Latin version of fonts.
  Would love to hear ideas for how to support other languages. Perhaps
additional css files e.g. `require('open-sans/greek')`?
* Ship fallback css helpers — figuring out your fallback css isn't particularly
easy. Perhaps there's a way to automate this. E.g. if you're using
typeface X at fontsize Y with fallback font Z, here's a function to
generate the fallback css.
* Explore futher optimizations for loading fonts.
  https://www.zachleat.com/web/comprehensive-webfonts/ has a long list.
Most require painful per-project scripting. What if the best strategies
could be automated?
