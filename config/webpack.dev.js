const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const {
  NODE_ENV: MODE,
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_HOST: HOST,
  _BUILD_OPEN_PATH: OPEN_PATH,
  _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
  _BUILD_PORT: PORT,
  _BUILD_SRC: SRC_DIR
} = setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

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
    devServer: {
      ...(OPEN_PATH && { open: [OPEN_PATH] }),
      host: HOST,
      port: PORT,
      compress: true,
      historyApiFallback: true,
      hot: true,
      devMiddleware: {
        stats: 'errors-only',
        writeToDisk: false
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
      },
      proxy: [
        {
          context: ['/credentials', '/jobs', '/ping', '/reports', '/sources', '/scans', '/status', '/token', '/users'],
          target: 'http://0.0.0.0:8000',
          secure: false
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      })
    ]
  }
);
