/**
 * A modal component displaying connection statuses (successful, failed, unreachable) for a source.
 * Utilizes expandable lists and status icons for clarity.
 *
 * @module connectionsModal
 */
import React from 'react';
import { Modal, ModalVariant, Button, Icon, List, ListItem } from '@patternfly/react-core';
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { Tbody, Tr, Td, Table, ExpandableRowContent } from '@patternfly/react-table';
import { SourceType, ConnectionType } from '../../types/types';
import './showSourceConnectionsModal.css';

export interface ConnectionsModalProps {
  source: SourceType;
  onClose: () => void;
  connections: {
    successful: ConnectionType[];
    failure: ConnectionType[];
    unreachable: ConnectionType[];
  };
}

export const ConnectionsModal: React.FC<ConnectionsModalProps> = ({ source, onClose, connections }) => {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const toggle = section => {
    const index = expanded.indexOf(section);
    const newExpanded =
      index >= 0
        ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)]
        : [...expanded, section];
    setExpanded(newExpanded);
  };
  return (
    <Modal
      variant={ModalVariant.small}
      title={source.name}
      isOpen={!!source}
      onClose={onClose}
      actions={[
        <Button key="cancel" variant="secondary" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <Table aria-label={'Connections lists'}>
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
                    onToggle: () => toggle(obj.category),
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
                      {connections[obj.category]?.length ? (
                        connections[obj.category].map(con => <ListItem key={con.name}>{con.name}</ListItem>)
                      ) : (
                        <ListItem>N/A</ListItem>
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
