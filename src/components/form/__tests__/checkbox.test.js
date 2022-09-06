import React from 'react';
import { mount, shallow } from 'enzyme';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import Checkbox from '../checkbox';
import { helpers } from '../../../common/helpers';

describe('Checkbox Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = mount(<Checkbox {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle disabled, checked', () => {
    const props = {
      isDisabled: true
    };

    const component = shallow(<Checkbox {...props} />);
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
    const component = mount(<Checkbox {...props}>lorem ipsum</Checkbox>);
    expect(component.render()).toMatchSnapshot('children label checkbox');
  });

  it('should return an emulated onChange event', done => {
    const props = {};

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = shallow(<Checkbox {...props}>lorem ipsum</Checkbox>);
    const mockEvent = { currentTarget: {}, target: {}, persist: helpers.noop };
    component.find(PfCheckbox).simulate('change', true, mockEvent);
  });
});
