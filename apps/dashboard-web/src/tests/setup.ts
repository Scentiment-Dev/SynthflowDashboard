import '@testing-library/jest-dom';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('API unavailable in frontend skeleton tests'))),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});
