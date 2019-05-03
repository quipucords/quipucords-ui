import { createSelector } from 'reselect';
import _find from 'lodash/find';
import _get from 'lodash/get';
import { helpers } from '../../common/helpers';
import { apiTypes } from '../../constants/apiConstants';

/**
 * Map a hosts object to consumable prop names
 */
const scanHostsListSelectorCache = {};

const scanHostsItem = (state, props) => props;
const scanHostsConnection = (state, props) => state.scansAction.connection[props.id];
const scanHostsInspection = (state, props) => state.scansAction.inspection[props.id];

const scanHostsListSelector = createSelector(
  [scanHostsItem, scanHostsConnection, scanHostsInspection],
  (props, connection, inspection) => {
    const { metaId, metaQuery } = connection || inspection || {};
    const connectionData = (connection && connection.data) || {};
    const inspectionData = (inspection && inspection.data) || {};

    const isMoreConnectionResults = _get(connectionData, apiTypes.API_RESPONSE_JOBS_NEXT) !== null;
    const isMoreInspectionResults = _get(inspectionData, apiTypes.API_RESPONSE_JOBS_NEXT) !== null;
    const isMoreResults = isMoreConnectionResults || isMoreInspectionResults;

    const sortHosts = (item1, item2) => {
      const item1Name = item1[apiTypes.API_RESPONSE_JOB_NAME];
      const item2Name = item2[apiTypes.API_RESPONSE_JOB_NAME];

      if (helpers.isIpAddress(item1Name) && helpers.isIpAddress(item2Name)) {
        return helpers.ipAddressValue(item1Name) - helpers.ipAddressValue(item2Name);
      }

      return item1Name.localeCompare(item2Name);
    };

    const combineMultipleScanHostsStates = () => {
      const error = (connection && connection.error) || (inspection && inspection.error) || undefined;

      if (error) {
        const errorMessage =
          `${connection && connection.errorMessage} ${inspection && inspection.errorMessage}`.trim() || null;

        return {
          error,
          errorMessage
        };
      }

      const pending = (connection && connection.pending) || (inspection && inspection.pending) || undefined;

      if (pending) {
        return {
          pending
        };
      }

      const fulfilled = (connection && connection.fulfilled) || (inspection && inspection.fulfilled) || undefined;

      if (fulfilled) {
        return {
          fulfilled
        };
      }

      return {};
    };

    const newProps = combineMultipleScanHostsStates();
    let newScanHostsList = [];

    if (newProps.fulfilled) {
      newScanHostsList = [
        ..._get(connectionData, apiTypes.API_RESPONSE_JOBS_RESULTS, []).map(val => ({
          ...val,
          ...{ jobType: 'connection' }
        })),
        ..._get(inspectionData, apiTypes.API_RESPONSE_JOBS_RESULTS, []).map(val => ({
          ...val,
          ...{ jobType: 'inspection' }
        }))
      ];

      // cache, concat results, reset if necessary
      if (metaId) {
        scanHostsListSelectorCache[metaId] = scanHostsListSelectorCache[metaId] || { previous: [] };

        if (metaQuery && metaQuery[apiTypes.API_QUERY_PAGE] === 1) {
          scanHostsListSelectorCache[metaId] = { previous: [] };
        }

        newScanHostsList = [...scanHostsListSelectorCache[metaId].previous, ...newScanHostsList].sort(sortHosts);
        scanHostsListSelectorCache[metaId].previous = newScanHostsList;
      }
    }

    return {
      ...newProps,
      hostsList: newScanHostsList,
      isMoreResults
    };
  }
);

const makeScanHostsListSelector = () => scanHostsListSelector;

/**
 * Map a job object to consumable prop names and sorted by source
 */
const scanJobDetail = (state, props) => state.scansAction.job[props.id];

