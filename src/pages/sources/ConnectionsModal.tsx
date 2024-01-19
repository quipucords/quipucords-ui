import { Modal, ModalVariant, Button, TextContent, Icon, List, ListItem, DataList, DataListItem, DataListItemRow, DataListToggle, DataListItemCells, DataListCell, DataListContent } from "@patternfly/react-core";
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@patternfly/react-icons";
import React from "react";
import { SourceType, ConnectionType } from "src/types";

export interface ConnectionsModalProps {
    source: SourceType,
    onClose: () => void,
    connections: {
        successful: ConnectionType[];
        failure: ConnectionType[];
        unreachable: ConnectionType[];
    }
}

export const ConnectionsModal: React.FC<ConnectionsModalProps> = ({ source, onClose, connections }) => {
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const toggle = (section) => {
        const index = expanded.indexOf(section);
        const newExpanded =
            index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, section];
        setExpanded(newExpanded);
    };
    return (
        <Modal
            variant={ModalVariant.medium}
            title={source.name}
            isOpen={!!source}
            onClose={onClose}
            actions={[
                <Button key="cancel" variant="secondary" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            <DataList aria-label={"Connections list"}>
                {[
                    {
                        'category': 'failed',
                        'icon': <Icon status="danger"><ExclamationCircleIcon /></Icon>,
                        'label': 'Failed connections',
                    },
                    {
                        'category': 'unreachable',
                        'icon': <Icon status="warning"><ExclamationTriangleIcon /></Icon>,
                        'label': 'Unreachable systems',
                    },
                    {
                        'category': 'successful',
                        'icon': <Icon status="success"><CheckCircleIcon /></Icon>,
                        'label': 'Successful connections',
                    }
                ].map(obj => {
                    return (
                        <DataListItem isExpanded={expanded.includes(obj.category)}>
                            <DataListItemRow>
                                <DataListToggle
                                    id={obj.category}
                                    onClick={() => toggle(obj.category)}
                                    isExpanded={expanded.includes(obj.category)}
                                />
                                <DataListItemCells
                                    dataListCells={[
                                        <DataListCell isIcon key="icon">
                                            {obj.icon}
                                        </DataListCell>,
                                        <DataListCell key="title">
                                            <span>{obj.label}</span>
                                        </DataListCell>
                                    ]}
                                />
                            </DataListItemRow>
                            <DataListContent
                                aria-label={`${obj.label} list`}
                                isHidden={!expanded.includes(obj.category)}
                            >
                                <List isPlain>
                                    {connections[obj.category]?.length ? (
                                        connections[obj.category].map(con => <ListItem key={con.name}>{con.name}</ListItem>)
                                    ) : (
                                        <ListItem>N/A</ListItem>
                                    )}
                                </List>
                            </DataListContent>
                        </DataListItem>
                    )
                })}
            </DataList>
        </Modal>
    )
};