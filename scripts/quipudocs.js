const fs = require('fs');
const { ea, locales, user } = require('quipudocs');
const _merge = require('lodash/merge');
const localesFileOutput = './public/locales/locales.json';
const localesDir = './public/locales/';

const buildEa = () => {
  try {
    const fileOutput = localesFileOutput;
    const dir = localesDir;
    const localesJSON = locales;
    const eaJSON = ea;
    let currentFileOutput = {};

    if (fs.existsSync(fileOutput)) {
      currentFileOutput = JSON.parse(fs.readFileSync(fileOutput, 'utf-8'));
    }

    fs.writeFileSync(fileOutput, JSON.stringify(_merge(currentFileOutput, localesJSON), null, 2));

    Object.keys(eaJSON).forEach(key => {
      const langFile = `${dir}${key}.json`;
      let currentLangFile = {};

      if (fs.existsSync(langFile)) {
        currentLangFile = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
      }

      fs.writeFileSync(langFile, JSON.stringify(_merge(currentLangFile, eaJSON[key]), null, 2));
    });

    console.info(`Building locale files...Complete`);
  } catch (e) {
    console.error(`\x1b[31mLocale build error: ${e.message}\x1b[0m`);
  }
};

buildEa();
