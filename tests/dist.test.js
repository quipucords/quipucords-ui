const { execSync } = require('child_process');

describe('Distribution', () => {
  it('should match a specific file output', () => {
    const output = execSync('find ./dist -type f -print0 | xargs -0');

    const replacedGeneratedFilesMinsHash = output
      .toString()
      .replace(/^\s+|\s+|\n+|\r+$/g, '')
      .replace(/\.\/dist/gi, '~./dist')
      .replace(/\.([a-z0-9]+)\./gi, '*')
      .split('~')
      .sort();

    expect(replacedGeneratedFilesMinsHash).toMatchSnapshot('dist-output');
  });
});
