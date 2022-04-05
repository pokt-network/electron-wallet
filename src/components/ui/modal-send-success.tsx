import { Header4 } from './header';
import React, { useContext } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { ButtonPrimary, TextButton } from './button';
import { FlexRow } from './flex';
import { BodyText1 } from "./text";
import { TRANSACTION_FEE } from '../../constants';
import { Icon } from './icon';
import { APIContext } from '../../hooks/api-hook';

interface ModalSendSuccessProps {
  txid: string
  fee: string
  amount: string
  from: string
  to: string
  onClose: ()=>void
}

export const ModalSendSuccess = ({ amount, fee, from, to, txid, onClose }: ModalSendSuccessProps) => {

  const api = useContext(APIContext);
  const localize = useContext(localizeContext);

  const styles = {
    textContainer: {
      marginTop: 16,
    },
    form: {
      paddingTop: 12,
    },
    submitButton: {
      marginTop: 36,
    },
    col1: {
      width: 100,
      minWidth: 100,
    },
    infoRow: {
      height: 30,
    },
    copyButton: {
      marginLeft: 8,
    },
    poktTicker: {
      opacity: .5,
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const onCopyTxClick = () => {
    api.copyToClipboard(txid);
  }

  return (
    <Modal shape={'square'} onClose={handleClose}>
      <div>
        <Header4>{localize.text('Transaction Successfully Submitted', 'modalSendSuccess')}</Header4>
        <div style={styles.textContainer}>
          <FlexRow style={styles.infoRow} alignItems={'center'} justifyContent={'flex-start'} wrap={'nowrap'}>
            <BodyText1 style={styles.col1}>{localize.text('From:', 'modalSendSuccess')}</BodyText1>
            <BodyText1>{from}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.infoRow} alignItems={'center'} justifyContent={'flex-start'} wrap={'nowrap'}>
            <BodyText1 style={styles.col1}>{localize.text('To:', 'modalSendSuccess')}</BodyText1>
            <BodyText1>{to}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.infoRow} alignItems={'center'} justifyContent={'flex-start'} wrap={'nowrap'}>
            <BodyText1 style={styles.col1}>{localize.text('Amount:', 'modalSendSuccess')}</BodyText1>
            <BodyText1>{localize.number(Number(amount))} <span style={styles.poktTicker}>POKT</span></BodyText1>
          </FlexRow>
          <FlexRow style={styles.infoRow} alignItems={'center'} justifyContent={'flex-start'} wrap={'nowrap'}>
            <BodyText1 style={styles.col1}>{localize.text('Fee:', 'modalSendSuccess')}</BodyText1>
            <BodyText1>{localize.number(Number(fee))} <span style={styles.poktTicker}>POKT</span></BodyText1>
          </FlexRow>
          <FlexRow style={styles.infoRow} alignItems={'center'} justifyContent={'flex-start'} wrap={'nowrap'}>
            <BodyText1 style={styles.col1}>{localize.text('TXID:', 'modalSendSuccess')}</BodyText1>
            <BodyText1>{txid.slice(0, 16)}...{txid.slice(-16)}</BodyText1>
            <TextButton style={styles.copyButton} onClick={onCopyTxClick}>
              <Icon name={'copyBlue'} />
            </TextButton>
          </FlexRow>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Close', 'universal')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
