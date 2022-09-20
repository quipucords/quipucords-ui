import { context, useQuery, useConfig, useOnRefresh, useView } from '../viewContext';

describe('ViewContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving api queries', async () => {
    const { result } = await shallowHook(() =>
      useQuery({
        useSelector: () => ({
          hello: 'world'
        }),
        useViewContext: () => ({
          initialQuery: {
            lorem: 'ipsum',
            dolor: 'sit'
          }
        })
      })
    );

    expect(result).toMatchSnapshot('query');
  });

  it('should apply a hook for retrieving view config', async () => {
    const { result } = await shallowHook(() =>
      useConfig({
        useViewContext: () => ({
          toolbar: 'lorem ipsum'
        })
      })
    );

    expect(result).toMatchSnapshot('config');
  });

  it('should apply a hook that combines retrieving view queries and config', async () => {
    const { result } = await shallowHook(() =>
      useView({
        useViewContext: () => ({
          initialQuery: {
            lorem: 'ipsum',
            dolor: 'sit'
          },
          viewId: 'test id'
        }),
        useQuery: () => ({ hello: 'world' }),
        useConfig: () => ({ toolbar: 'lorem ipsum' })
      })
    );

    expect(result).toMatchSnapshot('combined');
  });

  it('should apply a hook for dispatching view updates', () => {
    const mockDispatch = jest.fn();
    const onRefresh = useOnRefresh({
      useViewContext: () => ({
        viewId: 'test id'
      }),
      useDispatch: () => mockDispatch
    });

    onRefresh();

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
  });
});
