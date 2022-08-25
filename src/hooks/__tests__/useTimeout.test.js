import { useTimeout } from '../useTimeout';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should apply a hook for useTimeout', async () => {
    const mockCallback = jest.fn();
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    const { result } = await mountHook(() => useTimeout(mockCallback));

    expect(mockSetTimeout).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result).toMatchSnapshot('timeout');
  });
});
