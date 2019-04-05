const fs = require('fs');

describe('Templates', () => {
  const loadFile = file => (fs.existsSync(file) && fs.readFileSync(file, { encoding: 'utf-8' })) || '';

  it('should contain templates with a specific output', () => {
    expect(loadFile('./templates/base.html')).toMatchSnapshot('base');
    expect(loadFile('./templates/registration/login.html')).toMatchSnapshot('login');
    expect(loadFile('./templates/registration/logged_out.html')).toMatchSnapshot('logout');
  });
});
