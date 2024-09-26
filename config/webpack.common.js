/**
 * Helps set dotenv parameters that are used outside the `src` directory, like `public/index.html`
 *
 * @param {object} params
 * @param {boolean} params.isBrand Is branding activated
 * @param {string} params.brandName The branded product name
 * @param {string} params.name The original product code name
 */
const setBranding = ({ isBrand, brandName, name } = {}) => {
  const updatedName = (isBrand && brandName) || name;

  console.info(`Brand... IS_BRAND=${isBrand}`);
  console.info(`App name... NAME=${updatedName}`);

  process.env.REACT_APP_TEMPLATE_UI_NAME = updatedName;
};

module.exports = {
  setBranding
};
