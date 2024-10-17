/**
 * Tests for Display Helpers
 *
 * Validates accuracy and consistency of information display helpers. Includes various input scenarios and formatting
 * checks.
 */
import React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
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

describe('getCurrentDate', () => {
  it('should return a predictable current date', () => {
    const currentDate = helpers.getCurrentDate();
    expect({ currentDate }).toMatchSnapshot('current date');
  });
});

describe('getTitleImg', () => {
  it('should return a title image', () => {
    const titleImg = helpers.getTitleImg();
    expect({ titleImg }).toMatchSnapshot('title image');
  });

  it('should return a brand title image', () => {
    const titleImg = helpers.getTitleImg(true);
    expect({ titleImg }).toMatchSnapshot('brand title image');
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

describe('normalizeHosts', () => {
  it('should accept values separated by space', () => {
    const input = '127.0.0.1 127.0.0.2';
    const expected = ['127.0.0.1', '127.0.0.2'];

    expect(helpers.normalizeHosts(input)).toEqual(expected);
  });

  it('should accept values separated by newline (\\n)', () => {
    const input = '127.0.0.1\n127.0.0.2';
    const expected = ['127.0.0.1', '127.0.0.2'];

    expect(helpers.normalizeHosts(input)).toEqual(expected);
  });

  it('should accept values separated by newline (\\r)', () => {
    const input = '127.0.0.1\r127.0.0.2';
    const expected = ['127.0.0.1', '127.0.0.2'];

    expect(helpers.normalizeHosts(input)).toEqual(expected);
  });

  it('should filter out empty values', () => {
    const input = '127.0.0.1\n 127.0.0.2 ';
    const expected = ['127.0.0.1', '127.0.0.2'];

    expect(helpers.normalizeHosts(input)).toEqual(expected);
  });
});

describe('validateHosts', () => {
  // values copied from backend test
  // quipucords/tests/api/source/test_source.py::TestSource::test_create_valid_hosts
  it.each([
    ['10.10.181.9'],
    ['10.10.181.9/16'],
    ['10.10.128.[1:25]'],
    ['10.10.[1:20].25'],
    ['10.10.[1:20].[1:25]'],
    ['localhost'],
    ['my_cool_underscore.com'],
    ['bgimages.com'],
    ['my_rhel[a:d].company.com'],
    ['my_rhel[120:400].company.com'],
    ['my-rhel[a:d].company.com'],
    ['my-rhel[120:400].company.com'],
    ['my-rh_el[120:400].comp_a-ny.com']
  ])('should accept valid host [%s]', host => {
    expect(helpers.validateHosts(host, Infinity)).toBe(ValidatedOptions.default);
  });

  it('should reject empty hosts', () => {
    const input = ',,';

    expect(helpers.validateHosts(input, Infinity)).toBe(ValidatedOptions.error);
  });

  it('should reject multiple hosts when only one is allowed', () => {
    const input = '127.0.0.1 127.0.0.2';

    expect(helpers.validateHosts(input, 1)).toBe(ValidatedOptions.error);
  });

  it('should reject too long host', () => {
    const input = 'a'.repeat(400);

    expect(helpers.validateHosts(input, Infinity)).toBe(ValidatedOptions.error);
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
