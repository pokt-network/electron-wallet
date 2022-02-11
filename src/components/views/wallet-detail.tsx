import React, { useContext, useEffect, useState } from 'react';
import { Sidebar } from '../ui/sidebar';
import { MainHeader, MainHeaderTitle } from '../ui/main-header';
import { FlexColumn, FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { MainBody } from '../ui/main-body';
import { localizeContext } from '../../hooks/localize-hook';
import { ButtonPrimary, ButtonSecondary, TextButton } from '../ui/button';
import { Header1, Header5 } from '../ui/header';
import { APIContext } from '../../hooks/api-hook';
import { links } from '../../constants';
import { WalletControllerContext } from '../../hooks/wallet-hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import pocketLogo from '../../images/pocket-logo.svg';
import * as math from 'mathjs';
import { BigNumber } from 'mathjs';
import { PricingContext } from '../../hooks/pricing-hook';
import { BodyText1, BodyText2, BodyText3 } from '../ui/text';
import { Card } from '../ui/card';
import ellipse from '../../images/icons/ellipse.svg';
import { Switcher } from '../ui/switcher';
import { TransactionTable } from '../ui/transactions-table';
import { TextInput } from '@pokt-foundation/ui';
import { AppHeader } from "../ui/app-header";

export const WalletDetail = () => {

  const [ showSend, setShowSend ] = useState(false);
  const [ switcherIdx, setSwitcherIdx ] = useState(0);
  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const walletController = useContext(WalletControllerContext);
  const pricing = useContext(PricingContext);
  const {
    wallets,
    selectedWallet,
  } = useSelector(({ appState }: RootState) => appState);

  useEffect(() => {
    setSwitcherIdx(0);
    setShowSend(false);
  }, [selectedWallet]);

  const wallet = wallets.find(w => w.address === selectedWallet);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    balanceContainer: {
      marginTop: 8,
    },
    convertedBalanceContainer: {
      marginLeft: 55,
      marginTop: 8,
    },
    totalBalanceHeader: {
      marginLeft: 12,
    },
    card: {
      marginTop: 35,
      marginBottom: 32,
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 24,
      paddingBottom: 24,
    },
    cardItem: {
      gap: 16,
    },
    spacer: {
      flexGrow: 1,
    },
    sendButton: {
      marginRight: 32,
    },
    infoContainer: {
      paddingLeft: 32,
      paddingRight: 32,
    },
    infoHeader: {
      marginBottom: 10,
      color: '#1D8AED',
    },
    input: {
      flexGrow: 1,
      borderWidth: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fafafa',
      marginRight: 60,
    },
    infoButton: {},
    publicKeyHeader: {
      marginTop: 19,
    },
    sendContainer: {
      marginTop: 35,
      // width: 400,
      // maxWidth: '90%',
    },
    sendInput: {
      width: 600,
    },
  };
  const balance = math.divide(math.bignumber(wallet?.balance || 0), math.bignumber(1000000)) as BigNumber;
  const convertedBalance = pricing.convert(balance, 'USD');

  const onSwitcherChange = (idx: number) => {
    setSwitcherIdx(idx);
  };
  const onSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit!');
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={showSend ? localize.text('Send from {{name}}', 'walletDetail', {name: wallet?.name}) : (wallet?.name || '')} />
        <MainBody>
          <FlexRow style={{visibility: 'hidden'} as React.CSSProperties} justifyContent={'flex-start'}>
            <BodyText2>{localize.text('Wallet Balance', 'walletOverview')}</BodyText2>
          </FlexRow>
          <FlexRow style={styles.balanceContainer} justifyContent={'flex-start'}>
            <img alt={localize.text('Pocket logo', 'universal')} src={pocketLogo} />
            <Header1 style={styles.totalBalanceHeader}>{`${localize.number(Number(balance), {useGrouping: true})} POKT`}</Header1>
            <div style={styles.spacer} />
            {showSend ? null : <ButtonPrimary style={styles.sendButton} onClick={() => setShowSend(true)}>{localize.text('Send', 'universal')}</ButtonPrimary>}
          </FlexRow>
          <FlexRow style={styles.convertedBalanceContainer} justifyContent={'flex-start'}>
            <BodyText1>{`$${localize.number(Number(convertedBalance), {useGrouping: true})} USD`}</BodyText1>
          </FlexRow>
          {!showSend ?
            <div>
              <Card round={true} style={styles.card}>
                <FlexRow justifyContent={'space-between'}>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Account Type', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <BodyText1><strong>{localize.text('Node', 'universal')}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Status', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <BodyText1><strong>{'Not Staked'}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Staked POKT', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <BodyText1><strong>{0}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Jail Status', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <BodyText1><strong>{'Not Jailed'}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn justifyContent={'center'}>
                    <ButtonSecondary>{localize.text('Unjail', 'walletOverview')}</ButtonSecondary>
                  </FlexColumn>
                </FlexRow>
              </Card>
              <Switcher labels={[localize.text('Account Info', 'walletDetail'), localize.text('Transaction History', 'walletDetail')]} selected={switcherIdx} onChange={onSwitcherChange} />
              {switcherIdx === 0 ?
                <div style={styles.infoContainer}>
                  <Header5 style={styles.infoHeader}>{localize.text('Address', 'universal')}</Header5>
                  <FlexRow justifyContent={'flex-start'}>
                    <TextInput style={styles.input} type={'text'} value={wallet?.address} readOnly={true} />
                    <ButtonSecondary style={styles.infoButton} onClick={()=>{}}>{localize.text('Download Key File', 'walletDetail')}</ButtonSecondary>
                  </FlexRow>
                  <Header5 style={{...styles.infoHeader, ...styles.publicKeyHeader}}>{localize.text('Public Key', 'universal')}</Header5>
                  <FlexRow justifyContent={'flex-start'}>
                    <TextInput style={styles.input} type={'text'} value={wallet?.publicKey} readOnly={true} />
                    <ButtonSecondary style={styles.infoButton} onClick={()=>{}}>{localize.text('Reveal Private Key', 'walletDetail')}</ButtonSecondary>
                  </FlexRow>
                </div>
                :
                null
              }
              {switcherIdx === 1 ? <TransactionTable wallets={wallet ? [wallet] : []} /> : null}
            </div>
            :
            <form style={styles.sendContainer} onSubmit={onSendSubmit}>
              <TextInput style={styles.sendInput} type={'text'} placeholder={localize.text('Amount', 'walletSend')} wide={true} autofocus={true} required={true} />
              <TextInput style={{...styles.sendInput, marginTop: 32}} type={'text'} placeholder={localize.text('Send to Address', 'walletSend')} wide={true} required={true} />
              <ButtonPrimary type={'submit'} style={{marginTop: 32}}>{localize.text('Send', 'univeral')}</ButtonPrimary>
            </form>
          }
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
}
