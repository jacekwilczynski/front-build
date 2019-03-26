# front-build
Hide away the ugliness of Webpack configuration.

## The idea
You write a small `webpack.config.js` with only the stuff that's relevant to your project. Let the `getWebpackConfig` function handle the rest.

### Examples

#### Just compile my Sass
```JS
module.exports = require('./getWebpackConfig')({
  styles: {
    'style-main': './sass/index.scss'
  }
};
```
Creates `build/style-mainmainStyle.css`.

#### Just compile my JavaScript
```JS
module.exports = require('./getWebpackConfig')({
  scripts: {
    'script-main': './js/index.js'
  }
};
```
Creates `build/script-main.js`.

#### Compile Sass and JavaScript
```JS
module.exports = require('./getWebpackConfig')({
  styles: { style: './sass/index.scss' },
  scripts: { script: './js/index.js' }
};
```
Creates:
- `build/style.css`
- `build/script.js`

**NOTE:** Styles and scripts should use different keys. For example, it's not safe to do this:

```JS
module.exports = require('./getWebpackConfig')({
  styles: { index: './sass/index.scss' },
  scripts: { index: './sass/index.js' }
};
```

## Getting started

1. Clone the repo or download `getWebpackConfig.js` and install the dependencies from `package.json` yourself.

2. Create your simple `webpack.config.js`.

3. Run:
- `yarn start` - development watch mode
- `yarn build` - build for production
