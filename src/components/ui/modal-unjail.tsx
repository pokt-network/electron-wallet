import { Header4 } from './header';
import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { BodyText1 } from "./text";

interface ModalUnjailProps {
  onClose: ()=>void
  onSubmit: ()=>void
}

export const ModalUnjail = ({ onClose, onSubmit }: ModalUnjailProps) => {

  const localize = useContext(localizeContext);

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
    transactionCost: {
      fontSize: 18,
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit!');
    onSubmit();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal onClose={handleClose}>
      <div>
        <Header4>{localize.text('Unjail Transaction', 'modalUnjail')}</Header4>
        <div style={styles.textContainer}>
          <BodyText1>{localize.text('You are about to send a transaction to unjail your account', 'modalUnjail')}</BodyText1>
        </div>
        <div style={styles.textContainer}>
          <BodyText1 style={styles.transactionCost}>{localize.text('Transaction Cost 0.01 POKT', 'modalUnjail')}</BodyText1>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Unjail', 'modalUnjail')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
