import { useConfirmation } from '../useConfirmation';

describe('useConfirmation', () => {
  it('should apply a hook for useConfirmation', async () => {
    const mockDispatch = jest.fn();
    const { result } = await renderHook(() => useConfirmation({ useDispatch: () => mockDispatch }));

    result({ heading: 'Lorem ipsum', title: 'Dolor sit' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch confirmation');
    mockDispatch.mockClear();
  });
});
