import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { reduxTypes, store } from '../../redux';

class ViewPaginationRow extends React.Component {
  onPerPageSelect = (_e, perPage) => {
    const { viewType } = this.props;
    store.dispatch({
      type: reduxTypes.viewPagination.SET_PER_PAGE,
      viewType,
      pageSize: perPage
    });
  };

  onSetPage = (_e, pageNumber) => {
    const { viewType } = this.props;
    store.dispatch({
      type: reduxTypes.viewPagination.VIEW_PAGE,
      currentPage: pageNumber,
      viewType
    });
  };

  render() {
    const { currentPage, pageSize, totalCount } = this.props;

    const itemsStart = (currentPage - 1) * pageSize + 1;
    const itemsEnd = Math.min(currentPage * pageSize, totalCount);

    return (
      <Pagination
        className="quipucords-view__pagination"
        perPageComponent="button"
        dropDirection="down"
        perPage={pageSize}
        page={currentPage}
        onSetPage={this.onSetPage}
        itemCount={totalCount}
        itemsStart={itemsStart}
        itemsEnd={itemsEnd}
        onPerPageSelect={this.onPerPageSelect}
        variant={PaginationVariant.bottom}
      />
    );
  }
}

ViewPaginationRow.propTypes = {
  viewType: PropTypes.string,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number
};

ViewPaginationRow.defaultProps = {
  viewType: null,
  currentPage: 0,
  pageSize: 0,
  totalCount: 0
};

export { ViewPaginationRow as default, ViewPaginationRow };
