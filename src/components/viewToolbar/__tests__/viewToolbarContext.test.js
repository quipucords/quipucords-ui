import { context, useToolbarFieldClear, useToolbarFieldClearAll } from '../viewToolbarContext';
import { CONFIG as sourcesConfig } from '../../sources/sources';

describe('ToolbarContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for clearing a toolbar field through redux', () => {
    const mockDispatch = jest.fn();
    const options = {
      useView: () => ({
        viewId: 'lorem'
      }),
      useDispatch: () => mockDispatch
    };
    const { result: onClearField } = shallowHook(() => useToolbarFieldClear(options));
    onClearField('lorem');

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear single field');
    mockDispatch.mockClear();
  });

  it('should apply a hook for clearing all related toolbar select filters', () => {
    const mockDispatch = jest.fn();
    const options = {
      useView: () => ({
        viewId: 'lorem',
        config: {
          toolbar: sourcesConfig.toolbar
        }
      }),
      useDispatch: () => mockDispatch
    };
    const { result: onClearAllFields } = shallowHook(() => useToolbarFieldClearAll(options));
    onClearAllFields();

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear all filter fields');
    mockDispatch.mockClear();
  });
});
