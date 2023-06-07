const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const {
  NODE_ENV: MODE,
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_HOST: HOST,
  _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
  _BUILD_PORT: PORT,
  _BUILD_SRC: SRC_DIR
} = setupDotenvFilesForEnv({ env: 'staging' });

const webpackCommon = require('./webpack.common');

module.exports = merge(
  {
    plugins: [
      ...setupWebpackDotenvFilesForEnv({
        directory: RELATIVE_DIRNAME,
        env: MODE
      }),
      new ESLintPlugin({
        context: SRC_DIR,
        failOnError: false
      })
    ]
  },
  webpackCommon(),
  {
    mode: MODE,
    devtool: 'eval-source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      })
    ],
    devServer: {
      host: HOST,
      port: PORT,
      compress: true,
      historyApiFallback: true,
      hot: true,
      devMiddleware: {
        stats: 'errors-only',
        writeToDisk: true
      },
      client: {
        overlay: false,
        progress: false
      },
      static: {
        directory: DIST_DIR
      },
      watchFiles: {
        paths: ['src/**/*', 'public/**/*']
      }
    }
  }
);
