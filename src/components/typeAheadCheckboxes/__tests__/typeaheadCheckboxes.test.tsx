import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { TypeaheadCheckboxes } from '../typeaheadCheckboxes';

describe('TypeaheadCheckboxes', () => {
  it('should render a basic component', async () => {
    const props = {
      options: [{ value: 'ipsum', label: 'Lorem' }]
    };
    const component = await shallowComponent(<TypeaheadCheckboxes {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
