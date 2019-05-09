import React from 'react';
import { shallow } from 'enzyme';
import { I18n, i18nInit } from '../i18n';

describe('I18n Component', () => {
  it('should have an initial method', () => {
    expect(i18nInit).toBeDefined();
  });

  it('should pass children', () => {
    const component = shallow(
      <I18n>
        <React.Fragment>lorem ipsum</React.Fragment>
      </I18n>
    );

    expect(component.html()).toMatchSnapshot();
  });
});
