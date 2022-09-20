import { CredentialsToolbar } from '../credentialsToolbar';

describe('CredentialsToolbar', () => {
  it('should have specific properties', () => {
    expect(CredentialsToolbar).toMatchSnapshot('CredentialsToolbar');
  });
});
