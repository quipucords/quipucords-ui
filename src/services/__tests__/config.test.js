import cookies from 'js-cookie';
import { config } from '../config';

describe('ServiceConfig', () => {
  it('should have specific properties and methods', () => {
    expect(Object.keys(config)).toMatchSnapshot('specific props and methods');
  });

  it('should export a default services config', () => {
    expect(config.serviceConfig).toBeDefined();

    cookies.set(process.env.REACT_APP_AUTH_TOKEN, 'spoof');

    const configObject = config.serviceConfig(
      {
        method: 'post',
        timeout: 3
      },
      true
    );

    expect(configObject.method).toEqual('post');
    expect(configObject.timeout).toEqual(3);
  });

  it('should export a default services config without authorization', () => {
    const configObject = config.serviceConfig({}, { auth: false });

    expect(configObject.headers[process.env.REACT_APP_AUTH_HEADER]).toBeUndefined();
  });
});
