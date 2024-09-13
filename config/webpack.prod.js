const fs = require('fs');
const path = require('path');
const { setBranding } = require('./webpack.common');

/**
 * Update a tsconfig file for webpack.
 * ts-loader ignores the "exclude" webpack configuration option therefore we dynamically update tsconfig.json to hide
 * test files. After the dynamic update and build we attempt a git clean up from "./scripts/post.sh".
 * Git clean up can be removed if the build is limited to specific environments other than development.
 *
 * @param filePath
 * @param addConfiguration
 * @param encoding
 */
const updateTsConfig = ({ filePath, addConfiguration, encoding = 'utf8' } = {}) => {
  try {
    // eslint-disable-next-line global-require
    const currentConfig = require(filePath);
    const updatedContents = `${JSON.stringify({ ...currentConfig, ...addConfiguration }, null, 2)}\n`;
    fs.writeFileSync(filePath, updatedContents, { encoding });
  } catch (e) {
    console.error('Updating tsconfig.json failed.', e.message);
  }
};

module.exports = ({ RELATIVE_DIRNAME, REACT_APP_UI_BRAND, REACT_APP_UI_BRAND_NAME, REACT_APP_UI_NAME } = {}) => {
  setBranding({ isBrand: REACT_APP_UI_BRAND === 'true', brandName: REACT_APP_UI_BRAND_NAME, name: REACT_APP_UI_NAME });

  updateTsConfig({
    filePath: path.resolve(RELATIVE_DIRNAME, 'tsconfig.json'),
    addConfiguration: {
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx'
      ]
    }
  });

  return {
    ignoreWarnings: [
      {
        message: /mini-css-extract-plugin/
      }
    ]
  };
};
