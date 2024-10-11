/**
 * Modal component for setting up scans with options for deep scans and concurrency.
 * Allows specifying products for deep scanning and custom directories. Uses PatternFly for UI elements.
 *
 * @module sourcesScanModal
 */
import React, { useState } from 'react';
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
  NumberInput,
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { type SourceType } from '../../types/types';

interface AddSourcesScanModalProps {
  isOpen: boolean;
  sources?: SourceType[];
  onClose?: () => void;
  onSubmit?: (payload) => void;
}

const AddSourcesScanModal: React.FC<AddSourcesScanModalProps> = ({
  isOpen,
  sources,
  onClose = Function.prototype,
  onSubmit = Function.prototype
}) => {
  const [deepScans, setDeepScans] = useState<string[]>([]);

  const onDeepScanChange = (option, checked) => {
    if (checked) {
      setDeepScans([...deepScans, option]);
    } else {
      setDeepScans(deepScans.filter(o => o !== option));
    }
  };

  const onScan = values => {
    const payload = {
      name: values['scan-name'],
      sources: sources?.map(s => s.id),
      options: {
        max_concurrency: values['scan-max-concurrent'],
        enabled_extended_product_search: {
          jboss_eap: deepScans.includes('jboss_eap'),
          jboss_fuse: deepScans.includes('jboss_fuse'),
          jboss_ws: deepScans.includes('jboss_ws'),
          search_directories: values['scan-alt-scan']?.split(',')
        }
      }
    };
    onSubmit(payload);
  };

  return (
    <Modal variant={ModalVariant.small} title="Scan" isOpen={isOpen} onClose={() => onClose()}>
      <FormContextProvider
        initialValues={{
          'scan-sources': sources?.map(s => s.name).join(', ') || '',
          'scan-max-concurrent': '25'
        }}
      >
        {({ setValue, getValue, values }) => (
          <Form>
            <FormGroup label="Name" isRequired fieldId="scan-name">
              <TextInput
                value={getValue('scan-name')}
                placeholder="Enter a name for the scan."
                isRequired
                type="text"
                id="scan-name"
                name="scan-name"
                onChange={ev => {
                  setValue('scan-name', (ev.target as HTMLInputElement).value);
                }}
                ouiaId="name"
              />
            </FormGroup>
            <FormGroup label="Sources" isRequired fieldId="scan-sources">
              <TextArea value={getValue('scan-sources')} isDisabled isRequired id="scan-sources" name="scan-sources" />
            </FormGroup>
            <FormGroup label="Maximum concurrent scans" fieldId="scan-max-concurrent">
              <NumberInput
                value={Number(getValue('scan-max-concurrent'))}
                onMinus={() =>
                  setValue('scan-max-concurrent', '' + Math.max(1, Number(getValue('scan-max-concurrent')) - 1))
                }
                onChange={ev =>
                  setValue(
                    'scan-max-concurrent',
                    '' + Math.max(1, Math.min(200, Number((ev.target as HTMLInputElement).value)))
                  )
                }
                onPlus={() =>
                  setValue('scan-max-concurrent', '' + Math.min(200, Number(getValue('scan-max-concurrent')) + 1))
                }
                inputName="input"
                inputAriaLabel="number input"
                minusBtnAriaLabel="minus"
                plusBtnAriaLabel="plus"
                data-ouia-component-id="scan_concurrency"
              />
            </FormGroup>
            <FormGroup
              label="Deep scan for these products"
              isStack
              fieldId="scan-deep-scan"
              hasNoPaddingTop
              role="group"
            >
              {[
                { label: 'JBoss EAP', value: 'jboss_eap' },
                { label: 'Fuse', value: 'jboss_fuse' },
                { label: 'JBoss web server', value: 'jboss_ws' }
              ].map(o => (
                <Checkbox
                  key={`deep-scan-${o.value}`}
                  label={o.label}
                  id={`deep-scan-${o.value}`}
                  isChecked={deepScans.includes(o.value)}
                  onChange={(_ev, ch) => onDeepScanChange(o.value, ch)}
                  ouiaId={`options_${o.value}`}
                />
              ))}
            </FormGroup>
            {!!deepScans.length && (
              <FormGroup label="Scan alternate directories" fieldId="scan-alt-scan">
                <TextArea
                  value={getValue('scan-alt-scan')}
                  onChange={(_ev, val) => setValue('scan-alt-scan', val)}
                  id="scan-alt-scan"
                  name="scan-alt-scan"
                  data-ouia-component-id="scan_alt_dirs"
                />
                <HelperText>Default: directories are /./opt./app./home/usr</HelperText>
              </FormGroup>
            )}
            <ActionGroup>
              <Button variant="primary" onClick={() => onScan({ ...values, deepScans })}>
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

export { AddSourcesScanModal as default, AddSourcesScanModal, type AddSourcesScanModalProps };
