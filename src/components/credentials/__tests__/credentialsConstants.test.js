import { CredentialFilterFields, CredentialSortFields } from '../credentialConstants';

describe('CredentialTypes', () => {
  it('should have specific CredentialFilterFields properties', () => {
    expect(CredentialFilterFields).toMatchSnapshot('CredentialFilterFields');
  });

  it('should have specific CredentialSortFields properties', () => {
    expect(CredentialSortFields).toMatchSnapshot('CredentialSortFields');
  });
});
