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
  remove
} = {}) {
  return {
    entry,
    output: outputPath && { path: path.resolve(outputPath) },
    mode: devMode ? 'development' : 'production',
    devtool: devMode && 'cheap-module-eval-source-map',
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
            options: { presets: ['@babel/preset-env'] }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 2 }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(),
                  require('css-mqpacker')({ sort: true }),
                  require('postcss-combine-duplicated-selectors')(),
                  require('cssnano')()
                ]
              }
            },
            'sass-loader'
          ]
        }
      ]
    }
  };
};
