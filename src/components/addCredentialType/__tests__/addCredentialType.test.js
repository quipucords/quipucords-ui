import React from 'react';
import { shallow } from 'enzyme';
import { AddCredentialType, fieldOptions, useOnSelect } from '../addCredentialType';
import { store } from '../../../redux/store';

describe('ToolbarFieldGranularity Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<AddCredentialType {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(fieldOptions).toMatchSnapshot('fieldOptions');
  });

  it('should handle opening the credential dialog through redux state with hook', () => {
    const options = {};
    const onSelect = useOnSelect(options);

    onSelect({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
