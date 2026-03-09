export const setupLocalStorageMock = () => {
  let localStorageMockData: { [key: string]: string } = {};

  const localStorageMock = {
    getItem: jest.fn((key: string) => localStorageMockData[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      localStorageMockData[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete localStorageMockData[key];
    }),
    clear: jest.fn(() => {
      localStorageMockData = {};
    })
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  return {
    localStorageMock,
    localStorageMockData
  };
};
