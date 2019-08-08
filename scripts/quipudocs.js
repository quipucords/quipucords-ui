const fs = require('fs');
const { ea, install, locales, user } = require('quipudocs');
const installDocFileOutput = './public/docs/install.html';
const useDocFileOutput = './public/docs/use.html';
const localesFileOutput = './public/locales/locales.json';
const localesDir = './public/locales/';

const buildDocs = ({ buildUserDocs = true, buildInstallDocs = false }) => {
  try {
    const isBrand = process.argv.slice(2)[0] === '-b';

    if (buildUserDocs) {
      const useFile = useDocFileOutput;
      const userContent = (isBrand && user['index-brand'].content) || user.index.content;
      fs.writeFileSync(useFile, userContent);
    }

    if (buildInstallDocs) {
      const installFile = installDocFileOutput;
      const installContent = (isBrand && install['index-brand'].content) || install.index.content;
      fs.writeFileSync(installFile, installContent);
    }

    console.info(`Building docs... DOCS_BRAND=${isBrand}...Complete`);
  } catch (e) {
    console.error(`\x1b[31mDocs build error: ${e.message}\x1b[0m`);
  }
};

const buildEa = () => {
  try {
    const fileOutput = localesFileOutput;
    const dir = localesDir;
    const localesJSON = locales;
    const eaJSON = ea;

    fs.writeFileSync(fileOutput, JSON.stringify(localesJSON, null, 2));

    Object.keys(eaJSON).forEach(key => {
      fs.writeFileSync(`${dir}${key}.json`, JSON.stringify(eaJSON[key], null, 2));
    });

    console.info(`Building locale files...Complete`);
  } catch (e) {
    console.error(`\x1b[31mLocale build error: ${e.message}\x1b[0m`);
  }
};

buildDocs({});
buildEa();
