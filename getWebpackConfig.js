// Utilities
const path = require('path');

// Webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackClean = require('webpack-clean');

// The webpack config generator
module.exports = function getWebpackConfig({
  devMode = process.env.NODE_ENV === 'development',
  scripts = {},
  styles = {},
  roots = [],
  outputPath = 'build',
  externals,
  alias
} = {}) {
  const toRemove = Object.keys(styles).map(key => key + '.js');
  return {
    entry: { ...scripts, ...styles },
    externals,
    output: outputPath && { path: path.resolve(outputPath) },
    mode: devMode ? 'development' : 'production',
    devtool: devMode && 'inline-source-map',
    resolve: {
      alias,
      modules: [
        ...roots.map(dir => path.resolve(__dirname, dir)),
        'node_modules'
      ]
    },
    plugins: [
      ...(toRemove
        ? [new WebpackClean(toRemove.map(item => path.join(outputPath, item)))]
        : []),
      new CleanWebpackPlugin([outputPath]),
      new MiniCssExtractPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-decorators', { legacy: true }]
              ],
              sourceMap: devMode
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 3, sourceMap: devMode }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: devMode,
                plugins: [
                  require('autoprefixer')(),
                  require('css-mqpacker')({ sort: true }),
                  require('postcss-combine-duplicated-selectors')(),
                  require('cssnano')()
                ]
              }
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('dart-sass'),
                sourceMap: true,
                sourceMapContents: true
              }
            }
          ]
        }
      ]
    }
  };
};
