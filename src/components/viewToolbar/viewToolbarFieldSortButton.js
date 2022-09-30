import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { SortAmountDownAltIcon, SortAmountUpIcon } from '@patternfly/react-icons';
import { Tooltip } from '../tooltip/tooltip';
import { reduxTypes, storeHooks } from '../../redux';
import { useQuery, useView } from '../view/viewContext';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * On click sorting.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useView
 * @returns {Function}
 */
const useOnClick = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useView: useAliasView = useView
} = {}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();

  return ({ value }) => {
    dispatch([
      {
        type: reduxTypes.view.SET_QUERY,
        viewId,
        filter: API_QUERY_TYPES.ORDERING,
        value
      }
    ]);
  };
};

/**
 * Toolbar sort button wrapper.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useOnClick
 * @param {Function} props.useQuery
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const ViewToolbarFieldSortButton = ({ t, useOnClick: useAliasOnClick, useQuery: useAliasQuery, ...props }) => {
  const onClick = useAliasOnClick();
  const { [API_QUERY_TYPES.ORDERING]: ordering } = useAliasQuery();

  const isDescending = /^-/.test(ordering);
  const updatedOrdering = ordering?.replace(/^-/, '') || '';
  const isEmpty = updatedOrdering === '';
  const updatedDirection = isDescending ? updatedOrdering : `-${updatedOrdering}`;

  return (
    <Tooltip
      placement="right"
      content={t('toolbar.label', { context: ['tooltip', 'sort', (isDescending && 'dsc') || 'asc', updatedOrdering] })}
    >
      <Button
        onClick={() => !isEmpty && onClick({ value: updatedDirection })}
        variant={ButtonVariant.plain}
        data-test="toolbarSortButton"
        {...props}
      >
        {(isDescending && <SortAmountUpIcon />) || <SortAmountDownAltIcon />}
      </Button>
    </Tooltip>
  );
};

/**
 * Prop types
 *
 * @type {{useQuery: Function, viewId: string, useOnClick: Function}}
 */
ViewToolbarFieldSortButton.propTypes = {
  t: PropTypes.func,
  useOnClick: PropTypes.func,
  useQuery: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useQuery: Function, useOnClick: Function}}
 */
ViewToolbarFieldSortButton.defaultProps = {
  t: translate,
  useOnClick,
  useQuery
};

export { ViewToolbarFieldSortButton as default, ViewToolbarFieldSortButton, useOnClick };
