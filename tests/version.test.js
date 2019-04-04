const fs = require('fs');

describe('Version', () => {
  it('should have a specific version output', () => {
    const file = './.env.production.local';

    expect(fs.existsSync(file)).toBe(true);

    const fileContents = fs.readFileSync(file, { encoding: 'utf-8' });
    expect(/^UI_VERSION=\d\.\d\.\d\.[a-z0-9]{7}$/i.test(fileContents.trim())).toBe(true);
  });
});
