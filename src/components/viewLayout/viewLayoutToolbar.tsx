/**
 * Utilizes PatternFly for a responsive toolbar with theme toggling, help, and user logout functionality.
 * It auto-detects theme preference, provides a dropdown for help and user actions, and manages session state for
 * logout.
 *
 * @module appToolbar
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  Icon,
  MenuToggle,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { EllipsisVIcon, MoonIcon, InfoCircleIcon, SunIcon } from '@patternfly/react-icons';
import { useLogoutApi, useUserApi } from '../../hooks/useLoginApi';
import '@patternfly/react-styles/css/components/Avatar/avatar.css';
import avatarImage from '../../images/imgAvatar.svg';
import AboutModal from '../aboutModal/aboutModal';
import './viewLayoutToolbar.css';

interface AppToolbarProps {
  useLogout?: typeof useLogoutApi;
  useUser?: typeof useUserApi;
}

const AppToolbar: React.FC<AppToolbarProps> = ({ useLogout = useLogoutApi, useUser = useUserApi }) => {
  const { t } = useTranslation();
  const { logout: onLogout } = useLogout();
  const { getUser } = useUser();
  const [userName, setUserName] = useState<string>();
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [kebabDropdownOpen, setKebabDropdownOpen] = useState<boolean>(false);
  const localStorageTheme = localStorage?.getItem(`${process.env.REACT_APP_THEME_KEY}`);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorageTheme
      ? localStorageTheme === 'dark'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    getUser().then(username => setUserName(username));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = isDark => {
    const htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement) {
      if (isDark) {
        htmlElement.classList.add('pf-v6-theme-dark');
        localStorage?.setItem(`${process.env.REACT_APP_THEME_KEY}`, 'dark');
      } else {
        htmlElement.classList.remove('pf-v6-theme-dark');
        localStorage?.setItem(`${process.env.REACT_APP_THEME_KEY}`, 'light');
      }
    }
  };
  applyTheme(isDarkTheme);

  const onAbout = () => setAboutOpen(true);

  const onAboutClose = () => setAboutOpen(false);

  const onHelpSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    _value: string | number | undefined
  ) => {
    setHelpOpen(false);
  };

  const onUserDropdownSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    _value: string | number | undefined
  ) => {
    setUserDropdownOpen(false);
  };

  return (
    <React.Fragment>
      <Toolbar id="toolbar" isFullHeight isStatic>
        <ToolbarContent>
          <ToolbarGroup
            variant="action-group-plain"
            align={{ default: 'alignEnd' }}
            gap={{ default: 'gapNone', md: 'gapMd' }}
          >
            <ToolbarGroup variant="action-group-plain" visibility={{ default: 'hidden', lg: 'visible' }}>
              <ToolbarItem>
                <ToggleGroup aria-label={t('view.toolbar.aria-theme-toggle-group')}>
                  <ToggleGroupItem
                    aria-label={t('view.toolbar.aria-light-theme-toggle')}
                    icon={
                      <Icon size="md">
                        <SunIcon />
                      </Icon>
                    }
                    isSelected={!isDarkTheme}
                    onChange={() => {
                      setIsDarkTheme(false);
                      applyTheme(false);
                    }}
                  />
                  <ToggleGroupItem
                    aria-label={t('view.toolbar.aria-dark-theme-toggle')}
                    icon={
                      <Icon size="md">
                        <MoonIcon />
                      </Icon>
                    }
                    isSelected={isDarkTheme}
                    onChange={() => {
                      setIsDarkTheme(true);
                      applyTheme(true);
                    }}
                  />
                </ToggleGroup>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  popperProps={{ position: 'right' }}
                  onSelect={onHelpSelect}
                  onOpenChange={(isOpen: boolean) => setHelpOpen(isOpen)}
                  isOpen={helpOpen}
                  toggle={toggleRef => (
                    <MenuToggle
                      aria-label={t('view.toolbar.aria-menu-toggle')}
                      ref={toggleRef}
                      onClick={() => setHelpOpen(prev => !prev)}
                      isExpanded={helpOpen}
                      ouiaId="help_menu_toggle"
                    >
                      <InfoCircleIcon />
                    </MenuToggle>
                  )}
                >
                  <DropdownItem onClick={onAbout} value="about">
                    {t('view.toolbar.about')}
                  </DropdownItem>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem visibility={{ default: 'visible', lg: 'hidden' }}>
              <Dropdown
                isPlain
                popperProps={{ position: 'right' }}
                onSelect={onUserDropdownSelect}
                onOpenChange={(isOpen: boolean) => setKebabDropdownOpen(isOpen)}
                isOpen={kebabDropdownOpen}
                toggle={toggleRef => (
                  <MenuToggle
                    aria-label={t('view.toolbar.aria-menu-toggle')}
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setKebabDropdownOpen(prev => !prev)}
                    isExpanded={kebabDropdownOpen}
                    style={{ width: 'auto' }}
                    ouiaId="user_dropdown_button"
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownItem value="logout" onClick={onLogout} ouiaId="logout">
                  {t('view.toolbar.logout')}
                </DropdownItem>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem visibility={{ default: 'hidden', lg: 'visible' }}>
            <Dropdown
              popperProps={{ position: 'right' }}
              onSelect={onUserDropdownSelect}
              onOpenChange={(isOpen: boolean) => setUserDropdownOpen(isOpen)}
              isOpen={userDropdownOpen}
              toggle={toggleRef => (
                <MenuToggle
                  aria-label={t('view.toolbar.aria-menu-toggle')}
                  ref={toggleRef}
                  icon={<Avatar alt={t('view.toolbar.avatar-alt')} src={avatarImage} size="sm" />}
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  isExpanded={userDropdownOpen}
                  ouiaId="user_dropdown_button"
                >
                  {userName}
                </MenuToggle>
              )}
            >
              <DropdownItem value="logout" onClick={onLogout} ouiaId="logout">
                {t('view.toolbar.logout')}
              </DropdownItem>
            </Dropdown>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <AboutModal isOpen={aboutOpen} onClose={onAboutClose} useUser={useUser} />
    </React.Fragment>
  );
};

export { AppToolbar as default, AppToolbar, type AppToolbarProps };
