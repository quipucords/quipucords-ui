/**
 * Add Source Modal Component
 *
 * This component displays a modal for adding or editing a source of a specific type. It provides
 * a form to input source details including name, hosts, port, credential, and SSL settings.
 *
 * @module addSourceModal
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
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
  onSubmit?: (payload: any) => void;
}

interface SourceFormProps extends Omit<AddSourceModalProps, 'isOpen'> {
  useForm?: typeof useSourceForm;
}

interface SourceFormType {
  credentials?: number[];
  useParamiko?: boolean;
  sslVerify?: boolean;
  sslProtocol: string;
  name?: string;
  hosts?: string;
  port?: string;
}

const useSourceForm = ({
  sourceType,
  source,
  useGetCredentials = useGetCredentialsApi
}: { sourceType?: string; source?: Partial<SourceType>; useGetCredentials?: typeof useGetCredentialsApi } = {}) => {
  const initialFormState: SourceFormType = {
    credentials: [],
    useParamiko: false,
    sslVerify: true,
    sslProtocol: 'SSLv23',
    name: '',
    hosts: undefined,
    port: ''
  };

  const { getCredentials } = useGetCredentials();
  const [credOptions, setCredOptions] = useState<{ value: string; label: string }[] | []>([]);
  const [formData, setFormData] = useState<SourceFormType>(initialFormState);

  const typeValue = source?.source_type || sourceType?.split(' ')?.shift()?.toLowerCase();
  const isNetwork = typeValue === 'network';
  const isOpenshift = typeValue === 'openshift';

  // Edit props, reset state on unmount
  useEffect(() => {
    if (source) {
      setFormData({
        credentials: source?.credentials?.map(c => c.id) || [],
        useParamiko: source?.options?.use_paramiko || false,
        sslVerify: source?.options?.ssl_cert_verify ?? true,
        sslProtocol: (source?.options?.disable_ssl && 'Disable SSL') || source?.options?.ssl_protocol || 'SSLv23',
        name: source?.name || '',
        hosts: source?.hosts?.join(',') || '',
        port: source?.port?.toString() || ''
      });
    }

    return () => {
      setFormData(initialFormState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCredentials({
      params: {
        cred_type: typeValue
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
  }, [typeValue, getCredentials]);

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData]
  );

  const filterFormData = useCallback(
    (data = formData) => {
      const { credentials, useParamiko, sslVerify, sslProtocol, name, hosts, port } = data;
      return {
        name: name,
        credentials: credentials?.map(c => Number(c)),
        hosts: helpers.normalizeHosts(hosts),
        port: port || (isOpenshift && '6443') || (isNetwork && '22') || '443',
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
    },
    [isNetwork, isOpenshift, formData, source, typeValue]
  );

  return {
    credOptions,
    formData,
    isNetwork,
    isOpenshift,
    handleInputChange,
    filterFormData,
    typeValue
  };
};

const SourceForm: React.FC<SourceFormProps> = ({
  source,
  sourceType,
  onClose = () => {},
  onSubmit = () => {},
  useForm = useSourceForm
}) => {
  const { formData, isNetwork, isOpenshift, credOptions, handleInputChange, filterFormData } = useForm({
    sourceType,
    source
  });
  const onAdd = () => onSubmit(filterFormData());

  return (
    <Form>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput
          value={formData?.name}
          placeholder="Enter a name for the source"
          isRequired
          type="text"
          id="source-name"
          name="name"
          onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
          ouiaId="name"
        />
      </FormGroup>
      <FormGroup label="Credentials" fieldId="credentials" isRequired>
        <TypeaheadCheckboxes
          onChange={(selections: string[]) => {
            const validIds = selections.map(Number).filter(id => !isNaN(id));
            handleInputChange('credentials', validIds);
          }}
          options={credOptions}
          selectedOptions={formData?.credentials?.map(String) || []}
          menuToggleOuiaId="add_credentials_select"
          maxSelections={isNetwork ? Infinity : 1} // Limit selection to 1 for non-network sources
        />
        {!isNetwork && (
          <HelperText>
            <HelperTextItem variant="warning">Only one credential can be selected for this source type.</HelperTextItem>
          </HelperText>
        )}
      </FormGroup>
      {isNetwork ? (
        <React.Fragment>
          <FormGroup label="Search addresses" isRequired fieldId="hosts">
            <TextArea
              placeholder="Enter values separated by commas"
              value={formData?.hosts}
              onChange={event => handleInputChange('hosts', event.target.value)}
              validated={helpers.validateHosts(formData?.hosts, Infinity)}
              isRequired
              id="source-hosts"
              name="hosts"
              data-ouia-component-id="hosts_multiple"
            />
            <HelperText>
              Type IP addresses, IP ranges, and DNS host names. Use CIDR or Ansible notation for ranges.
            </HelperText>
          </FormGroup>
          <FormGroup label="Port" fieldId="port">
            <TextInput
              value={formData?.port}
              placeholder="Optional"
              type="text"
              id="source-port"
              name="port"
              onChange={event => handleInputChange('port', (event.target as HTMLInputElement).value)}
              ouiaId="port"
            />
            <HelperText>Default port is 22</HelperText>
          </FormGroup>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FormGroup label="IP address or hostname" isRequired fieldId="hosts">
            <TextInput
              value={formData?.hosts}
              onChange={event => handleInputChange('hosts', (event.target as HTMLInputElement).value)}
              isRequired
              validated={helpers.validateHosts(formData?.hosts, 1)}
              id="source-hosts"
              name="hosts"
              ouiaId="hosts_single"
            />
            <HelperText>Enter an IP address or hostname</HelperText>
          </FormGroup>
          <FormGroup label="Port" fieldId="port">
            <TextInput
              value={formData?.port}
              placeholder="Optional"
              type="text"
              id="source-port"
              name="port"
              onChange={event => handleInputChange('port', (event.target as HTMLInputElement).value)}
              ouiaId="port"
            />
            <HelperText>Default port is {isOpenshift ? '6443' : '443'}</HelperText>
          </FormGroup>
        </React.Fragment>
      )}
      {isNetwork ? (
        <FormGroup label="" fieldId="paramiko">
          <Checkbox
            key="paramiko"
            label="Connect using Paramiko instead of Open SSH"
            id="paramiko"
            isChecked={formData?.useParamiko}
            onChange={(_ev, checked) => handleInputChange('useParamiko', checked)}
            ouiaId="options_paramiko"
          />
        </FormGroup>
      ) : (
        <React.Fragment>
          <FormGroup label="Connection" fieldId="connection">
            <SimpleDropdown
              isFullWidth
              label={formData?.sslProtocol || 'Select protocol'}
              menuToggleOuiaId="options_ssl_protocol"
              variant={'default'}
              onSelect={item => handleInputChange('sslProtocol', item)}
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
              isDisabled={formData?.sslProtocol === 'Disable SSL'}
              isChecked={formData?.sslProtocol !== 'Disable SSL' && formData?.sslVerify}
              onChange={(_ev, checked) => handleInputChange('sslVerify', checked)}
              ouiaId="options_ssl_cert"
            />
          </FormGroup>
        </React.Fragment>
      )}
      <ActionGroup>
        <Button variant="primary" onClick={onAdd}>
          Save
        </Button>
        <Button variant="link" onClick={() => onClose()}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  source,
  sourceType,
  onClose = () => {},
  onSubmit = () => {}
}) => (
  <Modal
    variant={ModalVariant.small}
    title={(source && `Edit Source: ${source.name || ''}`) || `Add Source: ${sourceType || ''}`}
    isOpen={isOpen}
    onClose={() => onClose()}
  >
    <SourceForm source={source} sourceType={sourceType} onClose={onClose} onSubmit={onSubmit} />
  </Modal>
);

export { AddSourceModal as default, AddSourceModal, SourceForm, useSourceForm, type AddSourceModalProps };
