const fs = require('fs');
const { execSync } = require('child_process');

describe('Application branding', () => {
  const loadFile = file => (fs.existsSync(file) && fs.readFileSync(file, { encoding: 'utf-8' })) || '';
  const trimSortDistList = str =>
    str
      .replace(/\s+|\n+|\r+/g, '')
      .replace(/\.\/dist/gi, '~./dist')
      .replace(/\.([a-z0-9]+)\./gi, '*')
      .split('~')
      .sort();

  it('should produce a local environment configuration', () => {
    const envFile = loadFile('./.env');
    const envProductionLocalFile = loadFile('./.env.production.local');

    const envProductionLocalUiName = envProductionLocalFile.match(/\bUI_NAME=(.*)\n/i)[1];
    const envProductionLocalUiShortName = envProductionLocalFile.match(/\bUI_SHORT_NAME=(.*)\n/i)[1];
    const envProductionLocalUiSentenceStartName = envProductionLocalFile.match(/\bUI_SENTENCE_START_NAME=(.*)\n/i)[1];

    expect(envProductionLocalUiName && new RegExp(`=${envProductionLocalUiName}\n`).test(envFile)).toBe(true);
    expect(envProductionLocalUiShortName && new RegExp(`=${envProductionLocalUiShortName}\n`).test(envFile)).toBe(true);
    expect(
      envProductionLocalUiSentenceStartName && new RegExp(`=${envProductionLocalUiSentenceStartName}\n`).test(envFile)
    ).toBe(true);
  });

  it('should have a specific branding file output', () => {
    const envProductionLocalFile = loadFile('./.env.production.local');

    const uiName = envProductionLocalFile.match(/\bUI_NAME=(.*)\n/i)[1];
    const uiShortName = envProductionLocalFile.match(/\bUI_SHORT_NAME=(.*)\n/i)[1];
    const uiSentenceStartName = envProductionLocalFile.match(/\bUI_SENTENCE_START_NAME=(.*)\n/i)[1];

    // ToDo: Reactive name check when Quipudocs "dist" is updated
    // const uiNameWithinDocs = parseInt(execSync(`grep -r "${uiName}" ./dist/client/docs | wc -l`).toString(), 10);
    // expect(uiNameWithinDocs).toBeGreaterThanOrEqual(1);

    const uiNameWithinTemplates = execSync(`grep -rl "${uiName}" ./dist/templates`).toString();
    const uiNameWithinGui = execSync(`grep -rl "${uiName}" ./dist/client/static/js`).toString();
    const uiShortNameWithinGui = execSync(`grep -rl "${uiShortName}" ./dist/client/static/js`).toString();
    const uiSentenceStartNameWithinGui = execSync(
      `grep -rl "${uiSentenceStartName}" ./dist/client/static/js`
    ).toString();

    expect(trimSortDistList(uiNameWithinTemplates)).toMatchSnapshot('ui name within templates');
    expect(trimSortDistList(uiNameWithinGui)).toMatchSnapshot('ui name within GUI');
    expect(trimSortDistList(uiShortNameWithinGui)).toMatchSnapshot('ui short name within GUI');
    expect(trimSortDistList(uiSentenceStartNameWithinGui)).toMatchSnapshot('ui sentence name within GUI');
  });
});
