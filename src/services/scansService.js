import { serviceCall } from './config';

const addScan = (data = {}) =>
  serviceCall({
    method: 'post',
    url: `${process.env.REACT_APP_SCANS_SERVICE}`,
    data
  });

const getScans = (id = '', params = {}) =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_SCANS_SERVICE}${id}`,
      params
    },
    { auth: false }
  );

const getScan = id => getScans(id);

const updateScan = (id, data = {}) =>
  serviceCall({
    method: 'put',
    url: `${process.env.REACT_APP_SCANS_SERVICE}${id}`,
    data
  });

const updatePartialScan = (id, data = {}) =>
  serviceCall({
    method: 'patch',
    url: `${process.env.REACT_APP_SCANS_SERVICE}${id}`,
    data
  });

const getScanJobs = (id, params = {}) =>
  serviceCall(
    {
      url: process.env.REACT_APP_SCAN_JOBS_SERVICE_START_GET.replace('{0}', id),
      params
    },
    { auth: false }
  );

const getScanJob = id =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_SCAN_JOBS_SERVICE}${id}/`
    },
    { auth: false }
  );

const getConnectionScanResults = (id, params = {}) =>
  serviceCall(
    {
      url: process.env.REACT_APP_SCAN_JOBS_SERVICE_CONNECTION.replace('{0}', id),
      params
    },
    { auth: false }
  );

const getInspectionScanResults = (id, params = {}) =>
  serviceCall(
    {
      url: process.env.REACT_APP_SCAN_JOBS_SERVICE_INSPECTION.replace('{0}', id),
      params
    },
    { auth: false }
  );

const deleteScan = id =>
  serviceCall({
    method: 'delete',
    url: `${process.env.REACT_APP_SCANS_SERVICE}${id}/`
  });

const startScan = id =>
  serviceCall({
    method: 'post',
    url: process.env.REACT_APP_SCAN_JOBS_SERVICE_START_GET.replace('{0}', id)
  });

const pauseScan = id =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_SCAN_JOBS_SERVICE_PAUSE.replace('{0}', id)
  });

const cancelScan = id =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_SCAN_JOBS_SERVICE_CANCEL.replace('{0}', id)
  });

const restartScan = id =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_SCAN_JOBS_SERVICE_RESTART.replace('{0}', id)
  });

const scansService = {
  addScan,
  getScans,
  getScan,
  updateScan,
  updatePartialScan,
  getScanJobs,
  getScanJob,
  getConnectionScanResults,
  getInspectionScanResults,
  deleteScan,
  startScan,
  pauseScan,
  cancelScan,
  restartScan
};

export {
  scansService as default,
  scansService,
  addScan,
  getScans,
  getScan,
  updateScan,
  updatePartialScan,
  getScanJobs,
  getScanJob,
  getConnectionScanResults,
  getInspectionScanResults,
  deleteScan,
  startScan,
  pauseScan,
  cancelScan,
  restartScan
};
