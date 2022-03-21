import { Header4 } from './header';
import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { useDispatch } from 'react-redux';
import { setShowCreateModal } from '../../reducers/app-reducer';
import { WalletControllerContext } from '../../hooks/wallet-hook';
import { masterPasswordContext } from "../../hooks/master-password-hook";
import { InputErrorMessage } from './input-error';

interface ModalCreateWalletProps {}

export const ModalCreateWallet = ({}: ModalCreateWalletProps) => {

  const dispatch = useDispatch();
  const localize = useContext(localizeContext);
  const walletController = useContext(WalletControllerContext);
  const { masterPassword } = useContext(masterPasswordContext);

  const [ name, setName ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

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

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const password = masterPassword?.get();
    const trimmedName = name.trim();
    if(!trimmedName) {
      return setErrorMessage(localize.text('You must enter a name', 'modalCreate'));
    }
    walletController?.createWallet(trimmedName, password);
    dispatch(setShowCreateModal({show: false}));
  };

  const onClose = () => {
    dispatch(setShowCreateModal({show: false}));
  };

  return (
    <Modal onClose={onClose} shape={'triangle'}>
      <div>
        <Header4>{localize.text('Account Name', 'modalCreate')}</Header4>
        <form style={styles.form} onSubmit={onSubmit}>
          <TextInput type={'text'} wide={true} value={name} autofocus={true} onChange={onNameChange} placeholder={localize.text('My new POKT account', 'modalCreate')} />
          {errorMessage ?
            <InputErrorMessage message={errorMessage} style={styles.errorMessage} />
            :
            null
          }
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Create', 'modalCreate')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
