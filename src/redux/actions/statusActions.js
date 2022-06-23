import { statusTypes } from '../constants';
import { statusService } from '../../services';

const getStatus = () => dispatch =>
  dispatch({
    type: statusTypes.STATUS_INFO,
    payload: statusService.getStatus()
  });

const statusActions = { getStatus };

export { statusActions as default, statusActions, getStatus };
