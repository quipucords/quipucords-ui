const { EslintWebpackPlugin } = require('weldable/lib/packages');

module.exports = ({ SRC_DIR, PROTOCOL, MOCK_PORT, HOST } = {}) => ({
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
});
