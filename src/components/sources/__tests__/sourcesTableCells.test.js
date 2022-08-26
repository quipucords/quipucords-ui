import { sourcesTableCells } from '../sourcesTableCells';

describe('SourcesTableCells', () => {
  it('should export specific function components', () => {
    expect(sourcesTableCells).toMatchSnapshot('function components');
  });

  it('should return consistent cell results', () => {
    Object.entries(sourcesTableCells).forEach(([key, value]) => expect(value()).toMatchSnapshot(`basic ${key} cell`));
  });
});
