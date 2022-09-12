import React from 'react';
import { mount, shallow } from 'enzyme';
import { Radio as PfRadio } from '@patternfly/react-core/dist/js/components/Radio';
import { Radio } from '../radio';
import { helpers } from '../../../common';

describe('Radio Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = mount(<Radio {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle disabled, checked', () => {
    const props = {
      isDisabled: true
    };

    const component = shallow(<Radio {...props} />);
    expect(component.render()).toMatchSnapshot('disabled');

    component.setProps({
      isDisabled: false
    });
    expect(component.render()).toMatchSnapshot('active');

    component.setProps({
      isDisabled: false,
      isChecked: true
    });

    expect(component.render()).toMatchSnapshot('checked');
  });

  it('should handle children as a label', () => {
    const props = {};
    const component = mount(<Radio {...props}>lorem ipsum</Radio>);
    expect(component.render()).toMatchSnapshot('children label radio');
  });

  it('should return an emulated onChange event', done => {
    const props = {};

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = shallow(<Radio {...props}>lorem ipsum</Radio>);
    const mockEvent = { currentTarget: {}, target: {}, persist: helpers.noop };
    component.find(PfRadio).simulate('change', true, mockEvent);
  });
});
