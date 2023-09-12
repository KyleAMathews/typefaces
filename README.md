>The Typefaces project is now deprecated.
>
>@DecliningLotus created
[FontSource](https://github.com/fontsource/fontsource) which provides the
same functionality as Typefaces but with automated releases & richer
support for importing specific weights, styles, or language subsets.
>
>To start using Fontsource, replace in your package.json any instances of
"typeface-*" with "@fontsource/*".
>
> Then change imports from e.g. "import 'typeface-roboto'" to "import '@fontsource/roboto/latin.css'".
>
>Typeface packages will continue working indefinitely so no immediate
>changes are necessary.

# Typefaces

NPM packages for Open Source typefaces — making it easier to self-host
webfonts.

https://www.bricolage.io/typefaces-easiest-way-to-self-host-fonts/

## Why

* Self-hosting is *significantly faster*. Loading a typeface from Google
  Fonts or other hosted font service adds *an extra (blocking) network
request*. [In my
testing](https://github.com/reactiflux/reactiflux.com/pull/21), I’ve
found replacing Google Fonts with a self-hosted font can improve a
site’s speed index by ~300 milliseconds on desktop and 1+ seconds on 3g.
This is a big deal.
* Your *fonts load offline*. It’s annoying to start working on a web
  project on the train or airplane and see your interface screwed up
because you can’t access Google fonts. I remember once being in this
situation and doing everything possible to avoid reloading a project as
I knew I’d lose the fonts and be forced to stop working.
* *Go beyond Google Fonts*. Some of my favorite typefaces aren’t on
  Google Fonts like [Clear Sans](https://01.org/clear-SANS), [Cooper
Hewitt](https://www.cooperhewitt.org/open-source-at-cooper-hewitt/cooper-hewitt-the-typeface-by-chester-jenkins/),
and
[Aleo](https://www.behance.net/gallery/8018673/ALEO-Free-Font-Family).
* All web(site|app) dependencies should be managed through NPM whenever
  possible. This the modern way.

## What

Each typeface package ships with all the necessary font files and css to
self-host an open source typeface.

All Google Fonts have been added as well as a small but growing list of
other open source fonts. Open an issue if you want a font added!

## How

Couldn’t be easier. This is how you’d add Open Sans.

```
npm install --save typeface-open-sans
```

Then in your app or site’s entry file.

```javascript
require("typeface-open-sans")
```

And that’s it! You’re now self-hosting Open Sans!

It should take < 5 minutes to swap out Google Fonts.

Typeface assumes you’re using webpack with loaders setup for loading css
and font files (you can use Typeface with other setups but webpack makes
things really really simple). Assuming your webpack configuration is
setup correctly you then just need to require the typeface in the entry
file for your project.

Many tools built with webpack such as
[Gatsby](https://github.com/gatsbyjs/gatsby) and [Create React
App](https://github.com/facebookincubator/create-react-app) are already
setup to work with Typefaces. Gatsby by default also embeds your CSS in
your `<head>` for even faster loading.

If you’re not using webpack or equivalent tool that allows you to
require css, then you’ll need to manually integrate the index.css and
font files from the package into your build system.

### Alternatives without Webpack

- For Ember users, there is an addon https://github.com/jeffjewiss/ember-typeface

## Adding other fonts

The easiest way to find out if your favorite typeface is supported is by
searching on NPM or in the packages directory in this repo.

I’d love to see every open source font on NPM! Open an issue if a
favorite typeface of yours is missing. I’ve programmatically published
all fonts from Google Fonts and am planning on doing the same with fonts
hosted on FontSquirrel through [their
API](https://www.fontsquirrel.com/blog/2010/12/the-font-squirrel-api).

## Other ideas to explore

* Add subsetted version of every font.
* Initially I’ve just added support for the Latin version of fonts.
  Would love to hear ideas for how to support other languages. Perhaps
additional css files e.g. `require('open-sans/greek.css')`?
* Ship fallback css helpers — figuring out your fallback css isn’t
  particularly easy. Perhaps there’s a way to automate this. E.g. if
you’re using typeface X at font size Y with fallback font Z, here’s a
function to generate the fallback css.
* Explore further optimizations for loading fonts.
  https://www.zachleat.com/web/comprehensive-webfonts/ has a long list.
Most require painful per-project scripting. What if the best strategies
could be automated?
