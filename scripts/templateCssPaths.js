const fs = require('fs');
const templateCss = './src/styles/.css/index.css';

/**
 * Update template css font path references
 *
 * @param {string} file
 */
const templateCssPaths = (file = templateCss) => {
  try {
    let fileOutput;

    if (fs.existsSync(file)) {
      fileOutput = fs.readFileSync(file, 'utf-8');
    }

    const updatedFileOutput = fileOutput
      .replace('"./assets/fonts";', '"/static/media";')
      .replace('"./assets/pficon";', '"/static/media";')
      .replace(/url\("\.\/assets\/([a-z\-A-Z]+\/){0,3}/g, 'url("/static/media/');

    fs.writeFileSync(file, updatedFileOutput);

    console.info(`Update template CSS file paths...Complete`);
  } catch (e) {
    console.error(`\x1b[31mUpdate template CSS file paths... Error: ${e.message}\x1b[0m`);
  }
};

templateCssPaths();
