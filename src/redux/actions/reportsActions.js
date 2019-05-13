import { reportsTypes } from '../constants';
import reportsService from '../../services/reportsService';

const getReportsDownload = id => dispatch =>
  dispatch({
    type: reportsTypes.GET_REPORTS_DOWNLOAD,
    payload: reportsService.getReportsDownload(id)
  });

const mergeReports = data => dispatch =>
  dispatch({
    type: reportsTypes.GET_MERGE_REPORT,
    payload: reportsService.mergeReports(data)
  });

export { getReportsDownload, mergeReports };
