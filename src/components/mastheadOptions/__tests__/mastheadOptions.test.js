import React from 'react';
import { mount } from 'enzyme';
import MastheadOptions from '../mastheadOptions';

describe('MastheadOptions Component', () => {
  it('should render a basic component', () => {
    const props = {
      username: 'Admin'
    };

    const component = mount(<MastheadOptions {...props} />);

    expect(component.render()).toMatchSnapshot();
  });
});
