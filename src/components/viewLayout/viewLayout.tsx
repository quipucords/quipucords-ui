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
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent
} from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { helpers } from '../../helpers';
import { IAppRoute, IAppRouteGroup, routes } from '../../routes';
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
      <MastheadToggle>
        <Button variant="plain" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Global navigation">
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <Brand alt={t('view.alt-logo', { name: uiName })} heights={{ default: '36px' }}>
            <source srcSet={titleImg} />
          </Brand>
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

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some(route => route.path === location.pathname)}
    >
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  // FixMe: PF spelling bug in attr "forwardScrollAriaLabel"
  const Navigation = (
    <Nav id="nav-primary-simple" theme="dark">
      <NavList id="nav-list-simple" forwardScrollAriaLabel="Scroll forward">
        {routes.map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx))
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar theme="dark">
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
    <Page mainContainerId={pageId} header={Header} sidebar={sidebarOpen && Sidebar} skipToContent={PageSkipToContent}>
      {children}
    </Page>
  );
};

export { AppLayout as default, AppLayout, type AppLayoutProps };
