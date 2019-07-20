const { execSync } = require('child_process');

describe('Distribution', () => {
  const trimSortDistList = str =>
    str
      .replace(/\s+|\n+|\r+/g, '')
      .replace(/\.\/dist/gi, '~./dist')
      .replace(/\.([a-z0-9]+)\./gi, '*')
      .split('~')
      .sort();

  it('should match a specific file output', () => {
    const output = execSync('find ./dist -type f -print0 | xargs -0').toString();

    expect(trimSortDistList(output)).toMatchSnapshot('dist-output');
  });

  it('should not contain references to localhost', () => {
    const output = execSync(`grep -roi "localhost:" ./dist/client/static | wc -l`).toString();

    expect(Number.parseInt(output.trim(), 10)).toBe(0);
  });
});
