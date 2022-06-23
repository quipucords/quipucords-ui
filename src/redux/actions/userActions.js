import { userTypes } from '../constants';
import { userService } from '../../services';

const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userService.whoami()
  });

const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userService.getLocale()
});

const logoutUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_LOGOUT,
    payload: userService.logoutUser()
  });

const userActions = {
  authorizeUser,
  getLocale,
  logoutUser
};

export { userActions as default, userActions, authorizeUser, getLocale, logoutUser };
