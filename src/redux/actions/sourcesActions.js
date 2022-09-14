import { sourcesTypes } from '../constants';
import { sourcesService } from '../../services';

const addSource =
  (data, query = {}) =>
  dispatch =>
    dispatch({
      type: sourcesTypes.ADD_SOURCE,
      payload: sourcesService.addSource(data, query)
    });

const deleteSource = id => dispatch => {
  const updatedIds = (Array.isArray(id) && id) || [id];

  return dispatch({
    type: sourcesTypes.DELETE_SOURCE,
    payload: Promise.all(updatedIds.map(updatedId => sourcesService.deleteSource(updatedId)))
  });
};

const getScansSources =
  (query = {}) =>
  dispatch =>
    dispatch({
      type: sourcesTypes.GET_SCANS_SOURCES,
      payload: sourcesService.getSources('', query)
    });

const getSources =
  (query = {}) =>
  dispatch =>
    dispatch({
      type: sourcesTypes.GET_SOURCES,
      payload: sourcesService.getSources('', query)
    });

const updateSource = (id, data) => dispatch =>
  dispatch({
    type: sourcesTypes.UPDATE_SOURCE,
    payload: sourcesService.updateSource(id, data)
  });

const sourcesActions = {
  addSource,
  deleteSource,
  getScansSources,
  getSources,
  updateSource
};

export {
  sourcesActions as default,
  sourcesActions,
  addSource,
  deleteSource,
  getScansSources,
  getSources,
  updateSource
};
