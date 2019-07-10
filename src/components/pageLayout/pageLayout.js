import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Masthead, MenuItem, VerticalNav } from 'patternfly-react';
import { connectRouter, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import { routes } from '../router/router';
import titleImgBrand from '../../styles/images/title-brand.svg';
import titleImg from '../../styles/images/title.svg';

class PageLayout extends React.Component {
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
          <MenuItem eventKey="2" onClick={this.onAbout}>
            About
          </MenuItem>
          <MenuItem eventKey="3" href="./docs/install.html" target="_blank">
            Guides - Installing
          </MenuItem>
          <MenuItem eventKey="4" href="./docs/use.html" target="_blank">
            Guides - Using
          </MenuItem>
        </Masthead.Dropdown>
        <Masthead.Dropdown id="app-user-dropdown" title={title}>
          <MenuItem eventKey="5" onClick={this.onLogout}>
            Logout
          </MenuItem>
        </Masthead.Dropdown>
      </React.Fragment>
    );
  }

  renderMenuActions() {
    return [
      <VerticalNav.Item key="about" className="collapsed-nav-item" title="About" onClick={this.onAbout} />,
      <VerticalNav.Item
        key="install"
        className="collapsed-nav-item"
        title="Guide - Install"
        href="./docs/install.html"
      />,
      <VerticalNav.Item key="use" className="collapsed-nav-item" title="Guide - Using" href="./docs/use.html" />,
      <VerticalNav.Item key="logout" className="collapsed-nav-item" title="Logout" onClick={this.onLogout} />
    ];
  }

  renderMenuItems() {
    const { location, menu, isFullPage } = this.props;
    const activeItem = menu.find(item => item.to.indexOf(location.pathname) > -1);

    if (isFullPage) {
      return null;
    }

    return menu.map(item => (
      <VerticalNav.Item
        key={item.to}
        title={item.title}
        iconClass={item.iconClass}
        active={item === activeItem || (!activeItem && item.redirect)}
        onClick={() => this.onNavigate(item.to)}
      />
    ));
  }

  render() {
    const { brand, children, session } = this.props;

    if (!session.authorized) {
      return (
        <div className="layout-pf layout-pf-fixed fadein">
          <Masthead
            titleImg={brand ? titleImgBrand : titleImg}
            title="product discovery"
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
            <VerticalNav.Brand titleImg={brand ? titleImgBrand : titleImg} />
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
  brand: PropTypes.bool,
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
  })
};

PageLayout.defaultProps = {
  brand: helpers.RH_BRAND,
  history: {},
  isFullPage: false,
  location: {},
  logoutUser: helpers.noop,
  menu: routes,
  session: {
    authorized: false,
    username: ''
  }
};

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(reduxActions.user.logoutUser())
});

const mapStateToProps = state => ({
  session: state.user.session
});

const ConnectedPageLayout = connectRouter(mapStateToProps, mapDispatchToProps)(PageLayout);

export { ConnectedPageLayout as default, ConnectedPageLayout, PageLayout };
