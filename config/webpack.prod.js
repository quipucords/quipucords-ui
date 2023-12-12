/* eslint-disable @typescript-eslint/no-var-requires */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');
const { NODE_ENV: MODE, _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME } = setupDotenvFilesForEnv({
  env: process.env.NODE_ENV
});
const webpackCommon = require('./webpack.common');

module.exports = merge(
  {
    plugins: [
      ...setupWebpackDotenvFilesForEnv({
        directory: RELATIVE_DIRNAME,
        env: MODE
      })
    ]
  },
  webpackCommon(),
  {
    mode: MODE,
    devtool: undefined,
    output: {
      chunkFilename: '[name].[contenthash:8].chunk.js',
      filename: '[name].[contenthash:8].js'
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserJSPlugin({
          parallel: true
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', { mergeLonghand: false }]
          }
        })
      ],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            chunks: 'all',
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/
          }
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: '[name].[contenthash:8].chunk.css',
        filename: '[name].[contenthash:8].css'
      })
    ]
  }
);
