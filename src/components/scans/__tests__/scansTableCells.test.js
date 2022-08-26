import { scansTableCells } from '../scansTableCells';

describe('ScansTableCells', () => {
  it('should export specific function components', () => {
    expect(scansTableCells).toMatchSnapshot('function components');
  });

  it('should return consistent cell results', () => {
    Object.entries(scansTableCells).forEach(([key, value]) => expect(value()).toMatchSnapshot(`basic ${key} cell`));
  });
});
