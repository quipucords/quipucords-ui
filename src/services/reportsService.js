import axios from 'axios';
import serviceConfig from './config';
import helpers from '../common/helpers';

/**
 * ToDo: Evaluate naming the download package
 * Since the data is already being handled on the server we do not need to
 * handle the blob/file, simply link to it.
 *
 * Currently when we apply the anchor download attribute in an attempt to rename
 * the gzip it throws a server cert error in staging, i.e. "Failed - Bad certificate"
 * Removing the anchor tag download attribute removes the error, but then all the
 * packages are simply named "download"
 */
const getReportsDownload = id =>
  (helpers.TEST_MODE && helpers.noopPromise) ||
  helpers.downloadPackage(`${process.env.REACT_APP_REPORTS_SERVICE}${id}/`);

const mergeReports = (data = {}) =>
  axios(
    serviceConfig({
      method: 'put',
      url: process.env.REACT_APP_REPORTS_SERVICE_MERGE,
      data
    })
  );

const reportsService = {
  getReportsDownload,
  mergeReports
};

export { reportsService as default, reportsService, getReportsDownload, mergeReports };
