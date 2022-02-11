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

interface ModalCreateWalletProps {}

export const ModalCreateWallet = ({}: ModalCreateWalletProps) => {

  const dispatch = useDispatch();
  const localize = useContext(localizeContext);
  const walletController = useContext(WalletControllerContext);
  const { masterPassword } = useContext(masterPasswordContext);

  const [ name, setName ] = useState('');

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

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit!');
    const password = masterPassword?.get();
    walletController?.createWallet(name, password);
    dispatch(setShowCreateModal({show: false}));
  };

  const onClose = () => {
    dispatch(setShowCreateModal({show: false}));
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <Header4>{localize.text('Account Name', 'modalCreate')}</Header4>
        <form style={styles.form} onSubmit={onSubmit}>
          <TextInput type={'text'} wide={true} required={true} value={name} autofocus={true} onChange={onNameChange} placeholder={localize.text('My new POKT account', 'modalCreate')} />
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Create', 'modalCreate')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
