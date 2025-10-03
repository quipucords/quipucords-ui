/**
 * Component to work with secrets, including optional secrets.
 * By default it shows as standard <TextInput> with placeholder and type password (so value is masked).
 * On Edit modal, it shows as disabled input with placeholder. There's icon that allows you to enable input
 * and provide new value. There's also an option to undo editing.
 *
 * @module secretInput
 */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputGroup, InputGroupItem, TextInput } from '@patternfly/react-core';
import { PencilAltIcon, UndoIcon } from '@patternfly/react-icons';

interface SecretInputProps {
  value: string | undefined;
  id: string;
  name: string;
  placeholder: string;
  validated: React.ComponentProps<typeof TextInput>['validated'];
  ouiaId: string;
  onChange: React.ComponentProps<typeof TextInput>['onChange'];
  onEditBegin: () => void;
  onUndo: () => void;
  hasSecret?: boolean;
  isRequired?: boolean;
}

const SecretInput: React.FC<SecretInputProps> = ({
  value,
  id,
  name,
  placeholder,
  validated,
  ouiaId,
  onChange,
  onEditBegin,
  onUndo,
  hasSecret = false,
  isRequired = false
}) => {
  const { t } = useTranslation();
  const [isModified, setIsModified] = useState(false);

  const canBeChanged = useCallback(() => {
    return !hasSecret || isModified;
  }, [hasSecret, isModified]);

  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          value={value}
          id={id}
          name={name}
          validated={validated}
          isRequired={isRequired}
          ouiaId={ouiaId}
          type={canBeChanged() ? 'password' : 'text'}
          isDisabled={!canBeChanged()}
          placeholder={canBeChanged() ? placeholder : t('secret-input.filled_placeholder')}
          onChange={onChange}
        />
      </InputGroupItem>
      {hasSecret && (
        <InputGroupItem>
          {(isModified && (
            <Button
              variant="control"
              icon={<UndoIcon />}
              onClick={() => {
                onUndo();
                setIsModified(!isModified);
              }}
              ouiaId="secret-undo"
            />
          )) || (
            <Button
              variant="control"
              icon={<PencilAltIcon />}
              onClick={() => {
                onEditBegin();
                setIsModified(!isModified);
              }}
              ouiaId="secret-edit"
            />
          )}
        </InputGroupItem>
      )}
    </InputGroup>
  );
};

export { SecretInput as default, SecretInput, type SecretInputProps };
