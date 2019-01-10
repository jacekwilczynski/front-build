// Utilities
const path = require('path');

// Webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackClean = require('webpack-clean');

// The webpack config generator
module.exports = function getWebpackConfig({
  devMode = process.env.NODE_ENV === 'development',
  entry = './src/index.js',
  outputPath = 'dist',
  roots = [],
  remove,
  externals,
  alias
} = {}) {
  return {
    entry,
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
      ...(remove
        ? [new WebpackClean(remove.map(item => path.join(outputPath, item)))]
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
            options: { presets: ['@babel/preset-env'], sourceMap: devMode }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 2, sourceMap: devMode }
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
            {
              loader: 'sass-loader',
              options: {
                implementation: require('dart-sass'),
                sourceMap: devMode
              }
            }
          ]
        }
      ]
    }
  };
};
