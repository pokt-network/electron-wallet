import React, { useContext, useEffect, useState } from 'react';
import { FlexRow } from "../ui/flex";
import { Sidebar } from "../ui/sidebar";
import { MainContainer } from "../ui/main-container";
import { AppHeader } from "../ui/app-header";
import { MainBody } from "../ui/main-body";
import { localizeContext } from "../../hooks/localize-hook";
import { BodyText1 } from "../ui/text";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTheme } from "@pokt-foundation/ui";
import { WalletControllerContext } from "../../hooks/wallet-hook";
import { Transaction } from "@pokt-network/pocket-js";
import { TextButton } from '../ui/button';
import { Icon } from '../ui/icon';
import { APIContext } from '../../hooks/api-hook';
import { BlockDate } from '../ui/block-date';

const CopyButton = ({ style, onClick }: {style?: any, onClick: ()=>void}) => {
  return (
    <TextButton style={ style ? style : {}} onClick={onClick}>
      <FlexRow justifyContent={'center'} alignItems={'center'}>
        <Icon name={'copyBlue'} />
      </FlexRow>
    </TextButton>
  );
}

export const TransactionSummary = () => {

  const theme = useTheme();
  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const walletController = useContext(WalletControllerContext);
  const [ transaction, setTransaction ] = useState<Transaction|null>(null);

  const {
    selectedTransaction,
  } = useSelector(({ appState }: RootState) => appState);

  useEffect(() => {
    walletController?.getTransaction(selectedTransaction)
      .then(t => {
        setTransaction(t);
      })
      .catch(console.error);
  }, [walletController, selectedTransaction]);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    row: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    col1: {
      width: 240,
      minWidth: 240,
    },
    col2: {},
    copyButton: {
      marginLeft: 10,
    }
  };

  const amount = transaction?.stdTx.msg.value.amount || transaction?.stdTx.msg.value.value || 0;

  console.log('transaction', transaction, transaction?.txResult?.messageType);

  const type: string|undefined = transaction?.txResult?.messageType;
  const preppedType = !type ? '' : type
    .replace(/_/g, ' ')
    .split(/\s+/)
    .map(s => {
      if(s.length > 0) {
        return s[0].toUpperCase() + s.slice(1);
      } else {
        return s;
      }
    })
    .join(' ');

  const onCopy = (value: string) => {
    api.copyToClipboard(value);
  };

  const height = transaction?.height;
  const fromAddress = transaction?.stdTx.msg.value.from_address;
  const toAddress = transaction?.stdTx.msg.value.to_address;

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Transaction Summary', 'transactionSummary')} />
        <MainBody>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Transaction Hash', 'transactionSummary')}</BodyText1>
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{selectedTransaction}</BodyText1>
            <CopyButton style={styles.copyButton} onClick={() => onCopy(selectedTransaction)} />
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Transaction Type', 'transactionSummary')}</BodyText1>
            <BodyText1 style={styles.col2}>{preppedType}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Timestamp', 'transactionSummary')}</BodyText1>
            <BodyText1 style={styles.col2}>
              <BlockDate blockHeight={height ? height.toString(10) : ''} dateType={'localeString'} includeFromNow={true} />
            </BodyText1>
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Amount', 'transactionSummary')}</BodyText1>
            <BodyText1 style={styles.col2}>{transaction ? localize.number(amount / 1000000, {useGrouping: true}) + ' POKT' : ''}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Transaction Fee', 'transactionSummary')}</BodyText1>
            <BodyText1 style={styles.col2}>{transaction ? localize.number(Number(transaction?.stdTx.fee.amount || '0') / 1000000, {useGrouping: true}) + ' POKT' : ''}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Sender', 'transactionSummary')}</BodyText1>
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{fromAddress}</BodyText1>
            {fromAddress ? <CopyButton style={styles.copyButton} onClick={() => onCopy(fromAddress)} /> : null}
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Recipient', 'transactionSummary')}</BodyText1>
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{toAddress}</BodyText1>
            {toAddress ? <CopyButton style={styles.copyButton} onClick={() => onCopy(toAddress)} /> : null}
          </FlexRow>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
};
