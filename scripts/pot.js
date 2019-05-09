const { GettextExtractor, JsExtractors } = require('gettext-extractor');
const fs = require('fs');
const dir = './i18n';
const file = `${dir}/app.pot`;

const extractor = new GettextExtractor();
extractor
  .createJsParser([
    JsExtractors.callExpression(['t', '[this].t'], {
      arguments: {
        text: 0,
        context: 1
      }
    })
  ])
  .parseFilesGlob('./src/components/**/*!(.test|.spec).@(js|jsx)');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

extractor.savePotFile(file);
extractor.printStats();

console.info(`Strings file saved: ${file}\n`);
