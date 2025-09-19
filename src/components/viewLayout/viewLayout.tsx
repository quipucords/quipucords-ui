/**
 * Provides the main layout for the application using PatternFly, incorporating a header, navigation sidebar,
 * and content area. It dynamically adjusts navigation based on routing, supports a sidebar toggle, and
 * ensures accessibility with a "Skip to Content" link. Excludes header and sidebar on the login page for a
 * simplified UI.
 *
 * @module appLayout
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Brand,
  Masthead,
  MastheadLogo,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  SkipToContent
} from '@patternfly/react-core';
import { helpers } from '../../helpers';
import { IAppRoute, routes } from '../../routes';
import { AppToolbar } from './viewLayoutToolbar';

interface AppLayoutProps {
  children: React.ReactNode;
  titleImg?: string;
  uiName?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  titleImg = helpers.getTitleImg(),
  uiName = helpers.UI_NAME
}) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const Header = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            isHamburgerButton
            aria-label="Global navigation"
            ouiaId="global-navigation"
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo>
            <Brand alt={t('view.alt-logo', { name: uiName })} heights={{ default: '36px' }}>
              <source srcSet={titleImg} />
            </Brand>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <AppToolbar />
      </MastheadContent>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink to={route.path}>{route.label}</NavLink>
    </NavItem>
  );

  // FixMe: PF spelling bug in attr "forwardScrollAriaLabel"
  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple" forwardScrollAriaLabel="Scroll forward">
        {routes
          .filter(route => !(route.id === 'overview') || helpers.FEATURE_OVERVIEW)
          .map((route, idx) => route.label && renderNavItem(route, idx))}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={event => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        if (primaryContentContainer) {
          primaryContentContainer.focus();
        }
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page mainContainerId={pageId} masthead={Header} sidebar={sidebarOpen && Sidebar} skipToContent={PageSkipToContent}>
      {children}
    </Page>
  );
};

export { AppLayout as default, AppLayout, type AppLayoutProps };
