import { ScanFilterFields, ScanSortFields } from '../scanConstants';

describe('ScanTypes', () => {
  it('Should have specific scanFilterFields properties', () => {
    expect(ScanFilterFields).toMatchSnapshot('scanFilterFields');
  });

  it('Should have specific scanSortFields properties', () => {
    expect(ScanSortFields).toMatchSnapshot('scanSortFields');
  });
});
