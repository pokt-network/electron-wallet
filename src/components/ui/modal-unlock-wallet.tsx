import { Header4 } from './header';
import React, { useContext, useEffect, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { InputErrorMessage } from './input-error';
import { InputRightButton } from './input-adornment';

interface ModalUnlockWalletProps {
  errorMessage?: string
  onClose: ()=>void
  onSubmit: (password: string)=>void
}

export const ModalUnlockWallet = ({ errorMessage: errorMessageProp = '', onClose, onSubmit }: ModalUnlockWalletProps) => {

  const localize = useContext(localizeContext);

  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  useEffect(() => {
    setErrorMessage(errorMessageProp);
  }, [errorMessageProp]);

  const styles = {
    header: {
      color: '#fafafa',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 26.4,
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
    },
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!password) {
      return setErrorMessage(localize.text('You must enter a password', 'modalUnlock'));
    }
    onSubmit(password);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      <div>
        <Header4>{localize.text('Unlock Your Wallet', 'modalUnlock')}</Header4>
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
                     placeholder={localize.text('Wallet Password', 'modalUnlock')} />
          {errorMessage ?
            <InputErrorMessage message={errorMessage} style={styles.errorMessage} />
            :
            null
          }
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Unlock', 'modalUnlock')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
