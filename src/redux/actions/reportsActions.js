import { reportsTypes } from '../constants';
import { reportsService } from '../../services';

const getReportsDownload = id => dispatch =>
  dispatch({
    type: reportsTypes.GET_REPORTS_DOWNLOAD,
    payload: reportsService.getReportsDownload(id),
    meta: { id }
  });

const mergeReports = data => dispatch =>
  dispatch({
    type: reportsTypes.GET_MERGE_REPORT,
    payload: reportsService.mergeReports(data)
  });

const reportsActions = {
  getReportsDownload,
  mergeReports
};

export { reportsActions as default, reportsActions, getReportsDownload, mergeReports };
