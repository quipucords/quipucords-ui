const fs = require('fs');
const { ea, install, locales, user } = require('quipudocs');
const installDocFileOutput = './public/docs/install.html';
const useDocFileOutput = './public/docs/use.html';
const localesFileOutput = './public/locales/locales.json';
const localesDir = './public/locales/';

const buildDocs = () => {
  try {
    const installFile = installDocFileOutput;
    const useFile = useDocFileOutput;
    const isBrand = !!process.env.REACT_APP_RH_BRAND;
    const installContent = (isBrand && install['index-brand'].content) || install.index.content;
    const userContent = (isBrand && user['index-brand'].content) || user.index.content;

    fs.writeFileSync(installFile, installContent);
    fs.writeFileSync(useFile, userContent);
  } catch (e) {
    console.warn('Docs build error:', e.message);
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
  } catch (e) {
    console.warn('EA build error:', e.message);
  }
};

buildDocs();
buildEa();
