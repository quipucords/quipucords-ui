import { context, useGetAddSource } from '../addSourceWizardContext';
import apiTypes from '../../../constants/apiConstants';
import { store } from '../../../redux';

describe('AddSourceWizardContext', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving data from a selector', async () => {
    const { result: errorResponse } = await mountHook(() =>
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

    const { result: errorShowResponse } = await mountHook(() =>
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

    const { result: successResponse } = await mountHook(() =>
      useGetAddSource({
        useSelector: () => ({
          fulfilled: true
        })
      })
    );

    expect(successResponse).toMatchSnapshot('success response');

    const { result: successShowResponse } = await mountHook(() =>
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
  });
});
