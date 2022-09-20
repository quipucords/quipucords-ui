import { ScansToolbar } from '../scansToolbar';

describe('ScansToolbar', () => {
  it('should have specific properties', () => {
    expect(ScansToolbar).toMatchSnapshot('ScansToolbar');
  });
});
