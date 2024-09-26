const { setBranding } = require('./webpack.common');

module.exports = ({ REACT_APP_UI_BRAND, REACT_APP_UI_BRAND_NAME, REACT_APP_UI_NAME } = {}) => {
  setBranding({ isBrand: REACT_APP_UI_BRAND === 'true', brandName: REACT_APP_UI_BRAND_NAME, name: REACT_APP_UI_NAME });

  return {
    ignoreWarnings: [
      {
        message: /mini-css-extract-plugin/
      }
    ]
  };
};
