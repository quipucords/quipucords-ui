import { userTypes } from '../constants';
import userService from '../../services/userService';

const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userService.whoami()
  });

const logoutUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_LOGOUT,
    payload: userService.logoutUser()
  });

export { authorizeUser, logoutUser };
