import React from 'react';
import { FormGroup } from '../formGroup';
import { formHelpers } from '../formHelpers';

describe('FormGroup Component', () => {
  it('should render a basic component', () => {
    const props = { id: 'test' };

    const component = renderComponent(
      <FormGroup label="test" {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component).toMatchSnapshot('basic formgroup');
    expect(component.find('label')).toMatchSnapshot('basic label');
  });

  it('should handle multiple error message types', () => {
    const props = {
      id: 'test',
      error: true,
      errorMessage: 'lorem ipsum'
    };

    const component = renderComponent(
      <FormGroup {...props}>
        <input id="test" type="text" value="" readOnly />
      </FormGroup>
    );

    expect(component).toMatchSnapshot('string error message');

    const componentErrorMessage = component.setProps({ errorMessage: true });
    expect(componentErrorMessage).toMatchSnapshot('boolean error message');

    const componentNodeErrorMessage = component.setProps({ errorMessage: <span>lorem ipsum</span> });
    expect(componentNodeErrorMessage).toMatchSnapshot('node error message');
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
