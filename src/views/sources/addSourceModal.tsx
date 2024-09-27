/**
 * Add Source Modal Component
 *
 * This component displays a modal for adding or editing a source of a specific type. It provides
 * a form to input source details including name, hosts, port, credential, and SSL settings.
 *
 * @module addSourceModal
 */
import React, { useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormContextProvider,
  FormGroup,
  HelperText,
  Modal,
  ModalVariant,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { TypeaheadCheckboxes } from '../../components/typeAheadCheckboxes/typeaheadCheckboxes';
import { helpers } from '../../helpers';
import { useGetCredentialsApi } from '../../hooks/useCredentialApi';
import { type SourceType } from '../../types/types';

interface AddSourceModalProps {
  isOpen: boolean;
  source?: SourceType;
  sourceType?: string;
  onClose?: () => void;
  onSubmit?: (payload) => void;
  useGetCredentials?: typeof useGetCredentialsApi;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  source,
  sourceType,
  onClose = Function.prototype,
  onSubmit = Function.prototype,
  useGetCredentials = useGetCredentialsApi
}) => {
  const { getCredentials } = useGetCredentials();
  const [credOptions, setCredOptions] = useState<{ value: string; label: string }[] | []>([]);
  const [credentials, setCredentials] = useState<number[]>(source?.credentials?.map(c => c.id) || []);
  const [useParamiko, setUseParamiko] = useState<boolean>(source?.options?.use_paramiko ?? false);
  const [sslVerify, setSslVerify] = useState<boolean>(source?.options?.ssl_cert_verify ?? true);
  const [sslProtocol, setSslProtocol] = useState<string>(
    source?.options?.disable_ssl ? 'Disable SSL' : source?.options?.ssl_protocol || 'SSLv23'
  );

  const sourceTypeValue = source?.source_type || sourceType?.split(' ')?.shift()?.toLowerCase();
  const isNetwork = sourceTypeValue === 'network';

  useEffect(() => {
    getCredentials({
      params: {
        cred_type: sourceTypeValue
      }
    })
      .then(response => {
        const updatedOptions = response?.data?.results?.map(({ name, id }) => ({ label: name, value: `${id}` }));
        setCredOptions(updatedOptions || []);
      })
      .catch(err => {
        if (!helpers.TEST_MODE) {
          console.error(err);
        }
      });
  }, [getCredentials, sourceTypeValue]);

  const onAdd = values => {
    const payload = {
      credentials: credentials.map(c => Number(c)),
      hosts: values['hosts'].split(','),
      name: values['name'],
      port: values['port'] || (isNetwork ? '22' : '443'),
      options: !isNetwork
        ? {
            ssl_cert_verify: sslProtocol !== 'Disable SSL' && sslVerify,
            disable_ssl: sslProtocol === 'Disable SSL',
            ...(sslProtocol !== 'Disable SSL' && { ssl_protocol: sslProtocol })
          }
        : {
            use_paramiko: useParamiko
          },
      ...(!source && { source_type: sourceTypeValue }),
      ...(source && { id: source.id })
    };
    onSubmit(payload);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={`${source ? 'Edit' : 'Add'} source: ${sourceType}`}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <FormContextProvider
        initialValues={{
          name: source?.name || '',
          hosts: source?.hosts?.join(',') || '',
          port: source?.port ? String(source.port) : ''
        }}
      >
        {({ setValue, getValue, values }) => (
          <Form>
            <FormGroup label="Name" isRequired fieldId="name">
              <TextInput
                value={getValue('name')}
                placeholder="Enter a name for the source"
                isRequired
                type="text"
                id="source-name"
                name="name"
                onChange={ev => {
                  setValue('name', (ev.target as HTMLInputElement).value);
                }}
                ouiaId="name"
              />
            </FormGroup>
            <FormGroup label="Credentials" fieldId="credentials" isRequired>
              <TypeaheadCheckboxes
                onChange={(selections: string[]) => {
                  const selectedIds = selections.map(Number);
                  const validIds = selectedIds.filter(id => !isNaN(id));
                  setCredentials(validIds);
                }}
                options={credOptions}
                selectedOptions={credentials?.map(String) || []}
                menuToggleOuiaId="add_credentials_select"
              />
            </FormGroup>
            {isNetwork ? (
              <React.Fragment>
                <FormGroup label="Search addresses" isRequired fieldId="hosts">
                  <TextArea
                    placeholder="Enter values separated by commas"
                    value={getValue('hosts')}
                    onChange={(_ev, val) => setValue('hosts', val)}
                    isRequired
                    id="source-hosts"
                    name="hosts"
                    data-ouia-component-id="hosts_multiple"
                  />
                  <HelperText>
                    Type IP addresses, IP ranges, and DNS host names. Wildcards are valid. Use CIDR or Ansible notation
                    for ranges.
                  </HelperText>
                </FormGroup>
                <FormGroup label="Port" fieldId="port">
                  <TextInput
                    value={getValue('port')}
                    placeholder="Optional"
                    type="text"
                    id="source-port"
                    name="port"
                    onChange={ev => {
                      setValue('port', (ev.target as HTMLInputElement).value);
                    }}
                    ouiaId="port"
                  />
                  <HelperText>Default port is 22</HelperText>
                </FormGroup>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FormGroup label="IP address or hostname" isRequired fieldId="hosts">
                  <TextInput
                    value={getValue('hosts')}
                    onChange={(_ev, val) => setValue('hosts', val)}
                    isRequired
                    id="source-hosts"
                    name="hosts"
                    ouiaId="hosts_single"
                  />
                  <HelperText>Enter an IP address or hostname</HelperText>
                </FormGroup>
                <FormGroup label="Port" fieldId="port">
                  <TextInput
                    value={getValue('port')}
                    placeholder="Optional"
                    type="text"
                    id="source-port"
                    name="port"
                    onChange={ev => {
                      setValue('port', (ev.target as HTMLInputElement).value);
                    }}
                    ouiaId="port"
                  />
                  <HelperText>Default port is 443</HelperText>
                </FormGroup>
              </React.Fragment>
            )}
            {isNetwork ? (
              <FormGroup label="" fieldId="paramiko">
                <Checkbox
                  key="paramiko"
                  label="Connect using Paramiko instead of Open SSH"
                  id="paramiko"
                  isChecked={useParamiko}
                  onChange={(_ev, ch) => setUseParamiko(ch)}
                  ouiaId="options_paramiko"
                />
              </FormGroup>
            ) : (
              <React.Fragment>
                <FormGroup label="Connection" fieldId="connection">
                  <SimpleDropdown
                    isFullWidth
                    label={sslProtocol}
                    menuToggleOuiaId="options_ssl_protocol"
                    variant={'default'}
                    onSelect={item => setSslProtocol(item)}
                    dropdownItems={[
                      { item: 'SSLv23', ouiaId: 'sslv23' },
                      { item: 'TLSv1', ouiaId: 'tlsv1' },
                      { item: 'TLSv1.1', ouiaId: 'tlsv11' },
                      { item: 'TLSv1.2', ouiaId: 'tlsv12' },
                      { item: 'Disable SSL', ouiaId: 'disable_ssl' }
                    ]}
                  />
                </FormGroup>
                <FormGroup label="" fieldId="ssl_verify">
                  <Checkbox
                    key="ssl_verify"
                    label="Verify SSL certificate"
                    id="ssl_verify"
                    isDisabled={sslProtocol === 'Disable SSL'}
                    isChecked={sslProtocol !== 'Disable SSL' && sslVerify}
                    onChange={(_ev, ch) => setSslVerify(ch)}
                    ouiaId="options_ssl_cert"
                  />
                </FormGroup>
              </React.Fragment>
            )}

            <ActionGroup>
              <Button variant="primary" onClick={() => onAdd({ ...values })}>
                Save
              </Button>
              <Button variant="link" onClick={() => onClose()}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        )}
      </FormContextProvider>
    </Modal>
  );
};

export { AddSourceModal as default, AddSourceModal, type AddSourceModalProps };
