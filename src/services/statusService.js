import { serviceCall } from './config';

const getStatus = () =>
  serviceCall(
    {
      url: process.env.REACT_APP_STATUS_SERVICE
    },
    { auth: false }
  );

const statusService = {
  getStatus
};

export { statusService as default, statusService, getStatus };
