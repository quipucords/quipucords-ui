/**
 * A modal component displaying connection statuses (successful, failed, unreachable) for a source.
 * Utilizes expandable lists and status icons for clarity.
 *
 * @module connectionsModal
 */
import React, { useCallback, useState } from 'react';
import { Button, Icon, List, ListItem, Tooltip } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { Tbody, Tr, Td, Table, ExpandableRowContent } from '@patternfly/react-table';
import { type SourceType, type Connections } from '../../types/types';
import './showSourceConnectionsModal.css';

export const MAX_HOSTS_PER_CATEGORY = 5;

interface ShowConnectionsModalProps {
  isOpen: boolean;
  source?: Pick<SourceType, 'name'>;
  onClose?: () => void;
  connections: Connections;
}

const ShowConnectionsModal: React.FC<ShowConnectionsModalProps> = ({
  isOpen,
  source,
  onClose = Function.prototype,
  connections
}) => {
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
          Close
        </Button>
      ]}
    >
      <Table aria-label={'Connections lists'} isExpandable hasAnimations>
        {[
          {
            category: 'failed',
            icon: (
              <Icon status="danger">
                <ExclamationCircleIcon />
              </Icon>
            ),
            label: 'Failed connections'
          },
          {
            category: 'unreachable',
            icon: (
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>
            ),
            label: 'Unreachable systems'
          },
          {
            category: 'successful',
            icon: (
              <Icon status="success">
                <CheckCircleIcon />
              </Icon>
            ),
            label: 'Successful connections'
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
                          .slice(0, MAX_HOSTS_PER_CATEGORY)
                          .map(connection => <ListItem key={connection.name}>{connection.name}</ListItem>)) || (
                        <ListItem>N/A</ListItem>
                      )}
                      {connections[obj.category]?.length > MAX_HOSTS_PER_CATEGORY && (
                        <ListItem key="more">
                          <Tooltip
                            content={`There are ${connections[obj.category].length - MAX_HOSTS_PER_CATEGORY} additional hosts not shown.`}
                          >
                            <span>...</span>
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
