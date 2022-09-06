import React from 'react';
import { mount } from 'enzyme';
import { FormGroup } from '../formGroup';
import { formHelpers } from '../formHelpers';

describe('FormGroup Component', () => {
  it('should render a basic component', () => {
    const props = { id: 'test' };

    const component = mount(
      <FormGroup label="test" {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component.render()).toMatchSnapshot('basic formgroup');
    expect(component.find('label').at(0).render()).toMatchSnapshot('basic label');
  });

  it('should handle multiple error message types', () => {
    const props = {
      id: 'test',
      error: true,
      errorMessage: 'lorem ipsum'
    };

    let component = mount(
      <FormGroup {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component.render()).toMatchSnapshot('string error message');

    props.errorMessage = true;

    component = mount(
      <FormGroup {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component.render()).toMatchSnapshot('boolean error message');

    props.errorMessage = <span>lorem ipsum</span>;

    component = mount(
      <FormGroup {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component.render()).toMatchSnapshot('node error message');
  });

  it('should have isEmpty validation', () => {
    expect(formHelpers.isEmpty(undefined)).toBe(true);
    expect(formHelpers.isEmpty(null)).toBe(true);
    expect(formHelpers.isEmpty('')).toBe(true);
    expect(formHelpers.isEmpty('lorem')).toBe(false);
    expect(formHelpers.isEmpty([])).toBe(true);
    expect(formHelpers.isEmpty(['lorem'])).toBe(false);
    expect(formHelpers.isEmpty({})).toBe(true);
    expect(formHelpers.isEmpty({ lorem: 'ipsum' })).toBe(false);
  });

  it('should have doesNotHaveMinimumCharacters validation', () => {
    expect(formHelpers.doesNotHaveMinimumCharacters('', 5)).toBe(true);
    expect(formHelpers.doesNotHaveMinimumCharacters('test test', 5)).toBe(false);
  });

  it('should have isPortValid validation', () => {
    expect(formHelpers.isPortValid('lorem')).toBe(false);
    expect(formHelpers.isPortValid(-1)).toBe(false);
    expect(formHelpers.isPortValid(65536)).toBe(false);
    expect(formHelpers.isPortValid('65536')).toBe(false);
    expect(formHelpers.isPortValid(65535)).toBe(true);
  });
});
