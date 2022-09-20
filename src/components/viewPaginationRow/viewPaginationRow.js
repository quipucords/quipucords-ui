import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { useQuery, useView } from '../view/viewContext';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { helpers } from '../../common';

/**
 * Set page
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {(function(*): void)|*}
 */
const useOnSetPage = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const dispatch = useAliasDispatch();
  const { viewId } = useAliasView();

  return value => {
    dispatch({
      type: reduxTypes.view.SET_QUERY,
      viewId,
      filter: API_QUERY_TYPES.PAGE,
      value
    });
  };
};

/**
 * Set entries per page
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {(function(*): void)|*}
 */
const useOnPerPageSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const dispatch = useAliasDispatch();
  const { viewId } = useAliasView();

  return value => {
    dispatch([
      {
        type: reduxTypes.view.RESET_PAGE,
        viewId
      },
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter: API_QUERY_TYPES.PAGE_SIZE,
        value
      }
    ]);
  };
};

/**
 * View pagination
 *
 * @param {object} props
 * @param {number} props.totalResults
 * @param {Function} props.useOnPerPageSelect
 * @param {Function} props.useOnSetPage
 * @param {Function} props.useQuery
 * @returns {React.ReactNode}
 */
const ViewPaginationRow = ({
  totalResults,
  useOnPerPageSelect: useAliasOnPerPageSelect,
  useOnSetPage: useAliasOnSetPage,
  useQuery: useAliasQuery
}) => {
  const onPerPageSelect = useAliasOnPerPageSelect();
  const onSetPage = useAliasOnSetPage();
  const { [API_QUERY_TYPES.PAGE]: currentPage = 0, [API_QUERY_TYPES.PAGE_SIZE]: pageSize = 0 } = useAliasQuery();
  let updatedTotalResults = totalResults;

  if (helpers.DEV_MODE) {
    updatedTotalResults = helpers.devModeNormalizeCount(totalResults);
  }

  const itemsStart = (currentPage - 1) * pageSize + 1;
  const itemsEnd = Math.min(currentPage * pageSize, updatedTotalResults);

  return (
    <Pagination
      className="quipucords-view__pagination"
      perPageComponent="button"
      dropDirection="down"
      perPage={pageSize}
      page={currentPage}
      onSetPage={(_, value) => onSetPage(value)}
      itemCount={updatedTotalResults}
      itemsStart={itemsStart}
      itemsEnd={itemsEnd}
      onPerPageSelect={(_, value) => onPerPageSelect(value)}
      variant={PaginationVariant.bottom}
    />
  );
};

/**
 * Prop types
 *
 * @type {{totalResults: number, useOnSetPage: Function, useQuery: Function, useOnPerPageSelect: Function}}
 */
ViewPaginationRow.propTypes = {
  totalResults: PropTypes.number,
  useOnPerPageSelect: PropTypes.func,
  useOnSetPage: PropTypes.func,
  useQuery: PropTypes.func
};

/**
 * Default props
 *
 * @type {{totalResults: number, useOnSetPage: Function, useQuery: Function, useOnPerPageSelect: Function}}
 */
ViewPaginationRow.defaultProps = {
  totalResults: 0,
  useOnPerPageSelect,
  useOnSetPage,
  useQuery
};

export { ViewPaginationRow as default, ViewPaginationRow, useOnPerPageSelect, useOnSetPage };
