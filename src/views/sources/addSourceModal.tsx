/**
 * Add Source Modal Component
 *
 * This component displays a modal for adding or editing a source of a specific type. It provides
 * a form to input source details including name, hosts, port, credential, proxy URL and SSL settings.
 *
 * @module addSourceModal
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { TypeaheadCheckboxes } from '../../components/typeAheadCheckboxes/typeaheadCheckboxes';
import { helpers } from '../../helpers';
import { type CredentialResponse, type SourceType, type CredentialOption } from '../../types/types';

const SSL_PROTOCOL_LABELS_TO_VALUES: Record<string, string> = {
  SSLv23: 'SSLv23',
  TLSv1: 'TLSv1',
  'TLSv1.1': 'TLSv1_1',
  'TLSv1.2': 'TLSv1_2',
  'Disable SSL': 'disable'
};

const SSL_PROTOCOL_VALUES_TO_LABELS: Record<string, string> = {
  SSLv23: 'SSLv23',
  TLSv1: 'TLSv1',
  TLSv1_1: 'TLSv1.1',
  TLSv1_2: 'TLSv1.2',
  disable: 'Disable SSL'
};

interface AddSourceModalProps {
  isOpen: boolean;
  source?: SourceType;
  sourceType?: string;
  errors?: SourceErrorType;
  onClearErrors?: () => void;
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
  proxy_url?: string;
}

interface SourceErrorType {
  [key: string]: string | undefined;
}

const useSourceForm = ({
  sourceType,
  source,
  errors: serverErrors,
  onClearErrors
}: {
  sourceType?: string;
  source?: Partial<SourceType>;
  errors?: SourceErrorType;
  onClearErrors?: () => void;
} = {}) => {
  const initialFormState: SourceFormType = {
    credentials: [],
    useParamiko: false,
    sslVerify: true,
    sslProtocol: 'SSLv23',
    name: '',
    hosts: '',
    port: '',
    proxy_url: ''
  };

  const { t } = useTranslation();
  const [initialSelectedCredentials, setInitialSelectedCredentials] = useState<CredentialOption[]>([]);
  const [formData, setFormData] = useState<SourceFormType>(initialFormState);
  const [localErrors, setLocalErrors] = useState<SourceErrorType>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [canSubmit, setCanSubmit] = useState(false);
  const typeValue = source?.source_type || sourceType?.split(' ')?.shift()?.toLowerCase();
  const isNetwork = typeValue === 'network';
  const isOpenshift = typeValue === 'openshift';
  const isEditMode = !!source;

  // Check if a field has an existing value on the server (for edit mode)
  const hasExistingValue = useCallback(
    (field: string) => {
      if (!isEditMode) {
        return false;
      }

      const existingValueChecks: { [key: string]: boolean } = {
        name: !!source?.name,
        hosts: !!(source?.hosts && source.hosts.length > 0),
        port: !!source?.port,
        proxy_url: !!source?.proxy_url,
        credentials: !!(source?.credentials && source.credentials.length > 0),
        ssl_protocol: !!source?.ssl_protocol,
        ssl_cert_verify: source?.ssl_cert_verify !== undefined,
        disable_ssl: source?.disable_ssl !== undefined,
        use_paramiko: source?.use_paramiko !== undefined
      };

      return existingValueChecks[field] || false;
    },
    [isEditMode, source]
  );

  const getRequiredFields = useCallback(() => {
    return ['name', 'hosts', 'credentials'];
  }, []);

  const validateField = useCallback(
    (field: string, value: string | number[]) => {
      const requiredFields = getRequiredFields();
      const errors: SourceErrorType = {};

      // Only validate required fields if they have been touched (for both add and edit modes)
      // For edit mode, also validate if field doesn't have existing value
      const shouldValidateAsRequired =
        requiredFields.includes(field) &&
        (touchedFields.has(field) || (!isEditMode ? false : !hasExistingValue(field)));

      // Handle array fields (like credentials)
      if (field === 'credentials') {
        const credentialsArray = Array.isArray(value) ? value : [];
        if (shouldValidateAsRequired && credentialsArray.length === 0) {
          errors[field] = t('view.sources.add-modal.error-cred-required');
        }
      } else {
        // Handle string fields
        const stringValue = String(value || '');
        if (shouldValidateAsRequired && (!stringValue || stringValue.trim() === '')) {
          errors[field] = t('view.sources.add-modal.error-field-required');
        }
      }

      return errors[field];
    },
    [getRequiredFields, isEditMode, touchedFields, hasExistingValue]
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const requiredFields = getRequiredFields();
    const errors: SourceErrorType = {};

    requiredFields.forEach(field => {
      const fieldValue = formData[field as keyof SourceFormType];
      let validationValue: string | number[];
      if (field === 'credentials') {
        validationValue = Array.isArray(fieldValue) ? fieldValue : [];
      } else {
        validationValue = String(fieldValue || '');
      }
      const error = validateField(field, validationValue);
      if (error) {
        errors[field] = error;
      }
    });

    setLocalErrors(errors);

    // Combine local and server errors for validation
    const allValidationErrors = { ...serverErrors, ...errors };

    // For edit mode: form is valid if no validation errors exist
    // For add mode: form is valid if no errors AND all required fields have values
    let isFormValid = Object.keys(allValidationErrors).length === 0;

    if (!isEditMode) {
      // Add mode: ensure all required fields are filled
      isFormValid =
        isFormValid &&
        requiredFields.every(field => {
          const value = formData[field as keyof SourceFormType];
          if (field === 'credentials') {
            const credentialsArray = Array.isArray(value) ? value : [];
            return credentialsArray.length > 0;
          }
          return value && String(value).trim() !== '';
        });
    } else {
      // Edit mode: ensure touched required fields are filled OR field has existing value
      isFormValid =
        isFormValid &&
        requiredFields.every(field => {
          const value = formData[field as keyof SourceFormType];
          const fieldNotTouched = !touchedFields.has(field);
          const fieldHasExistingValue = hasExistingValue(field);

          let fieldHasValue;
          if (field === 'credentials') {
            const credentialsArray = Array.isArray(value) ? value : [];
            fieldHasValue = credentialsArray.length > 0;
          } else {
            fieldHasValue = value && String(value).trim() !== '';
          }

          return fieldHasValue || (fieldNotTouched && fieldHasExistingValue);
        });
    }

    setCanSubmit(isFormValid);
    return isFormValid;
  }, [formData, getRequiredFields, validateField, isEditMode, touchedFields, hasExistingValue, serverErrors]);

  // Combined errors (server + local validation)
  const allErrors = { ...serverErrors, ...localErrors };

  const getCleanedSourceData = (formData: Record<string, any>) => {
    const cleanedData = { ...formData };

    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value === '') {
        delete cleanedData[key];
      }
    });

    return cleanedData;
  };

  // Edit props, reset state on unmount
  useEffect(() => {
    if (source) {
      setFormData({
        credentials: source?.credentials?.map(c => c.id) || [],
        useParamiko: source?.use_paramiko || false,
        sslVerify: source?.ssl_cert_verify ?? true,
        sslProtocol: source?.disable_ssl
          ? 'Disable SSL'
          : SSL_PROTOCOL_VALUES_TO_LABELS[source?.ssl_protocol || 'SSLv23'],
        name: source?.name || '',
        hosts: source?.hosts?.join(',') || '',
        port: source?.port?.toString() || '',
        proxy_url: source?.proxy_url || ''
      });
    }

    return () => {
      setFormData(initialFormState);
      setLocalErrors({});
      setTouchedFields(new Set());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, touchedFields, serverErrors]);

  // Helper function to convert source.credentials to CredentialOption[]
  const convertToCredentialOptions = useCallback((credentials: CredentialResponse[]): CredentialOption[] => {
    return credentials.map(cred => ({
      value: cred.id.toString(),
      label: cred.name,
      credential: cred
    }));
  }, []);

  // Initialize selected credentials for edit mode using existing data
  useEffect(() => {
    if (source?.credentials && source.credentials.length > 0) {
      const credentialOptions = convertToCredentialOptions(source.credentials);
      setInitialSelectedCredentials(credentialOptions);
    }
  }, [source, convertToCredentialOptions]);

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setTouchedFields(prev => new Set([...prev, field]));

      // Clear server error for this field when user starts typing
      if (serverErrors?.[field] && onClearErrors) {
        const newServerErrors = { ...serverErrors };
        delete newServerErrors[field];
        onClearErrors();
      }

      // Validate the field on change
      let validationValue: string | number[];
      if (field === 'credentials') {
        validationValue = Array.isArray(value) ? value : [];
      } else {
        validationValue = String(value || '');
      }
      const error = validateField(field, validationValue);
      setLocalErrors(prev => ({
        ...prev,
        [field]: error || undefined
      }));
    },
    [serverErrors, onClearErrors, validateField]
  );

  const filterFormData = useCallback(
    (data = formData) => {
      const { credentials, useParamiko, sslVerify, sslProtocol, name, hosts, port, proxy_url } = data;
      const payload: any = {
        name,
        credentials: credentials?.map(c => Number(c)),
        hosts: helpers.normalizeCommaSeparated(hosts),
        port: port || (isOpenshift && '6443') || (isNetwork && '22') || '443',
        ...(!source && { source_type: typeValue }),
        ...(source && { id: source.id })
      };

      if (!isNetwork) {
        const apiValue = SSL_PROTOCOL_LABELS_TO_VALUES[sslProtocol];
        if (apiValue !== 'disable') {
          payload.ssl_protocol = apiValue;
          payload.ssl_cert_verify = sslVerify;
          payload.disable_ssl = false;
        } else {
          payload.disable_ssl = true;
        }
        if (proxy_url) {
          payload.proxy_url = proxy_url;
        }
      } else {
        payload.use_paramiko = useParamiko;
      }

      return getCleanedSourceData(payload);
    },
    [isNetwork, isOpenshift, formData, source, typeValue, getCleanedSourceData]
  );

  return {
    initialSelectedCredentials,
    formData,
    isNetwork,
    isOpenshift,
    errors: allErrors,
    touchedFields,
    canSubmit,
    handleInputChange,
    filterFormData,
    typeValue
  };
};

const ErrorFragment: React.FC<{
  errorMessage: string | undefined;
  fieldTouched?: boolean;
}> = ({ errorMessage, fieldTouched = true }) => {
  if (errorMessage && fieldTouched) {
    return (
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
            {errorMessage}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    );
  }

  return null;
};

const SourceForm: React.FC<SourceFormProps> = ({
  source,
  sourceType,
  errors: serverErrors,
  onClose = () => {},
  onSubmit = () => {},
  onClearErrors = () => {},
  useForm = useSourceForm
}) => {
  const {
    formData,
    isNetwork,
    isOpenshift,
    initialSelectedCredentials,
    errors,
    touchedFields,
    canSubmit,
    handleInputChange,
    filterFormData,
    typeValue
  } = useForm({
    sourceType,
    source,
    errors: serverErrors,
    onClearErrors
  });

  const { t } = useTranslation();

  const scrollToFirstError = useCallback(() => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element =
        document.getElementById(`source-${firstErrorField}`) || document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        element.focus();
      }
    }
  }, [errors]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      scrollToFirstError();
    }
  }, [serverErrors, scrollToFirstError]);

  const onAdd = () => onSubmit(filterFormData());

  return (
    <Form>
      <FormGroup label={t('view.sources.add-modal.name.label')} isRequired fieldId="name">
        <TextInput
          value={formData?.name}
          placeholder={t('view.sources.add-modal.name.placeholder')}
          isRequired
          type="text"
          id="source-name"
          name="name"
          validated={errors?.name ? 'error' : 'default'}
          onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
          ouiaId="name"
        />
        <ErrorFragment errorMessage={errors?.name} fieldTouched={touchedFields.has('name')} />
      </FormGroup>
      <FormGroup label={t('view.sources.add-modal.credentials.label')} fieldId="credentials" isRequired>
        <TypeaheadCheckboxes
          onChange={(selections: string[]) => {
            const validIds = selections.map(Number).filter(id => !isNaN(id));
            handleInputChange('credentials', validIds);
          }}
          selectedOptions={formData?.credentials?.map(String) || []}
          credentialType={typeValue}
          initialSelectedCredentials={initialSelectedCredentials}
          menuToggleOuiaId="add_credentials_select"
          maxSelections={isNetwork ? Infinity : 1} // Limit selection to 1 for non-network sources
        />
        {!isNetwork && (
          <HelperText>
            <HelperTextItem variant="warning">{t('view.sources.add-modal.credentials.warning-many')}</HelperTextItem>
          </HelperText>
        )}
        <ErrorFragment errorMessage={errors?.credentials} fieldTouched={touchedFields.has('credentials')} />
      </FormGroup>
      {isNetwork ? (
        <React.Fragment>
          <FormGroup label={t('view.sources.add-modal.hosts-network.label')} isRequired fieldId="hosts">
            <TextArea
              placeholder={t('view.sources.add-modal.hosts-network.placeholder')}
              value={formData?.hosts}
              onChange={event => handleInputChange('hosts', event.target.value)}
              isRequired
              id="source-hosts"
              name="hosts"
              data-ouia-component-id="hosts_multiple"
              validated={errors?.hosts ? 'error' : 'default'}
            />
            <HelperText>{t('view.sources.add-modal.hosts-network.helper')}</HelperText>
            <ErrorFragment errorMessage={errors?.hosts} fieldTouched={touchedFields.has('hosts')} />
          </FormGroup>
          <FormGroup label={t('view.sources.add-modal.port-network.label')} fieldId="port">
            <TextInput
              value={formData?.port}
              placeholder={t('view.sources.add-modal.port-network.placeholder')}
              type="text"
              id="source-port"
              name="port"
              onChange={event => handleInputChange('port', (event.target as HTMLInputElement).value)}
              ouiaId="port"
            />
            <HelperText id="source-port-helper-text">{t('view.sources.add-modal.port-network.helper')}</HelperText>
          </FormGroup>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FormGroup label={t('view.sources.add-modal.hosts-others.label')} isRequired fieldId="hosts">
            <TextInput
              value={formData?.hosts}
              onChange={event => handleInputChange('hosts', (event.target as HTMLInputElement).value)}
              isRequired
              id="source-hosts"
              data-testid="input-host"
              name="hosts"
              ouiaId="hosts_single"
              validated={errors?.hosts ? 'error' : 'default'}
            />
            <HelperText>{t('view.sources.add-modal.hosts-others.helper')}</HelperText>
            <ErrorFragment errorMessage={errors?.hosts} fieldTouched={touchedFields.has('hosts')} />
          </FormGroup>
          <FormGroup label={t('view.sources.add-modal.port-others.label')} fieldId="port">
            <TextInput
              value={formData?.port}
              placeholder={t('view.sources.add-modal.port-others.placeholder')}
              type="text"
              id="source-port"
              data-testid="input-port"
              name="port"
              onChange={event => handleInputChange('port', (event.target as HTMLInputElement).value)}
              ouiaId="port"
            />
            <HelperText id="source-port-helper-text">
              {t('view.sources.add-modal.port-others.helper', { port: isOpenshift ? '6443' : '443' })}
            </HelperText>
          </FormGroup>
          <FormGroup label={t('view.sources.add-modal.proxy.label')} fieldId="proxy_url">
            <TextInput
              value={formData?.proxy_url || ''}
              placeholder={t('view.sources.add-modal.proxy.placeholder')}
              type="text"
              id="proxy-url"
              data-testid="input-proxy"
              name="proxy_url"
              onChange={event => handleInputChange('proxy_url', (event.target as HTMLInputElement).value || undefined)}
              ouiaId="proxy_url"
            />
            <HelperText>{t('view.sources.add-modal.proxy.helper')}</HelperText>
          </FormGroup>
        </React.Fragment>
      )}
      {isNetwork ? (
        <FormGroup label="" fieldId="paramiko">
          <Checkbox
            key="paramiko"
            label={t('view.sources.add-modal.paramiko.checkbox-label')}
            id="paramiko"
            isChecked={formData?.useParamiko}
            onChange={(_ev, checked) => handleInputChange('useParamiko', checked)}
            ouiaId="options_paramiko"
          />
        </FormGroup>
      ) : (
        <React.Fragment>
          <FormGroup label={t('view.sources.add-modal.connection.label')} fieldId="connection">
            <SimpleDropdown
              isFullWidth
              label={formData?.sslProtocol || t('view.sources.add-modal.connection.default_value')}
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
              label={t('view.sources.add-modal.ssl-verify.checkbox-label')}
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
        <Button variant="primary" onClick={onAdd} isDisabled={!canSubmit}>
          {t('view.sources.add-modal.actions.save')}
        </Button>
        <Button variant="link" onClick={() => onClose()}>
          {t('view.sources.add-modal.actions.cancel')}
        </Button>
      </ActionGroup>
    </Form>
  );
};

const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  source,
  sourceType,
  errors,
  onClearErrors = () => {},
  onClose = () => {},
  onSubmit = () => {}
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      variant={ModalVariant.small}
      title={
        (source && t('view.sources.modal-title.edit', { name: source.name || '' })) ||
        t('view.sources.modal-title.add', { type: sourceType || '' })
      }
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <SourceForm
        source={source}
        sourceType={sourceType}
        errors={errors}
        onClearErrors={onClearErrors}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export {
  AddSourceModal as default,
  AddSourceModal,
  SourceForm,
  useSourceForm,
  type AddSourceModalProps,
  type SourceErrorType
};
