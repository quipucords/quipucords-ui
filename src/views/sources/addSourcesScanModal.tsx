import React, { useCallback, useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  NumberInput,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { helpers } from '../../helpers';
import { type SourceType } from '../../types/types';

interface AddSourcesScanModalProps {
  isOpen: boolean;
  sources?: SourceType[];
  errors?: ScanErrorType;
  onClearErrors?: () => void;
  onClose?: () => void;
  onSubmit?: (payload: any) => Promise<void>;
}

interface ScanFormProps extends Omit<AddSourcesScanModalProps, 'isOpen'> {
  useForm?: typeof useScanForm;
}

interface ScanFormType {
  name: string;
  sources: SourceType[];
  maxConcurrency: number;
  deepScans: string[];
  searchDirectories: string;
}

interface ScanErrorType {
  [key: string]: string | undefined;
}

const useScanForm = ({
  sources,
  errors: serverErrors,
  onClearErrors
}: {
  sources?: SourceType[];
  errors?: ScanErrorType;
  onClearErrors?: () => void;
} = {}) => {
  const initialFormState: ScanFormType = {
    name: '',
    sources: sources || [],
    maxConcurrency: 25,
    deepScans: [],
    searchDirectories: ''
  };

  const [formData, setFormData] = useState<ScanFormType>(initialFormState);
  const [localErrors, setLocalErrors] = useState<ScanErrorType>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [canSubmit, setCanSubmit] = useState(false);

  const getRequiredFields = useCallback(() => {
    return ['name'];
  }, []);

  const validateField = useCallback(
    (field: string, value: string | number | string[]) => {
      const requiredFields = getRequiredFields();
      const errors: ScanErrorType = {};

      const shouldValidateAsRequired = requiredFields.includes(field) && touchedFields.has(field);
      if (field === 'name') {
        const stringValue = String(value || '');
        if (shouldValidateAsRequired && (!stringValue || stringValue.trim() === '')) {
          errors[field] = 'This field is required';
        }
      }

      return errors[field];
    },
    [getRequiredFields, touchedFields]
  );

  const validateForm = useCallback(() => {
    const requiredFields = getRequiredFields();
    const errors: ScanErrorType = {};
    requiredFields.forEach(field => {
      if (touchedFields.has(field)) {
        const fieldValue = formData[field as keyof ScanFormType];
        const error = validateField(field, fieldValue as string | number | string[]);
        if (error) {
          errors[field] = error;
        }
      }
    });

    setLocalErrors(errors);
    const allValidationErrors = { ...serverErrors, ...errors };
    let isFormValid = Object.keys(allValidationErrors).length === 0;

    isFormValid =
      isFormValid &&
      requiredFields.every(field => {
        const value = formData[field as keyof ScanFormType];
        return value && String(value).trim() !== '';
      });

    setCanSubmit(isFormValid);
    return isFormValid;
  }, [formData, getRequiredFields, validateField, serverErrors, touchedFields]);

  const allErrors = { ...serverErrors, ...localErrors };

  useEffect(() => {
    validateForm();
  }, [formData, touchedFields, serverErrors, validateForm]);

  useEffect(() => {
    if (sources) {
      setFormData({
        name: '',
        sources: sources,
        maxConcurrency: 25,
        deepScans: [],
        searchDirectories: ''
      });
      setTouchedFields(new Set());
      setLocalErrors({});
    }
  }, [sources]);

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setTouchedFields(prev => new Set([...prev, field]));

      if (serverErrors?.[field] && onClearErrors) {
        onClearErrors();
      }

      const error = validateField(field, value as string | number | string[]);
      setLocalErrors(prev => ({
        ...prev,
        [field]: error || undefined
      }));
    },
    [serverErrors, onClearErrors, validateField]
  );

  const filterFormData = useCallback(
    (data = formData) => {
      const { name, sources, maxConcurrency, deepScans, searchDirectories } = data;
      return {
        name,
        sources: sources.map(source => source.id),
        scan_type: 'inspect' as const,
        options: {
          max_concurrency: maxConcurrency,
          disabled_optional_products: {
            jboss_eap: false,
            jboss_fuse: false,
            jboss_ws: false
          },
          enabled_extended_product_search: {
            jboss_eap: deepScans.includes('jboss_eap'),
            jboss_fuse: deepScans.includes('jboss_fuse'),
            jboss_ws: deepScans.includes('jboss_ws'),
            search_directories: helpers.normalizeCommaSeparated(searchDirectories) || []
          }
        }
      };
    },
    [formData]
  );

  return {
    formData,
    errors: allErrors,
    touchedFields,
    canSubmit,
    handleInputChange,
    filterFormData
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

const ScanForm: React.FC<ScanFormProps> = ({
  sources,
  errors: serverErrors,
  onClose = () => {},
  onSubmit = () => {},
  onClearErrors = () => {},
  useForm = useScanForm
}) => {
  const { formData, errors, touchedFields, canSubmit, handleInputChange, filterFormData } = useForm({
    sources,
    errors: serverErrors,
    onClearErrors
  });

  const scrollToFirstError = useCallback(() => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element =
        document.getElementById(`scan-${firstErrorField}`) || document.querySelector(`[name="${firstErrorField}"]`);
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

  const onDeepScanChange = (option: string, checked: boolean) => {
    const currentDeepScans = formData.deepScans;
    if (checked) {
      handleInputChange('deepScans', [...currentDeepScans, option]);
    } else {
      handleInputChange(
        'deepScans',
        currentDeepScans.filter(o => o !== option)
      );
    }
  };

  const onScan = () => onSubmit(filterFormData());

  return (
    <Form>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput
          value={formData.name}
          placeholder="Enter a name for the scan."
          isRequired
          type="text"
          id="scan-name"
          name="name"
          validated={errors?.name ? 'error' : 'default'}
          onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
          ouiaId="name"
        />
        <ErrorFragment errorMessage={errors?.name} fieldTouched={touchedFields.has('name')} />
      </FormGroup>
      <FormGroup label="Sources" isRequired fieldId="sources">
        <TextArea
          value={sources?.map(s => s.name).join(', ') || ''}
          isDisabled
          isRequired
          id="scan-sources"
          name="sources"
          validated={errors?.sources ? 'error' : 'default'}
        />
        <ErrorFragment errorMessage={errors?.sources} fieldTouched={true} />
      </FormGroup>
      <FormGroup label="Maximum concurrent scans" fieldId="maxConcurrency">
        <NumberInput
          value={formData.maxConcurrency}
          onMinus={() => handleInputChange('maxConcurrency', Math.max(1, formData.maxConcurrency - 1))}
          onChange={ev =>
            handleInputChange(
              'maxConcurrency',
              Math.max(1, Math.min(200, Number((ev.target as HTMLInputElement).value) || 1))
            )
          }
          onPlus={() => handleInputChange('maxConcurrency', Math.min(200, formData.maxConcurrency + 1))}
          inputName="input"
          inputAriaLabel="number input"
          minusBtnAriaLabel="minus"
          plusBtnAriaLabel="plus"
          data-ouia-component-id="scan_concurrency"
        />
      </FormGroup>
      <FormGroup label="Deep scan for these products" isStack fieldId="deepScans" hasNoPaddingTop role="group">
        {[
          { label: 'JBoss EAP', value: 'jboss_eap' },
          { label: 'Fuse', value: 'jboss_fuse' },
          { label: 'JBoss web server', value: 'jboss_ws' }
        ].map(o => (
          <Checkbox
            key={`deep-scan-${o.value}`}
            label={o.label}
            id={`deep-scan-${o.value}`}
            isChecked={formData.deepScans.includes(o.value)}
            onChange={(_ev, ch) => onDeepScanChange(o.value, ch)}
            ouiaId={`options_${o.value}`}
          />
        ))}
      </FormGroup>
      {!!formData.deepScans.length && (
        <FormGroup label="Scan alternate directories" fieldId="searchDirectories">
          <TextArea
            value={formData.searchDirectories}
            onChange={(_ev, val) => handleInputChange('searchDirectories', val)}
            id="scan-alt-scan"
            name="searchDirectories"
            data-ouia-component-id="scan_alt_dirs"
          />
          <HelperText>Default: directories are /./opt./app./home/usr</HelperText>
        </FormGroup>
      )}
      <ActionGroup>
        <Button variant="primary" onClick={onScan} isDisabled={!canSubmit}>
          Save
        </Button>
        <Button variant="link" onClick={() => onClose()}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

const AddSourcesScanModal: React.FC<AddSourcesScanModalProps> = ({
  isOpen,
  sources,
  errors,
  onClearErrors = () => {},
  onClose = () => {},
  onSubmit = async () => {}
}) => (
  <Modal variant={ModalVariant.small} title="Scan" isOpen={isOpen} onClose={() => onClose()}>
    <ScanForm sources={sources} errors={errors} onClearErrors={onClearErrors} onClose={onClose} onSubmit={onSubmit} />
  </Modal>
);

export {
  AddSourcesScanModal as default,
  AddSourcesScanModal,
  ScanForm,
  useScanForm,
  type AddSourcesScanModalProps,
  type ScanErrorType
};
