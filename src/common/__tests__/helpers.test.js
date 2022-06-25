import { helpers } from '../helpers';

describe('Helpers', () => {
  it('should have specific functions', () => {
    expect(helpers).toMatchSnapshot('helpers');
  });

  it('should handle use aggregate error, or fallback', () => {
    const aggregateError = window.AggregateError;
    window.AggregateError = undefined;
    const aggregated = helpers.aggregatedError(
      [new Error('lorem ipsum'), new Error('dolor sit')],
      'testing aggregated'
    );
    expect({
      aggregated,
      ...aggregated
    }).toMatchSnapshot('emulated aggregate error');

    window.AggregateError = aggregateError;
  });

  it('should support generated strings and flags', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });

  it('should support displaying the ui version', () => {
    expect(helpers.UI_VERSION).toMatchSnapshot('ui version');
  });

  it('should support icon references', () => {
    expect(helpers.sourceTypeIcon('vcenter')).toMatchSnapshot('sourceTypeIcon');
    expect(helpers.scanTypeIcon('connect')).toMatchSnapshot('scanTypeIcon');
    expect(helpers.scanStatusIcon('success')).toMatchSnapshot('scanStatusIcon');
  });

  it('should handle basic object updates', () => {
    const definedObj = {};
    expect(helpers.setPropIfDefined(definedObj, ['lorem'], undefined)).toMatchSnapshot('setPropIfDefined undefined');
    expect(helpers.setPropIfDefined(definedObj, ['lorem'], 'ipsum')).toMatchSnapshot('setPropIfDefined');

    const truthyObj = {};
    expect(helpers.setPropIfTruthy(truthyObj, ['lorem'], 0)).toMatchSnapshot('setPropIfTruthy number');
    expect(helpers.setPropIfTruthy(truthyObj, ['lorem'], true)).toMatchSnapshot('setPropIfTruthy bool');
    expect(helpers.setPropIfTruthy(truthyObj, ['lorem'], '')).toMatchSnapshot('setPropIfTruthy string');
  });

  it('should handle view related selectors and props updates', () => {
    expect(helpers.viewPropsChanged({ activeFilters: true }, { activeFilters: false })).toBe(true);

    const viewOptions = {
      currentPage: 1,
      pageSize: 10
    };

    const queryObj = {
      page: 2
    };

    expect(helpers.createViewQueryObject(viewOptions, queryObj)).toMatchSnapshot('createViewQueryObject');
  });

  it('should handle http status less than 400 message from response', () => {
    const payload = {
      data: {},
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
      request: {},
      message: 'Request success XXX',
      detail: 'XXX Request success'
    };

    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('200 message');

    payload.status = 399;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('399 message');

    payload.status = 400;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('400 message');
  });

  it('should handle an undefined http status', () => {
    const payload = {
      message: 'MESSAGE',
      response: {
        status: 0,
        statusText: 'ERROR TEST',
        data: {
          detail: 'ERROR'
        }
      }
    };

    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('0 message');

    delete payload.response.status;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('undefined message');
  });

  it('should handle http status 400 level error messages from response', () => {
    const payload = {
      response: {
        data: {
          lorem: ['Lorem ipsum dolor sit'],
          ipsum: {
            sed: 'nulla sed consequat urna',
            dolor: {
              sit: ['sit dolor', 'consequat urna'],
              placerat: [{ ante: 'sed placerat ante' }]
            }
          }
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {},
        request: {}
      },
      message: 'Request failed with status code XXX',
      detail: 'XXX Request failed'
    };

    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('400 error message');

    expect(helpers.getMessageFromResults(payload, 'lorem').message).toMatchSnapshot('400 filtered message');

    expect(helpers.getMessageFromResults(payload, 'dolor').message).toMatchSnapshot('400 filtered object message');

    delete payload.response.data.lorem;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('400 fallback error message');

    delete payload.response.data;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('400 fallback again error message');

    delete payload.message;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('400 fallback yet again error message');
  });

  it('should handle http status 500 level error messages from response', () => {
    const payload = {
      response: {
        data: {
          lorem: ['Lorem ipsum dolor sit']
        },
        status: 500,
        statusText: 'Bad Request',
        headers: {},
        config: {},
        request: {}
      },
      message: 'Request failed with status code XXX',
      detail: 'XXX Request failed'
    };

    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('500 level error message');

    delete payload.response.data.lorem;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('500 level fallback error message');

    delete payload.response.data;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot('500 level fallback again error message');

    delete payload.message;
    expect(helpers.getMessageFromResults(payload).message).toMatchSnapshot(
      '500 level fallback yet again error message'
    );
  });

  it('should return http status from a response', () => {
    const payload = {
      response: {
        status: 400
      }
    };

    expect(helpers.getStatusFromResults({})).toBe(0);

    expect(helpers.getStatusFromResults(payload)).toBe(400);
  });

  it('should determine an ip address and value', () => {
    expect(helpers.isIpAddress('0.0.0.1')).toBe(true);
    expect(helpers.isIpAddress('0.0.0.1.5')).toBe(false);
    expect(helpers.isIpAddress('lorem')).toBe(false);

    expect(helpers.ipAddressValue('0.0.0.1')).toBe(1);
    expect(helpers.ipAddressValue('0.0.0.1.5')).toBe(1);
    expect(Number.isNaN(helpers.ipAddressValue('lorem'))).toBe(true);
  });

  it('should return a predictable current date', () => {
    const currentDate = helpers.getCurrentDate();
    expect({ currentDate }).toMatchSnapshot('current date');
  });
});
