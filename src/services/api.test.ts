import api from './api';

describe('api', () => {
  it('should export axios instance', () => {
    expect(api).toBeDefined();
  });

  it('should have axios instance methods', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.delete).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.delete).toBe('function');
  });

  it('should have default configuration', () => {
    expect(api.defaults).toBeDefined();
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.headers).toBeDefined();
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should have interceptors configured', () => {
    // Interceptors are arrays that contain the registered interceptors
    expect(api.interceptors.request).toBeDefined();
    expect(api.interceptors.response).toBeDefined();
  });
});
