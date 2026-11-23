import React from 'react';
import i18next from 'i18next';
import { shallowComponent } from '../../../../config/jest.setupTests';
import enJson from '../../../locales/en.json';
import { I18n } from '../i18n';

jest.mock('i18next', () => jest.requireActual('i18next'));
jest.mock('i18next-resources-to-backend', () => () => ({
  type: 'backend',
  init: () => {},
  read: (_lang: string, _ns: string, cb: (err: null, data: unknown) => void) => cb(null, enJson)
}));

describe('I18n interpolation', () => {
  beforeAll(async () => {
    await shallowComponent(<I18n>test</I18n>);
    await i18next.loadNamespaces('default');
  });

  it('should not HTML-encode apostrophes in interpolated values', () => {
    const result = i18next.t('form-dialog.confirmation_heading_delete-credential', { name: "today's scan" });
    expect(result).toBe("Are you sure you want to delete the credential today's scan?");
    expect(result).not.toContain('&#39;');
  });
});
