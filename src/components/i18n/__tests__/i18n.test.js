import React from 'react';
import { I18n } from '../i18n';

describe('I18n Component', () => {
  it('should render a basic component', async () => {
    const props = {
      locale: 'es'
    };

    const component = await mountHookComponent(<I18n {...props}>lorem ipsum</I18n>);

    expect(component).toMatchSnapshot('basic');
  });

  it('should pass children', async () => {
    const component = await mountHookComponent(<I18n>lorem ipsum</I18n>);

    expect(component.html()).toMatchSnapshot('children');
  });
});
