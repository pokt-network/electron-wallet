import { Header4 } from './header';
import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';

interface ModalUnlockWalletProps {
  onClose: ()=>void
  onSubmit: (password: string)=>void
}

export const ModalUnlockWallet = ({ onClose, onSubmit }: ModalUnlockWalletProps) => {

  const localize = useContext(localizeContext);

  const [ password, setPassword ] = useState('');

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
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <TextInput type={'password'} wide={true} required={true} value={password} autofocus={true} onChange={onPasswordChange} placeholder={localize.text('Wallet Password', 'modalUnlock')} />
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Unlock', 'modalUnlock')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
