import scansSelectors from '../scansSelectors';
import apiTypes from '../../../constants/apiConstants';

describe('ScansSelectors', () => {
  it('Should return specific selectors', () => {
    expect(scansSelectors).toMatchSnapshot('selectors');
  });

  it('Should map a hosts object to consumable props', () => {
    const state = {
      scansAction: {
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
      scansAction: {
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

  it('Should map a jobs object to consumable props', () => {
    const state = {};

    const props = {
      scan: {
        [apiTypes.API_RESPONSE_SCAN_ID]: 4,
        [apiTypes.API_RESPONSE_SCAN_NAME]: 'lorem ipsum',
        [apiTypes.API_RESPONSE_SCAN_JOBS]: [],
        [apiTypes.API_RESPONSE_SCAN_SOURCES]: [],
        [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: {
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID]: 42,
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_REPORT_ID]: 3,
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_START_TIME]: '2019-05-03T06:28:54.564Z',
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_END_TIME]: '2019-05-03T06:28:54.564Z',
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS]: 'completed',
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS_DETAILS]: {
            [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS_DETAILS_MESSAGE]: 'Job is complete.'
          },
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_FAILED]: 1,
          [apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_SCANNED]: 20
        }
      }
    };

    expect(scansSelectors.scanListItem(state, props)).toMatchSnapshot('scanListItem');
  });
});
