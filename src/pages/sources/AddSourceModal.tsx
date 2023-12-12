import { ActionGroup, Button, Checkbox, DropdownItem, Form, FormContextProvider, FormGroup, HelperText, Modal, ModalVariant, NumberInput, TextArea, TextContent, TextInput } from '@patternfly/react-core';
import * as React from 'react';
import axios from 'axios';
import { TypeaheadCheckboxes } from 'src/components/TypeaheadCheckboxes';
import { SourceType } from 'src/types';
import { SimpleDropdown } from 'src/components/SimpleDropdown';

export interface AddSourceModalProps {
    type: string;
    onClose: () => void;
    onSubmit: (payload) => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({
    type,
    onClose,
    onSubmit
}) => {
    const [credOptions, setCredOptions] = React.useState<{ value: string, label: string }[]>([]);
    const [credentials, setCredentials] = React.useState<string[]>([]);
    const [useParamiko, setUseParamiko] = React.useState<boolean>(false);
    const [sslVerify, setSslVerify] = React.useState<boolean>(true);
    const [sslProtocol, setSslProtocol] = React.useState<string>('SSLv23');

    const typeValue = type.split(' ').shift()?.toLowerCase();
    const isNetwork = typeValue === "network";
   
    React.useEffect(() => {
        axios.get(
            `https://0.0.0.0:9443/api/v1/credentials/?cred_type=${typeValue}`,
            { headers: { "Authorization": `Token ${localStorage.getItem('authToken')}` } }
        ).then(res => {
            setCredOptions(res.data.results.map(o => ({ label: o.name, value: "" + o.id })));
        }).catch(err => console.error(err));
    }, [])

    const onAdd = (values) => {
        const payload = {
            "source_type": typeValue,
            "credentials": credentials.map(c => Number(c)),
            "hosts": values['hosts'].split(','),
            "name": values['name'],
            "port": !isNetwork ? '443' : values['port'] || '22',
            "options": !isNetwork ?
                {
                    "ssl_cert_verify": sslProtocol !== "Disable SSL" && sslVerify,
                    "disable_ssl": sslProtocol === "Disable SSL",
                    ...(sslProtocol !== "Disable SSL" && {"ssl_protocol": sslProtocol})
                } : 
                {
                    "use_paramiko": useParamiko
                }
        };
        onSubmit(payload);
    }

    return (
        <Modal
            variant={ModalVariant.small}
            title={`Add source: ${type}`}
            isOpen={!!type}
            onClose={onClose}
        >
            <FormContextProvider>
                {({ setValue, getValue, setError, values, errors }) => (
                    <Form isHorizontal>
                        <FormGroup label="Name" isRequired fieldId="name">
                            <TextInput
                                value={getValue('name')}
                                placeholder="Enter a name for the source"
                                isRequired
                                type="text"
                                id="source-name"
                                name="name"
                                onChange={(ev) => { setValue('name', (ev.target as HTMLInputElement).value) }}
                            />
                        </FormGroup>
                        {isNetwork ?
                            (<><FormGroup label="Search addresses" isRequired fieldId="hosts">
                                <TextArea
                                    placeholder='Enter values separated by commas'
                                    value={getValue('hosts')}
                                    onChange={(_ev, val) => setValue('hosts', val)}
                                    isRequired
                                    id="source-hosts"
                                    name="hosts"
                                />
                                <HelperText>Type IP addresses, IP ranges, and DNS host names. Wildcards are valid. Use CIDR or Ansible notation for ranges.</HelperText>
                            </FormGroup>
                                <FormGroup label="Port" fieldId="port">
                                    <TextInput
                                        value={getValue('port')}
                                        placeholder="Optional"
                                        type="text"
                                        id="source-port"
                                        name="port"
                                        onChange={(ev) => { console.log(credOptions); setValue('port', (ev.target as HTMLInputElement).value) }}
                                    />
                                    <HelperText>Default port is 22</HelperText>
                                </FormGroup>
                            </>) :
                            (<FormGroup label="IP address or hostname" isRequired fieldId="hosts">
                                <TextInput
                                    value={getValue('hosts')}
                                    onChange={(_ev, val) => setValue('hosts', val)}
                                    isRequired
                                    id="source-hosts"
                                    name="hosts"
                                />
                                <HelperText>Enter an IP address or hostname (Default port is 443)</HelperText>
                            </FormGroup>)
                        }
                        <FormGroup
                            label="Credential"
                            fieldId="credentials"
                            isRequired
                        >
                            <TypeaheadCheckboxes
                                onChange={setCredentials}
                                options={credOptions}
                            />
                        </FormGroup>
                        {isNetwork ?
                            (
                                <FormGroup
                                    label=""
                                    fieldId="paramiko"
                                >
                                    <Checkbox
                                        key='paramiko'
                                        label='Connect using Paramiko instead of Open SSH'
                                        id='paramiko'
                                        isChecked={useParamiko}
                                        onChange={(_ev, ch) => setUseParamiko(ch)}
                                    />
                                </FormGroup>
                            ) :
                            (<>
                                <FormGroup
                                    label="Connection"
                                    fieldId="connection"
                                >
                                    <SimpleDropdown
                                        isFullWidth
                                        label={sslProtocol}
                                        variant={'default'}
                                        dropdownItems={['SSLv23', 'TLSv1', 'TLSv1.1', 'TLSv1.2', 'Disable SSL'].map(s => (
                                            <DropdownItem onClick={() => setSslProtocol(s)}>{s}</DropdownItem>
                                        ))}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label=""
                                    fieldId="ssl_verify"
                                >
                                    <Checkbox
                                        key='ssl_verify'
                                        label='Verify SSL certificate'
                                        id='ssl_verify'
                                        isDisabled={sslProtocol === 'Disable SSL'}
                                        isChecked={sslProtocol !== 'Disable SSL' && sslVerify}
                                        onChange={(_ev, ch) => setSslVerify(ch)}
                                    />
                                </FormGroup>
                            </>)
                        }

                        <ActionGroup>
                            <Button variant="primary" onClick={() => onAdd({ ...values })}>Save</Button>
                            <Button variant="link" onClick={onClose}>Cancel</Button>
                        </ActionGroup>
                    </Form>
                )}
            </FormContextProvider>
        </Modal>
    )
}

export default AddSourceModal;