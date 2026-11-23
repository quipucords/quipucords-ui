import React from 'react';
import i18next from 'i18next';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { I18n } from '../i18n';

describe('I18n', () => {
  it('should render a basic component', async () => {
    const props = {
      children: 'Lorem ipsum'
    };
    const component = await shallowComponent(<I18n {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should attempt to update locale', async () => {
    const spyI18next = jest.spyOn(i18next, 'changeLanguage').mockResolvedValue(jest.fn() as any);
    const props = {
      children: 'Lorem ipsum',
      locale: 'dolor-Sit'
    };

    await shallowComponent(<I18n {...props} />);
    expect(spyI18next.mock.calls).toMatchSnapshot('locale');
    spyI18next.mockRestore();
  });
});
