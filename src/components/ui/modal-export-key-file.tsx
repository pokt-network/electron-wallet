import { Header4 } from './header';
import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { BodyText1 } from "./text";
import { InputErrorMessage } from './input-error';
import { InputRightButton } from './input-adornment';

interface ModalExportKeyFileProps {
  onClose: ()=>void
  onSubmit: (password: string)=>void
}

export const ModalExportKeyFile = ({ onClose, onSubmit }: ModalExportKeyFileProps) => {

  const localize = useContext(localizeContext);

  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  const styles = {
    header: {
      color: '#fafafa',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 26.4,
    },
    textContainer: {
      marginTop: 16,
    },
    form: {
      paddingTop: 12,
    },
    submitButton: {
      marginTop: 36,
    },
    errorMessage: {
      marginTop: 10,
      marginBottom: -32,
    }
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!password.trim()) {
      return setErrorMessage(localize.text('You must enter a password', 'modalExportKeyFile'));
    }
    onSubmit(password);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal onClose={handleClose} shape={'square'}>
      <div>
        <Header4>{localize.text('Download Key File', 'modalExportKeyFile')}</Header4>
        <div style={styles.textContainer}>
          <BodyText1>{localize.text('Please enter an encryption password to protect the new key file. Be careful not to forget the password, because you will need it if you ever use or import the new key file.', 'modalExportKeyFile')}</BodyText1>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <TextInput type={showPassword ? 'text' : 'password'}
                     wide={true}
                     value={password}
                     adornment={<InputRightButton icon={showPassword ? 'eyeOff' : 'eyeOn'} onClick={() => setShowPassword(!showPassword)} />}
                     adornmentPosition={'end'}
                     adornmentSettings={{
                       width: 52,
                       padding: 0,
                     }}
                     autofocus={true}
                     onChange={onPasswordChange}
                     placeholder={localize.text('Key File Password', 'modalExportKeyFile')} />
          {errorMessage ?
            <InputErrorMessage message={errorMessage} style={styles.errorMessage} />
            :
            null
          }
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Save Key File', 'modalExportKeyFile')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