const scanJobDetailBySourceSelector = createSelector(
  [scanJobDetail],
  scanJob => {
    const { data, ...props } = scanJob || {};
    let newScanJobList = [];

    const sortSources = scan => {
      const sources = [..._get(scan, apiTypes.API_RESPONSE_JOB_SOURCES, [])];

      sources.sort((item1, item2) => {
        let cmp = item1[apiTypes.API_RESPONSE_JOB_SOURCES_SOURCE_TYPE].localeCompare(
          item2[apiTypes.API_RESPONSE_JOB_SOURCES_SOURCE_TYPE]
        );

        if (cmp === 0) {
          cmp = item1[apiTypes.API_RESPONSE_JOB_SOURCES_NAME].localeCompare(
            item2[apiTypes.API_RESPONSE_JOB_SOURCES_NAME]
          );
        }

        return cmp;
      });

      return sources;
    };

    if (data) {
      const sources = sortSources(data);

      newScanJobList = sources.map(source => {
        const updatedSource = {};

        helpers.setPropIfDefined(updatedSource, ['id'], source[apiTypes.API_RESPONSE_JOB_SOURCES_ID]);
        helpers.setPropIfDefined(updatedSource, ['name'], source[apiTypes.API_RESPONSE_JOB_SOURCES_NAME]);
        helpers.setPropIfDefined(updatedSource, ['sourceType'], source[apiTypes.API_RESPONSE_JOB_SOURCES_SOURCE_TYPE]);

        const connectTask = _find(scanJob[apiTypes.API_RESPONSE_JOB_TASKS], {
          [apiTypes.API_RESPONSE_JOB_TASKS_SOURCE]: source[apiTypes.API_RESPONSE_JOB_SOURCES_ID],
          [apiTypes.API_RESPONSE_JOB_TASKS_SCAN_TYPE]: 'connect'
        });

        if (connectTask) {
          helpers.setPropIfDefined(
            updatedSource,
            ['connectTaskStatus'],
            connectTask[apiTypes.API_RESPONSE_JOB_TASKS_STATUS]
          );

          helpers.setPropIfDefined(
            updatedSource,
            ['connectTaskStatusMessage'],
            connectTask[apiTypes.API_RESPONSE_JOB_TASKS_STATUS_MESSAGE]
          );
        }

        const inspectTask = _find(scanJob[apiTypes.API_RESPONSE_JOB_TASKS], {
          [apiTypes.API_RESPONSE_JOB_TASKS_SOURCE]: source[apiTypes.API_RESPONSE_JOB_SOURCES_ID],
          [apiTypes.API_RESPONSE_JOB_TASKS_SCAN_TYPE]: 'inspect'
        });

        if (inspectTask) {
          helpers.setPropIfDefined(
            updatedSource,
            ['inspectTaskStatus'],
            inspectTask[apiTypes.API_RESPONSE_JOB_TASKS_STATUS]
          );

          helpers.setPropIfDefined(
            updatedSource,
            ['inspectTaskStatusMessage'],
            inspectTask[apiTypes.API_RESPONSE_JOB_TASKS_STATUS_MESSAGE]
          );
        }

        return updatedSource;
      });
    }

    return {
      ...props,
      scanJobList: newScanJobList
    };
  }
);

const makeScanJobDetailBySourceSelector = () => scanJobDetailBySourceSelector;

/**
 * Map a jobs object to consumable prop names
 */
const previousScansSelectorsCache = {};

const previousScanJobs = (state, props) => state.scansAction.jobs[props.id];

