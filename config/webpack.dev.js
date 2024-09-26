const { EslintWebpackPlugin } = require('weldable/lib/packages');
const { setBranding } = require('./webpack.common');

module.exports = ({
  SRC_DIR,
  PROTOCOL,
  MOCK_PORT,
  HOST,
  REACT_APP_UI_BRAND,
  REACT_APP_UI_BRAND_NAME,
  REACT_APP_UI_NAME
} = {}) => {
  setBranding({ isBrand: REACT_APP_UI_BRAND === 'true', brandName: REACT_APP_UI_BRAND_NAME, name: REACT_APP_UI_NAME });

  return {
    plugins: [
      new EslintWebpackPlugin({
        context: SRC_DIR,
        failOnError: false
      })
    ],
    devServer: {
      server: `${PROTOCOL}`,
      proxy: [
        {
          context: ['/api'],
          target: `${PROTOCOL}://${HOST}:${MOCK_PORT}`,
          secure: false
        }
      ]
    }
  };
};
