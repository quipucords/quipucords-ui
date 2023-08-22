import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ApplicationLauncher,
  ApplicationLauncherItem,
  Avatar,
  Brand,
  Button,
  ButtonVariant,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageToggleButton,
  SkipToContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { BarsIcon, CogIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';
import titleImgBrand from '../../styles/images/title-brand.svg';
import titleImg from '../../styles/images/title.svg';
import { storeHooks, reduxActions, reduxTypes } from '../../redux';
import { routes } from '../router/router';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common/helpers';

/**
 * Page navigation and masthead.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} props.isUiBrand
 * @param {Array} props.leftMenu
 * @param {string} props.mainContainerId
 * @param {Function} props.t
 * @param {string} props.uiName
 * @param {Function} props.useDispatch
 * @param {Function} props.useLocation
 * @param {Function} props.useNavigate
 * @param {Function} props.useSelector
 * @returns {React.ReactNode}
 */
const PageLayout = ({
  children,
  isUiBrand,
  leftMenu,
  mainContainerId,
  t,
  uiName,
  useDispatch: useAliasDispatch,
  useLocation: useAliasLocation,
  useNavigate: useAliasNavigate,
  useSelector: useAliasSelector
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSmallScreenDropdownOpen, setIsSmallScreenDropdownOpen] = useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);

  const location = useAliasLocation();
  const navigate = useAliasNavigate();
  const dispatch = useAliasDispatch();
  const session = useAliasSelector(({ user }) => user.session, {});

  const onAbout = () => {
    dispatch({
      type: reduxTypes.aboutModal.ABOUT_MODAL_SHOW
    });
  };

  const onLogout = () => {
    dispatch(reduxActions.user.logoutUser()).finally(() => {
      window.location = '/logout';
    });
  };

  const onNavigate = path => {
    navigate(path);
  };

  const onUserDropdownToggle = isOpen => {
    setIsUserDropdownOpen(isOpen);
  };

  const onUserDropdownSelect = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const onSmallScreenDropdownToggle = isOpen => {
    setIsSmallScreenDropdownOpen(isOpen);
  };

  const onSmallScreenDropdownSelect = () => {
    setIsSmallScreenDropdownOpen(!isSmallScreenDropdownOpen);
  };

  const onAppLauncherToggle = isOpen => {
    setIsAppLauncherOpen(isOpen);
  };

  const onAppLauncherSelect = () => {
    setIsAppLauncherOpen(!isAppLauncherOpen);
  };

  /**
   * Masthead small screen grouped menu
   *
   * @type {Array}
   */
  const smallScreenDropdownItems = [
    <DropdownGroup key="group 2">
      <DropdownItem key="logout" onClick={() => onLogout()} ouiaId="logout">
        {t('view.label', { context: ['logout'] })}
      </DropdownItem>
    </DropdownGroup>,
    <Divider key="divider" />,
    <DropdownItem key="about" onClick={() => onAbout()}>
      <CogIcon /> {t('view.label', { context: ['about'] })}
    </DropdownItem>
  ];

  /**
   * Masthead help menu items
   *
   * @type {Array}
   */
  const appLauncherItems = [
    <ApplicationLauncherItem key="application_about" onClick={() => onAbout()}>
      {t('view.label', { context: ['about'] })}
    </ApplicationLauncherItem>
  ];

  /**
   * Masthead user menu
   *
   * @type {Array}
   */
  const userDropdownItems = [
    <DropdownGroup key="group 2">
      <DropdownItem key="group 2 logout" onClick={() => onLogout()} ouiaId="logout">
        {t('view.label', { context: ['logout'] })}
      </DropdownItem>
    </DropdownGroup>
  ];

  /**
   * Masthead toolbar
   *
   * @type {React.ReactNode}
   */
  const mastheadToolbar = (
    <Toolbar id="toolbar" isFullHeight isStatic>
      <ToolbarContent>
        <ToolbarGroup
          variant="icon-button-group"
          alignment={{ default: 'alignRight' }}
          spacer={{ default: 'spacerNone', md: 'spacerMd' }}
        >
          <ToolbarGroup variant="icon-button-group" visibility={{ default: 'hidden', lg: 'visible' }}>
            <ToolbarItem visibility={{ default: 'hidden', md: 'hidden', lg: 'visible' }}>
              <ApplicationLauncher
                position={DropdownPosition.right}
                toggleIcon={<QuestionCircleIcon />}
                onSelect={onAppLauncherSelect}
                onToggle={onAppLauncherToggle}
                isOpen={isAppLauncherOpen}
                items={appLauncherItems}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem visibility={{ default: 'visible', lg: 'hidden' }}>
            <Dropdown
              isPlain
              position="right"
              onSelect={onSmallScreenDropdownSelect}
              toggle={<KebabToggle onToggle={onSmallScreenDropdownToggle} />}
              isOpen={isSmallScreenDropdownOpen}
              dropdownItems={smallScreenDropdownItems}
              ouiaId="user_dropdown"
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem visibility={{ default: 'hidden', lg: 'visible' }}>
          <Dropdown
            isFullHeight
            onSelect={onUserDropdownSelect}
            isOpen={isUserDropdownOpen}
            toggle={
              <DropdownToggle icon={<Avatar src={imgAvatar} alt="Avatar" />} onToggle={onUserDropdownToggle}>
                {session?.username}
              </DropdownToggle>
            }
            dropdownItems={userDropdownItems}
            ouiaId="user_dropdown"
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  const masthead = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <Brand alt={t('view.brand-image-alt', { name: uiName })}>
            <source srcSet={isUiBrand ? titleImgBrand : titleImg} />
          </Brand>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{mastheadToolbar}</MastheadContent>
    </Masthead>
  );

  const pageNav = (
    <Nav>
      <NavList>
        {leftMenu
          ?.filter(({ title }) => typeof title === 'string' && title.length)
          ?.map(({ icon: Icon, title, path }) => (
            <NavItem
              className="quipucords-navItem"
              key={title}
              id={title}
              isActive={path === location?.pathname}
              onClick={() => onNavigate(path)}
              icon={<Icon />}
              component={Button}
              variant={ButtonVariant.link}
            >
              {t('view.label', { context: title })}
            </NavItem>
          ))}
      </NavList>
    </Nav>
  );

  const sidebar = <PageSidebar nav={pageNav} />;

  const pageSkipToContent = (
    <SkipToContent href={`#${mainContainerId}`}>{t('view.label', { context: ['skip-nav'] })}</SkipToContent>
  );

  return (
    <Page
      header={masthead}
      sidebar={sidebar}
      isManagedSidebar
      skipToContent={pageSkipToContent}
      mainContainerId={mainContainerId}
    >
      {children}
    </Page>
  );
};

/**
 * Prop types
 *
 * @type {{mainContainerId: string, useLocation: Function, t: Function, children: React.ReactNode, useSelector: Function,
 *     isUiBrand: boolean, useDispatch: Function, useNavigate: Function, uiName: string, leftMenu: Array}}
 */
PageLayout.propTypes = {
  children: PropTypes.node,
  isUiBrand: PropTypes.bool,
  leftMenu: PropTypes.array,
  mainContainerId: PropTypes.string,
  t: PropTypes.func,
  uiName: PropTypes.string,
  useDispatch: PropTypes.func,
  useLocation: PropTypes.func,
  useNavigate: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props
 *
 * @type {{mainContainerId: string, useLocation: Function, t: translate, children: React.ReactNode, useSelector: Function,
 *     isUiBrand: boolean, useDispatch: Function, useNavigate: Function, uiName: string, leftMenu: Array}}
 */
PageLayout.defaultProps = {
  children: null,
  isUiBrand: helpers.UI_BRAND,
  leftMenu: routes,
  mainContainerId: 'main-content',
  t: translate,
  uiName: helpers.UI_NAME,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useLocation,
  useNavigate,
  useSelector: storeHooks.reactRedux.useSelector
};

export { PageLayout as default, PageLayout };
