import { Header4 } from './header';
import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { BodyText1 } from "./text";
import { TRANSACTION_FEE } from "../../constants";

interface ModalUnstakeProps {
  onClose: ()=>void
  onSubmit: (password: string)=>void
}

export const ModalUnstake = ({ onClose, onSubmit }: ModalUnstakeProps) => {

  const localize = useContext(localizeContext);

  const [ password, setPassword ] = useState('');

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
      paddingTop: 22,
    },
    submitButton: {
      marginTop: 36,
    },
    transactionCost: {
      fontSize: 18,
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
        <Header4>{localize.text('Unstake Transaction', 'modalUnstake')}</Header4>
        <div style={styles.textContainer}>
          <BodyText1>{localize.text('You are about to send a transaction to unstake your account, please submit your wallet password to confirm.', 'modalUnstake')}</BodyText1>
        </div>
        <div style={styles.textContainer}>
          <BodyText1 style={styles.transactionCost}>{localize.text('Transaction Cost {{fee}} POKT', 'modalUnstake', {fee: TRANSACTION_FEE})}</BodyText1>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <TextInput type={'password'} wide={true} required={true} value={password} autofocus={true} onChange={onPasswordChange} placeholder={localize.text('Wallet Password', 'modalUnlock')} />
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Unstake', 'modalUnstake')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
