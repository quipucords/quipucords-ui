import { SourceFilterFields, SourceSortFields } from '../sourceConstants';

describe('SourceTypes', () => {
  it('Should have specific sourceFilterFields properties', () => {
    expect(SourceFilterFields).toMatchSnapshot('sourceFilterFields');
  });

  it('Should have specific sourceSortFields properties', () => {
    expect(SourceSortFields).toMatchSnapshot('sourceSortFields');
  });
});
