import scansSelectors from '../scansSelectors';
import apiTypes from '../../../constants/apiConstants';

describe('ScansSelectors', () => {
  it('Should return specific selectors', () => {
    expect(scansSelectors).toMatchSnapshot('selectors');
  });

  it('Should map a hosts object to consumable props', () => {
    const state = {
      scans: {
        connection: {
          1: {
            data: {
              [apiTypes.API_RESPONSE_JOBS_COUNT]: 2,
              [apiTypes.API_RESPONSE_JOBS_NEXT]: 'http://127.0.0.1/api/v1/scans/?page=2',
              [apiTypes.API_RESPONSE_JOBS_RESULTS]: [
                {
                  [apiTypes.API_RESPONSE_JOB_NAME]: '192.168.0.1',
                  [apiTypes.API_RESPONSE_JOB_STATUS]: 'success'
                }
              ]
            },
            fulfilled: true,
            metaData: undefined,
            metaId: 1,
            metaQuery: {
              [apiTypes.API_QUERY_ORDERING]: 'name',
              [apiTypes.API_QUERY_PAGE]: 1,
              [apiTypes.API_QUERY_PAGE_SIZE]: 1
            }
          }
        },
        inspection: {
          1: {
            data: {
              [apiTypes.API_RESPONSE_JOBS_COUNT]: 2,
              [apiTypes.API_RESPONSE_JOBS_NEXT]: 'http://127.0.0.1/api/v1/scans/?page=2',
              [apiTypes.API_RESPONSE_JOBS_RESULTS]: [
                {
                  [apiTypes.API_RESPONSE_JOB_NAME]: '192.168.0.1',
                  [apiTypes.API_RESPONSE_JOB_STATUS]: 'success'
                }
              ]
            },
            fulfilled: true,
            metaData: undefined,
            metaId: 1,
            metaQuery: {
              [apiTypes.API_QUERY_ORDERING]: 'name',
              [apiTypes.API_QUERY_PAGE]: 1,
              [apiTypes.API_QUERY_PAGE_SIZE]: 1
            }
          }
        }
      }
    };

    const props = {
      id: 1
    };

    expect(scansSelectors.scanHostsList(state, props)).toMatchSnapshot('scanHostsList');
  });

  it('Should map a job object to consumable props and sorted by source', () => {
    const state = {
      scans: {
        job: {
          1: {
            data: {
              [apiTypes.API_RESPONSE_JOB_SOURCES]: [
                {
                  [apiTypes.API_RESPONSE_JOB_SOURCES_ID]: 15,
                  [apiTypes.API_RESPONSE_JOB_SOURCES_NAME]: 'TestSource',
                  [apiTypes.API_RESPONSE_JOB_SOURCES_SOURCE_TYPE]: 'network'
                }
              ],
              [apiTypes.API_RESPONSE_JOB_TASKS]: [
                {
                  [apiTypes.API_RESPONSE_JOB_TASKS_SOURCE]: 1,
                  [apiTypes.API_RESPONSE_JOB_TASKS_SCAN_TYPE]: 'inspect',
                  [apiTypes.API_RESPONSE_JOB_TASKS_STATUS]: 'created',
                  [apiTypes.API_RESPONSE_JOB_TASKS_STATUS_MESSAGE]: 'lorem ipsum'
                }
              ]
            }
          }
        }
      }
    };

    const props = {
      id: 1
    };

    expect(scansSelectors.scanJobDetailBySource(state, props)).toMatchSnapshot('scanJobDetailBySource');
  });
});
