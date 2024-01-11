import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  MenuToggle,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { EllipsisVIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { useUsername } from '../../components/sessionContext/SessionProvider';

import '@patternfly/react-styles/css/components/Avatar/avatar.css';
import './AppToolbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppToolbar: React.FunctionComponent = () => {
  const [helpOpen, setHelpOpen] = React.useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState<boolean>(false);
  const [kebabDropdownOpen, setKebabDropdownOpen] = React.useState<boolean>(false);
  const userName = useUsername();
  const nav = useNavigate();

  const onAbout = () => {};

  const onLogout = () => {
    axios
      .put('https://0.0.0.0:9443/api/v1/users/logout/')
      .catch(err => {
        console.error('Failed to logout', err);
      })
      .finally(() => {
        localStorage.removeItem('authToken');
        nav('/login');
      });
  };

  const onHelpSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    setHelpOpen(false);
  };

  const onUserDropdownSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    setUserDropdownOpen(false);
  };

  return (
    <Toolbar id="toolbar" isFullHeight isStatic>
      <ToolbarContent>
        <ToolbarGroup
          variant="icon-button-group"
          align={{ default: 'alignRight' }}
          spacer={{ default: 'spacerNone', md: 'spacerMd' }}
        >
          <ToolbarGroup
            variant="icon-button-group"
            visibility={{ default: 'hidden', lg: 'visible' }}
          >
            <ToolbarItem>
              <Dropdown
                popperProps={{ position: 'right' }}
                onSelect={onHelpSelect}
                onOpenChange={(isOpen: boolean) => setHelpOpen(isOpen)}
                isOpen={helpOpen}
                toggle={toggleRef => (
                  <MenuToggle
                    aria-label="Toggle"
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setHelpOpen(prev => !prev)}
                    isExpanded={helpOpen}
                  >
                    <QuestionCircleIcon />
                  </MenuToggle>
                )}
              >
                <DropdownItem onClick={onAbout} value="about">
                  About
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
                  aria-label="Toggle"
                  ref={toggleRef}
                  variant="plain"
                  onClick={() => setKebabDropdownOpen(prev => !prev)}
                  isExpanded={kebabDropdownOpen}
                  style={{ width: 'auto' }}
                >
                  <EllipsisVIcon />
                </MenuToggle>
              )}
              ouiaId="user_dropdown"
            >
              <DropdownItem value="logout" onClick={onLogout}>
                Logout
              </DropdownItem>
            </Dropdown>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem visibility={{ default: 'hidden', lg: 'visible' }}>
          <Dropdown
            onSelect={onUserDropdownSelect}
            onOpenChange={(isOpen: boolean) => setUserDropdownOpen(isOpen)}
            isOpen={userDropdownOpen}
            ouiaId="user_dropdown"
            toggle={toggleRef => (
              <MenuToggle
                aria-label="Toggle"
                ref={toggleRef}
                variant="plain"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                isExpanded={userDropdownOpen}
              >
                <div className="quipucords-toolbar__user-dropdown">
                  <span className="pf-v5-c-avatar" />
                  {userName}
                </div>
              </MenuToggle>
            )}
          >
            <DropdownItem value="logout" onClick={onLogout}>
              Logout
            </DropdownItem>
          </Dropdown>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default AppToolbar;
