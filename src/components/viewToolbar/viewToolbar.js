import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { storeHooks } from '../../redux';
import { useToolbarFieldClear, useToolbarFieldClearAll } from './viewToolbarContext';
import { useOnRefresh, useView } from '../view/viewContext';
import { ViewToolbarSelectCategory } from './viewToolbarSelectCategory';
import { ViewToolbarFieldSort } from './viewToolbarFieldSort';
import { RefreshTimeButton } from '../refreshTimeButton/refreshTimeButton';
import { translate } from '../i18n/i18n';

const ViewToolbar = ({
  lastRefresh,
  secondaryFields,
  t,
  useOnRefresh: useAliasOnRefresh,
  useSelector: useAliasSelector,
  useToolbarFieldClear: useAliasToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useView: useAliasView
}) => {
  const { config, query, viewId } = useAliasView();
  const updatedCategoryFields = config?.toolbar?.filterFields || [];

  const currentCategory = useAliasSelector(({ view }) => view?.filters?.[viewId]?.currentFilterCategory);
  const onRefresh = useAliasOnRefresh();
  const clearField = useAliasToolbarFieldClear();
  const clearAllFields = useAliasToolbarFieldClearAll();

  /**
   * Clear a specific filter
   *
   * @event onClearFilter
   * @param {object} params
   * @param {*} params.value
   * @returns {void}
   */
  const onClearFilter = ({ value }) => clearField(value);

  /**
   * Clear all active filters.
   *
   * @event onClearAll
   * @returns {void}
   */
  const onClearAll = () => clearAllFields();

  /**
   * Set selected options for chip display.
   *
   * @param {*|string} value
   * @returns {Array}
   */
  const setSelectedOptions = value => {
    const categoryValue = query?.[value];
    return (categoryValue && [t('toolbar.label', { context: ['chip', categoryValue] })]) || [];
  };

  return (
    <React.Fragment>
      <Toolbar
        className="quipucords-toolbar"
        collapseListedFiltersBreakpoint="lg"
        clearAllFilters={onClearAll}
        clearFiltersButtonText={t('toolbar.label', { context: 'clear-filters' })}
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="lg">
            <ToolbarGroup variant="filter-group">
              {updatedCategoryFields.length > 1 && (
                <ToolbarItem>
                  <ViewToolbarSelectCategory />
                </ToolbarItem>
              )}
              {updatedCategoryFields.map(({ title, value, component: OptionComponent }) => {
                const chipProps = { categoryName: (typeof title === 'function' && title()) || title };
                chipProps.chips = setSelectedOptions(value);
                chipProps.deleteChip = () => onClearFilter({ value });

                return (
                  <ToolbarFilter
                    key={value}
                    showToolbarItem={currentCategory === value || updatedCategoryFields.length === 1}
                    {...chipProps}
                  >
                    <OptionComponent />
                  </ToolbarFilter>
                );
              })}
            </ToolbarGroup>
          </ToolbarToggleGroup>
          <ToolbarItem key="groupSeparator" variant={ToolbarItemVariant.separator} />
          <ToolbarItem key="sortFields" spacer={{ default: 'spacerSm' }}>
            <ViewToolbarFieldSort />
          </ToolbarItem>
          <ToolbarItem key="sortSeparator" variant={ToolbarItemVariant.separator} />
          <ToolbarItem key="lastRefresh">
            <RefreshTimeButton onRefresh={onRefresh} lastRefresh={lastRefresh} />
          </ToolbarItem>
          <ToolbarGroup
            key="secondaryFields"
            align={{ lg: 'alignRight', md: 'alignLeft' }}
            spacer={{ default: 'spacerSm' }}
          >
            {secondaryFields.map(field => (
              <ToolbarItem key={field.key}>{field}</ToolbarItem>
            ))}
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Divider />
    </React.Fragment>
  );
};

ViewToolbar.propTypes = {
  secondaryFields: PropTypes.array,
  lastRefresh: PropTypes.number,
  t: PropTypes.func,
  useOnRefresh: PropTypes.func,
  useSelector: PropTypes.func,
  useToolbarFieldClear: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useView: PropTypes.func
};

ViewToolbar.defaultProps = {
  secondaryFields: [],
  lastRefresh: 0,
  t: translate,
  useSelector: storeHooks.reactRedux.useSelector,
  useOnRefresh,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useView
};

export { ViewToolbar as default, ViewToolbar };
