import { credentialsTableCells } from '../credentialsTableCells';

describe('CredentialsTableCells', () => {
  it('should export specific function components', () => {
    expect(credentialsTableCells).toMatchSnapshot('function components');
  });

  it('should return consistent cell results', () => {
    Object.entries(credentialsTableCells).forEach(([key, value]) =>
      expect(value()).toMatchSnapshot(`basic ${key} cell`)
    );
  });
});
