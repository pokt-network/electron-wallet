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

export const TransactionSummary = () => {

  const theme = useTheme();
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
    col2: {
      flexGrow: 1,
    }
  };

  const amount = transaction?.stdTx.msg.value.amount || transaction?.stdTx.msg.value.value || 0;

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Transaction Summary', 'transactionSummary')} />
        <MainBody>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Transaction Hash', 'transactionSummary')}</BodyText1>
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{selectedTransaction}</BodyText1>
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
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{transaction?.stdTx.msg.value.from_address}</BodyText1>
          </FlexRow>
          <FlexRow style={styles.row} justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'}>
            <BodyText1 style={styles.col1}>{localize.text('Recipient', 'transactionSummary')}</BodyText1>
            <BodyText1 style={{...styles.col2, color: theme.accent}}>{transaction?.stdTx.msg.value.to_address}</BodyText1>
          </FlexRow>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
};
