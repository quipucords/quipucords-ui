import { createSelector } from 'reselect';
import _find from 'lodash/find';
import _get from 'lodash/get';
import { helpers } from '../../common';
import { apiTypes } from '../../constants/apiConstants';

/**
 * Map a hosts object to consumable prop names
 *
 * @type {{}}
 */
const scanHostsListSelectorCache = {};

const scanHostsItem = (state, props) => props;
const scanHostsConnection = (state, props) => state.scans.connection[props.id];
const scanHostsInspection = (state, props) => state.scans.inspection[props.id];

const scanHostsListSelector = createSelector(
  [scanHostsItem, scanHostsConnection, scanHostsInspection],
  (props, connection, inspection) => {
    const { metaId, metaQuery } = connection || inspection || {};
    const connectionData = (connection && connection.data) || {};
    const inspectionData = (inspection && inspection.data) || {};

    const isMoreConnectionResults = _get(connectionData, apiTypes.API_RESPONSE_JOBS_NEXT, null) !== null;
    const isMoreInspectionResults = _get(inspectionData, apiTypes.API_RESPONSE_JOBS_NEXT, null) !== null;
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
      const mapJob = (jobResult, jobType) => {
        const updatedVal = {
          jobType
        };

        helpers.setPropIfDefined(updatedVal, ['name'], jobResult[apiTypes.API_RESPONSE_JOB_NAME]);

        helpers.setPropIfDefined(
          updatedVal,
          ['credentialName'],
          _get(jobResult, [apiTypes.API_RESPONSE_JOB_CREDENTIAL, apiTypes.API_RESPONSE_JOB_CREDENTIAL_NAME])
        );

        helpers.setPropIfDefined(
          updatedVal,
          ['sourceId'],
          _get(jobResult, [apiTypes.API_RESPONSE_JOB_SOURCE, apiTypes.API_RESPONSE_JOB_SOURCE_ID])
        );

        helpers.setPropIfDefined(
          updatedVal,
          ['sourceName'],
          _get(jobResult, [apiTypes.API_RESPONSE_JOB_SOURCE, apiTypes.API_RESPONSE_JOB_SOURCE_NAME])
        );

        helpers.setPropIfDefined(updatedVal, ['status'], jobResult[apiTypes.API_RESPONSE_JOB_STATUS]);

        return updatedVal;
      };

      newScanHostsList = [
        ..._get(connectionData, apiTypes.API_RESPONSE_JOBS_RESULTS, []).map(val => mapJob(val, 'connection')),
        ..._get(inspectionData, apiTypes.API_RESPONSE_JOBS_RESULTS, []).map(val => mapJob(val, 'inspection'))
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
 *
 * @param {object} state
 * @param {object} props
 * @returns {*}
 */
const scanJobDetail = (state, props) => state.scans.job[props.id];

const scanJobDetailBySourceSelector = createSelector([scanJobDetail], scanJob => {
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
});

const makeScanJobDetailBySourceSelector = () => scanJobDetailBySourceSelector;

/**
 * Map a jobs object to consumable prop names
 *
 * @type {{}}
 */
const previousScansSelectorsCache = {};

const previousScanJobs = (state, props) => state.scans.jobs[props.id];

const scanJobsListSelector = createSelector([previousScanJobs], scanJobs => {
  const { data, metaId, metaQuery, ...props } = scanJobs || {};

  const isMoreResults = _get(data, apiTypes.API_RESPONSE_JOBS_NEXT, null) !== null;

  // map results to consumable props
  let newScanJobsList = ((data && data[apiTypes.API_RESPONSE_JOBS_RESULTS]) || []).map(job => {
    const updatedJob = { _original: job };

    helpers.setPropIfDefined(updatedJob, ['endTime'], job[apiTypes.API_RESPONSE_JOB_END_TIME]);
    helpers.setPropIfDefined(updatedJob, ['id'], job[apiTypes.API_RESPONSE_JOB_ID]);
    helpers.setPropIfDefined(updatedJob, ['reportId'], job[apiTypes.API_RESPONSE_JOB_REPORT_ID]);
    helpers.setPropIfDefined(updatedJob, ['startTime'], job[apiTypes.API_RESPONSE_JOB_START_TIME]);
    helpers.setPropIfDefined(updatedJob, ['status'], job[apiTypes.API_RESPONSE_JOB_STATUS]);

    helpers.setPropIfDefined(
      updatedJob,
      ['scanName'],
      _get(job, [apiTypes.API_RESPONSE_JOB_SCAN, apiTypes.API_RESPONSE_JOB_SCAN_NAME])
    );

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
});

const makeScanJobsListSelector = () => scanJobsListSelector;

const scansSelectors = {
  scanHostsList: scanHostsListSelector,
  makeScanHostsList: makeScanHostsListSelector,
  scanJobDetailBySource: scanJobDetailBySourceSelector,
  makeScanJobDetailBySource: makeScanJobDetailBySourceSelector,
  scanJobsList: scanJobsListSelector,
  makeScanJobsList: makeScanJobsListSelector
};

export {
  scansSelectors as default,
  scansSelectors,
  scanHostsListSelector,
  makeScanHostsListSelector,
  scanJobDetailBySourceSelector,
  makeScanJobDetailBySourceSelector,
  scanJobsListSelector,
  makeScanJobsListSelector
};
