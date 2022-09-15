import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Masthead, MenuItem, VerticalNav } from 'patternfly-react';
import { connectRouter, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import { routes } from '../router/router';
import titleImgBrand from '../../styles/images/title-brand.svg';
import titleImg from '../../styles/images/title.svg';

class PageLayout extends React.Component {
  constructor(props) {
    super(props);

    this.menuItems = [
      { isActive: true, menuType: 'help', displayTitle: 'About', key: 'about', onClick: this.onAbout },
      {
        isActive: false,
        menuType: 'help',
        displayTitle: 'Guides - Install',
        key: 'install',
        href: `${(!helpers.DEV_MODE && '.') || ''}/docs/install.html`,
        target: '_blank'
      },
      {
        isActive: true,
        menuType: 'help',
        displayTitle: 'Guides - Using',
        key: 'use',
        href: `${(!helpers.DEV_MODE && '.') || ''}/docs/use.html`,
        target: '_blank'
      },
      { isActive: true, menuType: 'action', displayTitle: 'Logout', key: 'logout', onClick: this.onLogout }
    ];
  }

  onAbout = () => {
    store.dispatch({
      type: reduxTypes.aboutModal.ABOUT_MODAL_SHOW
    });
  };

  onLogout = () => {
    const { logoutUser } = this.props;

    logoutUser().finally(() => {
      window.location = '/logout';
    });
  };

  onNavigate = path => {
    const { history } = this.props;

    history.push(path);
  };

  onUnauthorized = () => {
    window.location = '/logout';
  };

  renderIconBarActions() {
    const { session } = this.props;

    const title = (
      <React.Fragment>
        <Icon type="pf" name="user" /> {session && session.username}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Masthead.Dropdown id="app-help-dropdown" title={<span aria-hidden className="pficon pficon-help" />}>
          {this.menuItems.map(
            ({ isActive, displayTitle, menuType, ...item }, index) =>
              isActive &&
              menuType === 'help' && (
                <MenuItem eventKey={index} {...item}>
                  {displayTitle}
                </MenuItem>
              )
          )}
        </Masthead.Dropdown>
        <Masthead.Dropdown id="app-user-dropdown" title={title}>
          {this.menuItems.map(
            ({ isActive, displayTitle, menuType, ...item }, index) =>
              isActive &&
              menuType === 'action' && (
                <MenuItem eventKey={index} {...item}>
                  {displayTitle}
                </MenuItem>
              )
          )}
        </Masthead.Dropdown>
      </React.Fragment>
    );
  }

  renderMenuActions() {
    return this.menuItems.map(
      item => item.isActive && <VerticalNav.Item className="collapsed-nav-item" title={item.displayTitle} {...item} />
    );
  }

  renderMenuItems() {
    const { location, menu, isFullPage } = this.props;
    const activeItem = menu.find(item => item.path.indexOf(location.pathname) > -1);

    if (isFullPage) {
      return null;
    }

    return menu.map(item => (
      <VerticalNav.Item
        key={item.path}
        title={item.title}
        iconClass={item.iconClass}
        active={item === activeItem || (!activeItem && item.redirect)}
        onClick={() => this.onNavigate(item.path)}
      />
    ));
  }

  render() {
    const { children, session, uiBrand, uiName } = this.props;

    if (!session.authorized) {
      return (
        <div className="layout-pf layout-pf-fixed fadein">
          <Masthead
            titleImg={uiBrand ? titleImgBrand : titleImg}
            title={uiName}
            navToggle={false}
            onTitleClick={this.onUnauthorized}
          />
          <div>{children}</div>
        </div>
      );
    }

    /**
     * ToDo: Evaluate PF3-React VerticalNav vs PF4-React Page component. The component contributes to throwing a warning regarding unmounted components setting state.
     * And forces the consumer to monitor more closely how state is managed. The warnings correlate to resize events. This warning can be squashed by using an
     * `isMounted` state property to prevent render with a "null" return, or by avoiding the use of the onLayoutChange callback in the consuming component. This
     * may be related to the PF4-React implementation around "onPageResize" where a check around the returned size helps squash a warning.
     */
    return (
      <div className="layout-pf layout-pf-fixed fadein">
        <VerticalNav persistentSecondary={false}>
          <VerticalNav.Masthead>
            <VerticalNav.Brand titleImg={uiBrand ? titleImgBrand : titleImg} />
            <VerticalNav.IconBar>{this.renderIconBarActions()}</VerticalNav.IconBar>
          </VerticalNav.Masthead>
          {this.renderMenuItems()}
          {this.renderMenuActions()}
        </VerticalNav>
        <div className="container-pf-nav-pf-vertical">{children}</div>
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  isFullPage: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  logoutUser: PropTypes.func,
  menu: PropTypes.array,
  session: PropTypes.shape({
    authorized: PropTypes.bool,
    username: PropTypes.string
  }),
  uiBrand: PropTypes.bool,
  uiName: PropTypes.string
};

PageLayout.defaultProps = {
  history: {},
  isFullPage: false,
  location: {},
  logoutUser: helpers.noop,
  menu: routes,
  session: {
    authorized: false,
    username: ''
  },
  uiBrand: helpers.UI_BRAND,
  uiName: helpers.UI_NAME
};

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(reduxActions.user.logoutUser())
});

const mapStateToProps = state => ({
  session: state.user.session
});

const ConnectedPageLayout = connectRouter(mapStateToProps, mapDispatchToProps)(PageLayout);

export { ConnectedPageLayout as default, ConnectedPageLayout, PageLayout };
