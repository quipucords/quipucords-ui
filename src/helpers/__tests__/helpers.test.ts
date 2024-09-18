/**
 * Tests for Display Helpers
 *
 * Validates accuracy and consistency of information display helpers. Includes various input scenarios and formatting
 * checks.
 */
import React from 'react';
import moment from 'moment';
import { helpers } from '../helpers';

describe('getTimeDisplayHowLongAgo', () => {
  it(`should return a timestamp estimate`, () => {
    expect([
      helpers.getTimeDisplayHowLongAgo(moment().subtract(30, 'seconds')),
      helpers.getTimeDisplayHowLongAgo(moment().subtract(1, 'month')),
      helpers.getTimeDisplayHowLongAgo(moment().subtract(25, 'hours'))
    ]).toMatchSnapshot('timestamps');
  });

  it(`should throw an error if the timestamp is not valid`, () => {
    expect(() => helpers.getTimeDisplayHowLongAgo(null)).toThrow(`Invalid timestamp: null`);
    expect(() => helpers.getTimeDisplayHowLongAgo(undefined)).toThrow(`Invalid timestamp: undefined`);
    expect(() => helpers.getTimeDisplayHowLongAgo('')).toThrow(`Invalid timestamp: `);
  });
});

describe('generateId', () => {
  it('should support generated strings and flags', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });
});

describe('getAuthType', () => {
  const generateAuthType = partialCredential =>
    helpers.getAuthType({
      id: 'mockId',
      name: 'mockName',
      created_at: new Date(),
      updated_at: new Date(),
      cred_type: 'mockCredType',
      username: undefined,
      password: undefined,
      ssh_key: undefined,
      auth_token: undefined,
      ssh_passphrase: undefined,
      become_method: undefined,
      become_user: undefined,
      become_password: undefined,
      sources: [],
      auth_type: undefined,
      ...partialCredential
    });

  it(`should return a credential type`, () => {
    expect([
      generateAuthType({ auth_type: 'password' }),
      generateAuthType({ auth_type: 'auth_token' }),
      generateAuthType({ auth_type: 'ssh_key' }),
      generateAuthType({ auth_type: 'ssh_keyfile' }),
      generateAuthType({ auth_type: 'lorem' }),
      generateAuthType({ auth_type: 'ipsum' })
    ]).toMatchSnapshot('credentialTypes');
  });
});

describe('noopTranslate', () => {
  it('should format key, value, and components into a string', () => {
    const key = 'testKey';
    const value = 'testValue';
    const components = [
      React.createElement('div', { key: '1' }, 'Component 1'),
      React.createElement('span', { key: '2' }, 'Component 2')
    ];

    const result = helpers.noopTranslate(key, value, components);

    expect(result).toBe(`t(${key}, ${value}, ${components})`);
  });

  it('should handle array keys and values', () => {
    const key = ['key1', 'key2'];
    const value = ['value1', 'value2'];

    const result = helpers.noopTranslate(key, value, []);

    expect(result).toBe(`t([key1,key2], [value1,value2])`);
  });

  it('should handle empty components', () => {
    const key = 'testKey';
    const value = 'testValue';

    const result = helpers.noopTranslate(key, value, []);

    expect(result).toBe(`t(${key}, ${value})`);
  });
});

describe('formatDate', () => {
  it('should format the date correctly in UTC', () => {
    const date = new Date('2022-01-01T12:00:00Z');
    const formattedDate = helpers.formatDate(date);

    expect(formattedDate).toBe('01 January 2022, 12:00 PM UTC');
  });
});

describe('normalizeTotal', () => {
  it('should normalize total values', () => {
    expect(helpers.normalizeTotal({ count: 142 }, true, undefined)).toBe(42);
    expect(helpers.normalizeTotal({}, true, undefined)).toBe(0);
    expect(helpers.normalizeTotal({ count: 142 }, false, undefined)).toBe(142);
    expect(helpers.normalizeTotal({ count: 142 }, true, 50)).toBe(42);
  });
});

describe('downloadData', () => {
  it('downloads data as a file', async () => {
    const data = 'Test data';
    const fileName = 'test.txt';

    // test the navigator check
    const msSaveBlobMock = jest.fn();
    (navigator as Navigator).msSaveBlob = msSaveBlobMock;
    await helpers.downloadData(data, fileName);
    expect(msSaveBlobMock).toHaveBeenCalledWith(expect.any(Blob), 'test.txt');

    // test the "not navigator" check
    (navigator as Navigator).msSaveBlob = undefined;

    const mockElementClick = jest.fn();
    const mockCreateElement = document.createElement('a');
    mockCreateElement.click = mockElementClick;
    jest.spyOn(document, 'createElement').mockImplementation(() => mockCreateElement);

    const appendChild = jest.spyOn(document.body, 'appendChild');
    const removeChild = jest.spyOn(document.body, 'removeChild');
    const createObjectURLMock = jest.fn();
    const revokeObjectURLMock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    await helpers.downloadData(data, fileName, 'text/csv');
    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(removeChild).toHaveBeenCalledTimes(1);
    expect(mockElementClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith(expect.any(String));
  });
});
