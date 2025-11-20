/**
 * A modal component displaying connection statuses (successful, failed, unreachable) for a source.
 * Utilizes expandable lists and status icons for clarity.
 *
 * @module connectionsModal
 */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, List, ListItem, Tooltip } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { Tbody, Tr, Td, Table, ExpandableRowContent } from '@patternfly/react-table';
import { type SourceResponse, type Connections } from '../../types/types';
import './showSourceConnectionsModal.css';

const MAX_HOSTS_PER_CATEGORY = 5;

interface ShowConnectionsModalProps {
  isOpen: boolean;
  maxHostsPerCategory?: number;
  source?: Pick<SourceResponse, 'name'>;
  onClose?: () => void;
  connections: Connections;
}

const ShowConnectionsModal: React.FC<ShowConnectionsModalProps> = ({
  isOpen,
  maxHostsPerCategory = MAX_HOSTS_PER_CATEGORY,
  source,
  onClose = Function.prototype,
  connections
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string[]>([]);
  const onToggle = useCallback(
    section => {
      const index = expanded.indexOf(section);
      const newExpanded =
        index >= 0
          ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)]
          : [...expanded, section];
      setExpanded(newExpanded);
    },
    [expanded]
  );

  const additionalHostsToolTip = (numHosts: number): string => {
    const additionalHosts: number = numHosts - maxHostsPerCategory;
    return t('view.sources.show-connections-modal.tooltip', { count: additionalHosts });
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={source?.name}
      isOpen={isOpen}
      onClose={() => {
        setExpanded([]);
        return onClose();
      }}
      actions={[
        <Button
          key="cancel"
          variant="secondary"
          onClick={() => {
            setExpanded([]);
            return onClose();
          }}
        >
          {t('view.sources.show-connections-modal.actions.close')}
        </Button>
      ]}
    >
      <Table aria-label={t('view.sources.show-connections-modal.aria-list')} isExpandable hasAnimations>
        {[
          {
            category: 'failed',
            icon: (
              <Icon status="danger">
                <ExclamationCircleIcon />
              </Icon>
            ),
            label: t('view.sources.show-connections-modal.failed')
          },
          {
            category: 'unreachable',
            icon: (
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>
            ),
            label: t('view.sources.show-connections-modal.unreachable')
          },
          {
            category: 'successful',
            icon: (
              <Icon status="success">
                <CheckCircleIcon />
              </Icon>
            ),
            label: t('view.sources.show-connections-modal.successful')
          }
        ].map((obj, rowIndex) => {
          return (
            <Tbody key={obj.category} isExpanded={expanded.includes(obj.category)}>
              <Tr>
                <Td
                  width={10}
                  expand={{
                    rowIndex,
                    isExpanded: expanded.includes(obj.category),
                    onToggle: () => onToggle(obj.category),
                    expandId: `${obj.category}-expandable`
                  }}
                />
                <Td width={10}>{obj.icon}</Td>
                <Td width={80}>{obj.label}</Td>
              </Tr>
              <Tr isExpanded={expanded.includes(obj.category)}>
                <Td />
                <Td />
                <Td>
                  <ExpandableRowContent>
                    <List isPlain>
                      {(connections[obj.category]?.length &&
                        connections[obj.category]
                          .slice(0, maxHostsPerCategory)
                          .map(connection => <ListItem key={connection.name}>{connection.name}</ListItem>)) || (
                        <ListItem>{t('view.sources.show-connections-modal.na')}</ListItem>
                      )}
                      {connections[obj.category]?.length > maxHostsPerCategory && (
                        <ListItem key="more">
                          <Tooltip content={additionalHostsToolTip(connections[obj.category]?.length)}>
                            <span>{t('view.sources.show-connections-modal.more')}</span>
                          </Tooltip>
                        </ListItem>
                      )}
                    </List>
                  </ExpandableRowContent>
                </Td>
              </Tr>
            </Tbody>
          );
        })}
      </Table>
    </Modal>
  );
};

export { ShowConnectionsModal as default, ShowConnectionsModal, type ShowConnectionsModalProps };
