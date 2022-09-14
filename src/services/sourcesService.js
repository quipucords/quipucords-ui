import { serviceCall } from './config';

const addSource = (data = {}, params = {}) =>
  serviceCall({
    method: 'post',
    url: process.env.REACT_APP_SOURCES_SERVICE,
    data,
    params
  });

const deleteSource = id =>
  serviceCall({
    method: 'delete',
    url: `${process.env.REACT_APP_SOURCES_SERVICE}${id}/`
  });

const deleteSources = (data = []) => Promise.all(data.map(id => deleteSource(id)));

const getSources = (id = '', params = {}) =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_SOURCES_SERVICE}${id}`,
      params
    },
    { auth: false }
  );

const updateSource = (id, data = {}) =>
  serviceCall({
    method: 'put',
    url: `${process.env.REACT_APP_SOURCES_SERVICE}${id}/`,
    data
  });

const sourcesService = {
  addSource,
  deleteSource,
  deleteSources,
  getSources,
  updateSource
};

export { sourcesService as default, sourcesService, addSource, deleteSource, deleteSources, getSources, updateSource };
