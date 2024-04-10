/**
 * Tests for Display Helpers
 *
 * Validates accuracy and consistency of information display helpers. Includes various input scenarios and formatting checks.
 */
import moment from 'moment';
import { CredentialType } from 'src/types';
import { helpers } from '../helpers';

const { getTimeDisplayHowLongAgo, getAuthType, authType } = helpers;

it('should return the correct time difference when the timestamp is in the past', () => {
  const timestamp = moment().subtract(2, 'hours').toISOString();
  const timeAgo = getTimeDisplayHowLongAgo(timestamp);
  const expectedTimeAgo = '2 hours ago';
  expect(timeAgo).toBe(expectedTimeAgo);
});

it('should return "a few seconds ago" for a timestamp that is less than a minute old', () => {
  const timestamp = moment().subtract(30, 'seconds').toISOString();
  const timeAgo = getTimeDisplayHowLongAgo(timestamp);
  expect(timeAgo).toBe('a few seconds ago');
});

it('should return "a minute ago" for a timestamp that is exactly one minute old', () => {
  const timestamp = moment().subtract(1, 'minute').toISOString();
  const timeAgo = getTimeDisplayHowLongAgo(timestamp);
  expect(timeAgo).toBe('a minute ago');
});

it('should return "a month ago" for a timestamp that is more than a month old', () => {
  const timestamp = moment().subtract(1, 'month').subtract(1, 'day').toISOString();
  const timeAgo = getTimeDisplayHowLongAgo(timestamp);
  expect(timeAgo).toBe('a month ago');
});

it('should return "a day ago" for a timestamp that is more than 24 hours old', () => {
  const timestamp = moment().subtract(25, 'hours').toISOString();
  const timeAgo = getTimeDisplayHowLongAgo(timestamp);
  expect(timeAgo).toBe('a day ago');
});

it('should throw an error if the given timestamp is not a valid date', () => {
  const timestamp = 'invalid';
  expect(() => {
    getTimeDisplayHowLongAgo(timestamp);
  }).toThrow('Invalid timestamp');
});

it('should return AuthType.UsernameAndPassword when credential has username and password', () => {
  const mockCredential: CredentialType = {
    id: 'mockId',
    name: 'mockName',
    created_at: new Date(),
    updated_at: new Date(),
    cred_type: 'mockCredType',
    username: 'testUser',
    password: 'testPassword',
    ssh_keyfile: '',
    auth_token: '',
    ssh_passphrase: '',
    become_method: '',
    become_user: '',
    become_password: '',
    sources: []
  };
  const result = getAuthType(mockCredential);
  expect(result).toBe(authType.UsernameAndPassword);
});

it('should return AuthType.Token when credential has auth_token', () => {
  const mockCredential: CredentialType = {
    id: 'mockId',
    name: 'mockName',
    created_at: new Date(),
    updated_at: new Date(),
    cred_type: 'mockCredType',
    username: '',
    password: '',
    ssh_keyfile: '',
    auth_token: 'mockToken',
    ssh_passphrase: '',
    become_method: '',
    become_user: '',
    become_password: '',
    sources: []
  };
  const result = getAuthType(mockCredential);
  expect(result).toBe(authType.Token);
});

it('should return AuthType.SSHKeyFile when credential has ssh_keyfile', () => {
  const mockCredential: CredentialType = {
    id: 'mockId',
    name: 'mockName',
    created_at: new Date(),
    updated_at: new Date(),
    cred_type: 'mockCredType',
    username: '',
    password: '',
    ssh_keyfile: 'mockSSH',
    auth_token: '',
    ssh_passphrase: '',
    become_method: '',
    become_user: '',
    become_password: '',
    sources: []
  };
  const result = getAuthType(mockCredential);
  expect(result).toBe(authType.SSHKeyFile);
});

it('should throw an error when credential has no authentication information', () => {
  const credential: CredentialType = {
    id: '1',
    name: 'Test Credential',
    created_at: new Date(),
    updated_at: new Date(),
    cred_type: 'test',
    username: '',
    password: '',
    ssh_keyfile: '',
    auth_token: '',
    ssh_passphrase: '',
    become_method: '',
    become_user: '',
    become_password: '',
    sources: []
  };

  expect(() => {
    getAuthType(credential);
  }).toThrow('Unknown credential type');
});
