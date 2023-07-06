import React from 'react';
import { TouchSpin } from '../touchspin';

describe('TouchSpin Component', () => {
  it('should render a basic component', () => {
    const props = {
      name: 'lorem'
    };

    const component = renderComponent(<TouchSpin {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle onchange events', () => {
    const props = {
      name: 'lorem',
      value: 1,
      labelMaxDescription: 'testing max',
      labelMinDescription: 'testing min'
    };

    const component = renderComponent(<TouchSpin {...props} />);

    const inputMax = component.find(`button[aria-label="${props.labelMaxDescription}"]`);
    component.fireEvent.click(inputMax);
    expect(component.find('input').value).toBe('2');

    const inputMin = component.find(`button[aria-label="${props.labelMinDescription}"]`);
    component.fireEvent.click(inputMin);
    expect(component.find('input').value).toBe('1');
  });
});
