/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { rimrafSync } = require('rimraf');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./build.dotenv');

const {
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_OUTPUT_ONLY: OUTPUT_ONLY,
  _BUILD_PUBLIC_PATH: PUBLIC_PATH,
  _BUILD_RELATIVE_DIRNAME: RELATIVE_DIRNAME,
  _BUILD_SRC_DIR: SRC_DIR,
  _BUILD_STATIC_DIR: STATIC_DIR,
  _BUILD_UI_NAME: UI_NAME
} = setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

if (OUTPUT_ONLY !== true) {
  console.info(
    `\nPrepping files...\n\tSRC DIR: ${SRC_DIR}\n\tOUTPUT DIR: ${DIST_DIR}\n\tPUBLIC PATH: ${PUBLIC_PATH}\n`
  );
}

console.info(`\nCleaning output directory...\n\t${DIST_DIR}\n`);
rimrafSync(DIST_DIR);

module.exports = () => ({
  entry: {
    app: path.join(SRC_DIR, 'index.tsx')
  },
  output: {
    filename: '[name].bundle.js',
    path: DIST_DIR,
    publicPath: PUBLIC_PATH,
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx)?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        include: input => input.indexOf('fonts') > -1 || input.indexOf('pficon') > -1,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.svg$/i,
        include: input => input.indexOf('fonts') === -1 || input.indexOf('pficon') === -1,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 5000 }
        },
        generator: {
          dataUrl: content => svgToMiniDataURI(content.toString()),
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 5000 }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    ...setupWebpackDotenvFilesForEnv({
      directory: RELATIVE_DIRNAME
    }),
    new HtmlWebpackPlugin({
      ...(UI_NAME && { title: UI_NAME }),
      template: path.join(STATIC_DIR, 'index.html')
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: /%([A-Z_]+)%/g,
        replacement: (match, $1) => process.env?.[$1] || match
      }
    ]),
    ...(() => {
      try {
        const fileResults = fs
          .readdirSync(STATIC_DIR)
          ?.filter(fileDir => !/^(\.|index)/.test(fileDir))
          ?.map(fileDir => ({
            from: path.join(STATIC_DIR, fileDir),
            to: path.join(DIST_DIR, fileDir)
          }));

        return (
          (fileResults?.length > 0 && [
            new CopyPlugin({
              patterns: fileResults
            })
          ]) ||
          []
        );
      } catch (e) {
        console.error(`./config/webpack.common.js copy plugin error: ${e.message}`);
        return [];
      }
    })()
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ],
    symlinks: false,
    cacheWithContext: false
  }
});
