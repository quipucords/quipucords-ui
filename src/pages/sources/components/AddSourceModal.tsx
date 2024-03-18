/**
 * Add Source Modal Component
 *
 * This component displays a modal for adding or editing a source of a specific type. It provides
 * a form to input source details including name, hosts, port, credential, and SSL settings.
 * @module AddSourceModal
 */
import * as React from 'react';
import {
  ActionGroup,
  Button,
  Checkbox,
  DropdownItem,
  Form,
  FormContextProvider,
  FormGroup,
  HelperText,
  Modal,
  ModalVariant,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import axios from 'axios';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import { TypeaheadCheckboxes } from 'src/components/TypeaheadCheckboxes';
import { SourceType } from 'src/types';

export interface AddSourceModalProps {
  source?: SourceType;
  type: string;
  onClose: () => void;
  onSubmit: (payload) => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({ source, type, onClose, onSubmit }) => {
  const [credOptions, setCredOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [credentials, setCredentials] = React.useState<string[]>(
    source?.credentials?.map(c => c.id) || []
  );
  const [useParamiko, setUseParamiko] = React.useState<boolean>(
    source?.options?.use_paramiko ?? false
  );
  const [sslVerify, setSslVerify] = React.useState<boolean>(
    source?.options?.ssl_cert_verify ?? true
  );
  const [sslProtocol, setSslProtocol] = React.useState<string>(
    source?.options?.disable_ssl ? 'Disable SSL' : source?.options?.ssl_protocol || 'SSLv23'
  );

  const typeValue = source?.source_type || type.split(' ').shift()?.toLowerCase();
  const isNetwork = typeValue === 'network';

  /**
   * Fetch Credentials Options Effect
   *
   * This effect is used to fetch a list of credential options based on a specific credential type.
   *
   * @param {string} typeValue - The credential type value to filter the options.
   */
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_CREDENTIALS_SERVICE}?cred_type=${typeValue}`)
      .then(res => {
        setCredOptions(res.data.results.map(o => ({ label: o.name, value: '' + o.id })));
      })
      .catch(err => console.error(err));
  }, []);

  /**
   * Handle Add Action
   *
   * This function is responsible for handling the "Add" action, which includes creating a payload
   * with the provided values and submitting it.
   *
   * @param {object} values - An object containing the input values for the new item.
   */
  const onAdd = values => {
    const payload = {
      credentials: credentials.map(c => Number(c)),
      hosts: values['hosts'].split(','),
      name: values['name'],
      port: !isNetwork ? '443' : values['port'] || '22',
      options: !isNetwork
        ? {
            ssl_cert_verify: sslProtocol !== 'Disable SSL' && sslVerify,
            disable_ssl: sslProtocol === 'Disable SSL',
            ...(sslProtocol !== 'Disable SSL' && { ssl_protocol: sslProtocol })
          }
        : {
            use_paramiko: useParamiko
          },
      ...(!source && { source_type: typeValue }),
      ...(source && { id: source.id })
    };
    onSubmit(payload);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={`${source ? 'Edit' : 'Add'} source: ${type}`}
      isOpen={!!type}
      onClose={onClose}
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
              />
            </FormGroup>
            <FormGroup label="Credentials" fieldId="credentials" isRequired>
              <TypeaheadCheckboxes
                onChange={setCredentials}
                options={credOptions}
                selectedOptions={credentials?.map(String) || []}
              />
            </FormGroup>
            {isNetwork ? (
              <>
                <FormGroup label="Search addresses" isRequired fieldId="hosts">
                  <TextArea
                    placeholder="Enter values separated by commas"
                    value={getValue('hosts')}
                    onChange={(_ev, val) => setValue('hosts', val)}
                    isRequired
                    id="source-hosts"
                    name="hosts"
                  />
                  <HelperText>
                    Type IP addresses, IP ranges, and DNS host names. Wildcards are valid. Use CIDR
                    or Ansible notation for ranges.
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
                  />
                  <HelperText>Default port is 22</HelperText>
                </FormGroup>
              </>
            ) : (
              <FormGroup label="IP address or hostname" isRequired fieldId="hosts">
                <TextInput
                  value={getValue('hosts')}
                  onChange={(_ev, val) => setValue('hosts', val)}
                  isRequired
                  id="source-hosts"
                  name="hosts"
                />
                <HelperText>Enter an IP address or hostname (Default port is 443)</HelperText>
              </FormGroup>
            )}
            {isNetwork ? (
              <FormGroup label="" fieldId="paramiko">
                <Checkbox
                  key="paramiko"
                  label="Connect using Paramiko instead of Open SSH"
                  id="paramiko"
                  isChecked={useParamiko}
                  onChange={(_ev, ch) => setUseParamiko(ch)}
                />
              </FormGroup>
            ) : (
              <>
                <FormGroup label="Connection" fieldId="connection">
                  <SimpleDropdown
                    isFullWidth
                    label={sslProtocol}
                    variant={'default'}
                    dropdownItems={['SSLv23', 'TLSv1', 'TLSv1.1', 'TLSv1.2', 'Disable SSL'].map(
                      s => (
                        <DropdownItem key={s} onClick={() => setSslProtocol(s)}>
                          {s}
                        </DropdownItem>
                      )
                    )}
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
                  />
                </FormGroup>
              </>
            )}

            <ActionGroup>
              <Button variant="primary" onClick={() => onAdd({ ...values })}>
                Save
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        )}
      </FormContextProvider>
    </Modal>
  );
};

export default AddSourceModal;
