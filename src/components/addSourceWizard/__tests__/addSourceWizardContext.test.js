import { context, useGetAddSource, useOnShowAddSourceWizard } from '../addSourceWizardContext';
import apiTypes from '../../../constants/apiConstants';
import { store } from '../../../redux';

describe('AddSourceWizardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving data from a selector', async () => {
    const mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));

    const { result: errorResponse } = await renderHook(() =>
      useGetAddSource({
        useSelector: () => ({
          error: true,
          show: false,
          data: {
            messages: {}
          }
        })
      })
    );

    expect(errorResponse).toMatchSnapshot('error response');

    const { result: errorShowResponse } = await renderHook(() =>
      useGetAddSource({
        useSelector: () => ({
          error: true,
          data: {
            messages: {}
          }
        })
      })
    );

    expect(errorShowResponse).toMatchSnapshot('error show response');

    const { result: successResponse } = await renderHook(() =>
      useGetAddSource({
        useSelector: () => ({
          fulfilled: true
        })
      })
    );

    expect(successResponse).toMatchSnapshot('success response');

    const { result: successShowResponse } = await renderHook(() =>
      useGetAddSource({
        useSelector: () => ({
          fulfilled: true,
          show: false,
          source: {
            [apiTypes.API_SUBMIT_SOURCE_NAME]: 'lorem ipsum'
          }
        })
      })
    );

    expect(successShowResponse).toMatchSnapshot('success show response');
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch confirmations on hide wizard');
    mockDispatch.mockClear();
  });

  it('should handle an onShowAddSourceWizard event', () => {
    const mockDispatch = jest.fn();
    const onShowAddSourceWizard = useOnShowAddSourceWizard({
      useDispatch: () => mockDispatch
    });

    onShowAddSourceWizard();

    expect(mockDispatch.mock.calls).toMatchSnapshot('onColumnSort event, dispatch');
    mockDispatch.mockClear();
  });
});
