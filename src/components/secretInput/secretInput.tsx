/**
 * Component to work with secrets, including optional secrets.
 * By default it shows as standard <TextInput> with placeholder and type password (so value is masked).
 * On Edit modal, it shows as disabled input with placeholder. There's icon that allows you to enable input
 * and provide new value. There's also an option to undo editing.
 *
 * @module secretInput
 */
import React, { useState } from 'react';
import { Button, InputGroup, InputGroupItem, TextInput } from '@patternfly/react-core';
import { PenAltIcon, UndoIcon } from '@patternfly/react-icons';

interface SecretInputProps {
  value: string | undefined;
  id: string;
  name: string;
  placeholder: string;
  validated: 'default' | 'success' | 'warning' | 'error' | undefined; // FIXME
  ouiaId: string;
  onChange: Function;
  onEditBegin: Function;
  onUndo: Function;
  hasSecret?: boolean;
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
  hasSecret
}) => {
  const [isModified, setIsModified] = useState(false);

  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          value={value}
          name={name}
          id={id}
          validated={validated}
          ouiaId={ouiaId}
          type={hasSecret && !isModified ? 'text' : 'password'}
          isDisabled={hasSecret && !isModified}
          placeholder={hasSecret && !isModified ? '<SECRET VALUE>' : placeholder}
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
            />
          )) || (
            <Button
              variant="control"
              icon={<PenAltIcon />}
              onClick={() => {
                onEditBegin();
                setIsModified(!isModified);
              }}
            />
          )}
        </InputGroupItem>
      )}
    </InputGroup>
  );
};

export { SecretInput as default, SecretInput, type SecretInputProps };
