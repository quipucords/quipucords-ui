import React, { act } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AddSourceModal, SourceForm, useSourceForm } from '../addSourceModal';

describe('AddSourceModal', () => {
  let mockOnClose;
  let mockOnSubmit;

  beforeEach(async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    await act(() => {
      render(
        <AddSourceModal
          isOpen={true}
          sourceType="network"
          source={undefined}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<AddSourceModal isOpen={true} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have the correct title', () => {
    const title = screen.getByText(/Add\sSource:\snetwork/i);
    expect(title).toMatchSnapshot('title');
  });

  it('should call onSubmit with the correct filtered data when "Save" is clicked', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter a name for the source'), 'Test Source');
    await user.click(screen.getByText('Save'));

    expect(mockOnSubmit.mock.calls).toMatchSnapshot('onSubmit, filtered data');
  });

  it('should call onClose', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('useSourceForm', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize formData correctly', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    await act(() => expect(result.current.formData).toMatchSnapshot('formData'));
  });

  it('should allow editing a source', async () => {
    const result = renderHook(() =>
      useSourceForm({
        source: {
          id: 123,
          name: 'lorem',
          port: 456,
          source_type: 'openshift'
        }
      })
    ).result;

    await act(() => expect(result.current.formData).toMatchSnapshot('formData, edit'));
  });

  it('should update and filter formData when handleInputChange is called', async () => {
    const result = renderHook(() => useSourceForm({ sourceType: 'network' })).result;
    const mockValue = 'Lorem ipsum';

    await act(() => result.current.handleInputChange('name', mockValue));
    expect(result.current.formData.name).toBe(mockValue);

    const filteredData = result.current.filterFormData();
    expect(filteredData.name).toBe(mockValue);
  });
});

describe('SourceForm', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(<SourceForm />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render specifics to different source types', async () => {
    const sourceTypes = ['network', 'openshift', 'rhacs', 'ansible', 'satellite', 'vcenter'];
    for (const type of sourceTypes) {
      const component = await shallowComponent(<SourceForm sourceType={type} />);
      const portFormGroup = component.querySelector('#source-port').closest('.pf-v5-c-form__group');
      const portHelperText = portFormGroup.querySelector('.pf-v5-c-helper-text');
      expect(portHelperText).toMatchSnapshot(`form, ${type}`);
    }
  });
});