const scanJobsListSelector = createSelector(
  [previousScanJobs],
  scanJobs => {
    const { data, metaId, metaQuery, ...props } = scanJobs || {};

    const isMoreResults = _get(scanJobs, apiTypes.API_RESPONSE_JOBS_NEXT) !== null;

    // map results to consumable props
    let newScanJobsList = ((data && data[apiTypes.API_RESPONSE_JOBS_RESULTS]) || []).map(job => {
      const updatedJob = {};

      helpers.setPropIfDefined(updatedJob, ['endTime'], job[apiTypes.API_RESPONSE_JOB_END_TIME]);
      helpers.setPropIfDefined(updatedJob, ['id'], job[apiTypes.API_RESPONSE_JOB_ID]);
      helpers.setPropIfDefined(updatedJob, ['reportId'], job[apiTypes.API_RESPONSE_JOB_REPORT_ID]);
      helpers.setPropIfDefined(updatedJob, ['startTime'], job[apiTypes.API_RESPONSE_JOB_START_TIME]);
      helpers.setPropIfDefined(updatedJob, ['status'], job[apiTypes.API_RESPONSE_JOB_STATUS]);

      helpers.setPropIfDefined(
        updatedJob,
        ['systemsScanned'],
        job[apiTypes.API_RESPONSE_JOB_SYS_SCANNED] >= 0 ? job[apiTypes.API_RESPONSE_JOB_SYS_SCANNED] : 0
      );
      helpers.setPropIfDefined(
        updatedJob,
        ['systemsFailed'],
        job[apiTypes.API_RESPONSE_JOB_SYS_FAILED] >= 0 ? job[apiTypes.API_RESPONSE_JOB_SYS_FAILED] : 0
      );

      return updatedJob;
    });

    // cache, concat results, reset if necessary
    if (metaId) {
      previousScansSelectorsCache[metaId] = previousScansSelectorsCache[metaId] || { previous: [] };

      if (metaQuery && metaQuery[apiTypes.API_QUERY_PAGE] === 1) {
        previousScansSelectorsCache[metaId] = { previous: [] };
      }

      newScanJobsList = [...previousScansSelectorsCache[metaId].previous, ...newScanJobsList];
      previousScansSelectorsCache[metaId].previous = newScanJobsList;
    }

    return {
      ...props,
      isMoreResults,
      scanJobsList: newScanJobsList
    };
  }
);

const makeScanJobsListSelector = () => scanJobsListSelector;

/**
 * Map a scan object to consumable prop names
 */
const scanListItem = (state, props) => props;

const scanListItemSelector = createSelector(
  [scanListItem],
  props => {
    const { scan } = props;
    const updatedScan = {};

    helpers.setPropIfDefined(updatedScan, ['id'], scan[apiTypes.API_RESPONSE_SCAN_ID]);
    helpers.setPropIfDefined(updatedScan, ['name'], scan[apiTypes.API_RESPONSE_SCAN_NAME]);
    helpers.setPropIfDefined(updatedScan, ['jobsTotal'], _get(scan, apiTypes.API_RESPONSE_SCAN_JOBS, []).length);
    helpers.setPropIfDefined(updatedScan, ['sourcesTotal'], _get(scan, apiTypes.API_RESPONSE_SCAN_SOURCES, []).length);

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentEndTime'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_END_TIME])
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentId'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID])
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentReportId'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_REPORT_ID])
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentStatus'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS])
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentStartTime'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_START_TIME])
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentStatusMessage'],
      _get(
        scan,
        [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS_DETAILS][
          apiTypes.API_RESPONSE_SCAN_MOST_RECENT_STATUS_DETAILS_MESSAGE
        ]
      )
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentSysFailed'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_FAILED], 0)
    );

    helpers.setPropIfDefined(
      updatedScan,
      ['mostRecentSysScanned'],
      _get(scan, [apiTypes.API_RESPONSE_SCAN_MOST_RECENT, apiTypes.API_RESPONSE_SCAN_MOST_RECENT_SYS_SCANNED], 0)
    );

    return {
      ...props,
      scan: updatedScan
    };
  }
);

const makeScanListItemSelector = () => scanListItemSelector;

const scansSelectors = {
  scanHostsList: scanHostsListSelector,
  makeScanHostsList: makeScanHostsListSelector,
  scanJobDetailBySource: scanJobDetailBySourceSelector,
  makeScanJobDetailBySource: makeScanJobDetailBySourceSelector,
  scanJobsList: scanJobsListSelector,
  makeScanJobsList: makeScanJobsListSelector,
  scanListItem: scanListItemSelector,
  makeScanListItem: makeScanListItemSelector
};

export {
  scansSelectors as default,
  scansSelectors,
  scanHostsListSelector,
  makeScanHostsListSelector,
  scanJobDetailBySourceSelector,
  makeScanJobDetailBySourceSelector,
  scanJobsListSelector,
  makeScanJobsListSelector,
  scanListItemSelector,
  makeScanListItemSelector
};
