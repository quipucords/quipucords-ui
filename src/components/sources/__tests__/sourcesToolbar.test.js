import { SourcesToolbar } from '../sourcesToolbar';

describe('SourcesToolbar', () => {
  it('should have specific properties', () => {
    expect(SourcesToolbar).toMatchSnapshot('SourcesToolbar');
  });
});
