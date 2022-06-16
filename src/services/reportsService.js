import { serviceCall } from './config';
import helpers from '../common/helpers';

const getReportsDownload = id =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_REPORTS_SERVICE}${id}/`,
      responseType: 'blob'
    },
    { auth: false }
  ).then(
    success =>
      (helpers.TEST_MODE && success.data) ||
      helpers.downloadData(
        success.data,
        `report_id_${id}_${helpers.getTimeStampFromResults(success)}.tar.gz`,
        'application/gzip'
      )
  );

const mergeReports = (data = {}) =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_REPORTS_SERVICE_MERGE,
    data
  });

const reportsService = {
  getReportsDownload,
  mergeReports
};

export { reportsService as default, reportsService, getReportsDownload, mergeReports };
