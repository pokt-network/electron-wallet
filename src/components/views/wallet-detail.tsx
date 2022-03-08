import React, { useContext, useEffect, useState } from 'react';
import { Sidebar } from '../ui/sidebar';
import { FlexColumn, FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { MainBody } from '../ui/main-body';
import { localizeContext } from '../../hooks/localize-hook';
import { ButtonPrimary, ButtonSecondary, TextButton } from '../ui/button';
import { Header1, Header5 } from '../ui/header';
import { APIContext } from '../../hooks/api-hook';
import { accountStatus, accountTypes, activeViews, TRANSACTION_FEE } from '../../constants';
import { WalletControllerContext } from '../../hooks/wallet-hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import pocketLogo from '../../images/pocket-logo.svg';
import * as math from 'mathjs';
import { bignumber, BigNumber } from 'mathjs';
import { PricingContext } from '../../hooks/pricing-hook';
import { BodyText1, BodyText2, BodyText3 } from '../ui/text';
import { Card } from '../ui/card';
import { Switcher } from '../ui/switcher';
import { TransactionTable } from '../ui/transactions-table';
import { TextInput, useTheme } from '@pokt-foundation/ui';
import { AppHeader } from "../ui/app-header";
import { setActiveView, setShowPrivateKeyModal } from "../../reducers/app-reducer";
import { masterPasswordContext } from "../../hooks/master-password-hook";
import { ModalPrivateKey } from "../ui/modal-private-key";
import { ModalUnlockWallet } from "../ui/modal-unlock-wallet";
import { ModalExportKeyFile } from "../ui/modal-export-key-file";
import { ModalUnjail } from "../ui/modal-unjail";
import { ModalConfirm } from "../ui/modal-confirm";
import { Icon } from "../ui/icon";
import { ModalUnstake } from "../ui/modal-unstake-wallet";
import { Toggle } from "../ui/toggle";
import { AddressControllerContext } from "../../hooks/address-hook";

export const WalletDetail = () => {

  const [ sendAmount, setSendAmount ] = useState('');
  const [ sendAddress, setSendAddress ] = useState('');
  const [ sendMemo, setSendMemo ] = useState('');
  const [ privateKey, setPrivateKey ] = useState('');
  const [ showSend, setShowSend ] = useState(false);
  const [ switcherIdx, setSwitcherIdx ] = useState(0);
  const [ showUnlockForKeyFileModal, setShowUnlockForKeyFileModal ] = useState(false);
  const [ showUnlockForPrivateKeyModal, setShowUnlockForPrivateKeyModal ] = useState(false);
  const [ showSaveKeyFileModal, setShowSaveKeyFileModal ] = useState(false);
  const [ showUnjailModal, setShowUnjailModal ] = useState(false);
  const [ showRemoveModal, setShowRemoveModal ] = useState(false);
  const [ showUnstakeModal, setShowUnstakeModal ] = useState(false);
  const [ saveAddressEnabled, setSaveAddressEnabled ] = useState(false);
  const [ saveAddressLabel, setSaveAddressLabel ] = useState('');
  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const walletController = useContext(WalletControllerContext);
  const addressController = useContext(AddressControllerContext);
  const pricing = useContext(PricingContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { masterPassword } = useContext(masterPasswordContext);
  const {
    wallets,
    selectedWallet,
    showPrivateKeyModal,
  } = useSelector(({ appState }: RootState) => appState);

  useEffect(() => {
    if(!showPrivateKeyModal)
      setPrivateKey('');
  }, [showPrivateKeyModal]);

  useEffect(() => {
    setSwitcherIdx(0);
    setShowSend(false);
    setSaveAddressEnabled(false);
    setSaveAddressLabel('');
    setSendAmount('');
    setSendAddress('');
    setSendMemo('');
    setPrivateKey('');
  }, [selectedWallet]);

  const wallet = wallets.find(w => w.address === selectedWallet);

  useEffect(() => {
    wallet?.updateTransactions()
      .catch(console.error);
    wallet?.updateAccountInfo()
      .catch(console.error);
  }, [selectedWallet, wallet]);

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
    removeButton: {
      marginTop: 30,
      color: theme.accent,
    },
    removeButtonText: {
      color: theme.accent,
    },
    sendFeeContainer: {
      marginTop: 22,
      marginBottom: 22,
    },
    watchOnlyCard: {
      marginRight: 32,
    },
    watchOnlyFlexRow: {
      paddingTop: 16,
      paddingBottom: 16,
      width: 219,
    },
    watchOnlyText: {
      fontSize: 16,
    },
    accountTypeIcon: {
      marginRight: 12,
    },
    enableSaveAddressRow: {
      paddingTop: 20,
    },
    enableSaveToggle: {
      marginRight: 10,
    },
  };
  const balance = math.divide(math.bignumber(wallet?.balance || 0), math.bignumber(1000000)) as BigNumber;
  const convertedBalance = pricing.convert(balance, 'USD');

  const onSwitcherChange = (idx: number) => {
    setSwitcherIdx(idx);
  };
  const onSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(sendAmount);
    const password = masterPassword?.get();
    const preppedSendAddress = sendAddress.trim();
    const preppedLabel = saveAddressLabel.trim();
    if(!preppedSendAddress)
      return;
    if(saveAddressEnabled && !preppedLabel)
      return;
    if(amount > 0 && wallet && walletController && password) {
      walletController.sendTransaction(
        wallet.address,
        sendAmount,
        preppedSendAddress,
        sendMemo,
        password,
      )
        .then(tx => {
          setShowSend(false);
          setSendAmount('');
          setSendAddress('');
          setSendMemo('');
          setSaveAddressEnabled(false);
          setSaveAddressLabel('');
          if(saveAddressEnabled)
            addressController?.createAddress(preppedLabel, preppedSendAddress);
        })
        .catch(console.error);
    }
  };
  const onSaveKeyFileClick = () => {
    setShowUnlockForKeyFileModal(true);
  };
  const onRevealPrivateKeyClick = () => {
    setShowUnlockForPrivateKeyModal(true);
  };
  const onRemoveWallet = () => {
    setShowRemoveModal(true);
  };
  const onSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSendAmount(e.target.value.trim().replace(/[^\d,.]/g, ''));
  };
  const onSendAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSendAddress(e.target.value.trim());
  };
  const onSendMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSendMemo(e.target.value);
  };
  const onSaveAddressLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSaveAddressLabel(e.target.value);
  };
  const onUnstakeClick = () => {
    setShowUnstakeModal(true);
  };
  const onUnstakeModalClose = () => {
    setShowUnstakeModal(false);
  };
  const onUnstakeModalSubmit = (password: string) => {
    if(wallet && walletController && password) {
      walletController.sendUnstakeTransaction(
        wallet.address,
        password,
      )
        .then(tx => {
          if(tx)
            setShowUnstakeModal(false);
        })
        .catch(console.error);
    }
  };
  const onUnlockForKeyFileClose = () => {
    setShowUnlockForKeyFileModal(false);
  };
  const onUnlockForKeyFileSubmit = (password: string) => {
    setShowUnlockForKeyFileModal(false);
    if(wallet && walletController) {
      walletController.getRawPrivateKeyFromWallet(wallet.address, password)
        .then(keyStr => {
          if(keyStr) {
            setPrivateKey(keyStr);
            setShowSaveKeyFileModal(true);
          }
        })
        .catch(console.error);
    }
  };
  const onUnlockForPrivateKeyModalClose = () => {
    setShowUnlockForPrivateKeyModal(false);
  };
  const onUnlockForPrivateKeyModalSubmit = (password: string) => {
    setShowUnlockForPrivateKeyModal(false);
    if(wallet && walletController) {
      walletController.getRawPrivateKeyFromWallet(wallet.address, password)
        .then(keyStr => {
          if(keyStr) {
            setPrivateKey(keyStr);
            dispatch(setShowPrivateKeyModal({show: true}));
          }
        })
        .catch(console.error);
    }
  };
  const onSaveKeyFileModalClose = () => {
    setShowSaveKeyFileModal(false);
    setPrivateKey('');
  };
  const onSaveKeyFileModalSubmit = (password: string) => {
    if(wallet && walletController) {
      console.log(password, privateKey);
      walletController.getPPKFromRawKey(privateKey, password)
        .then(ppk => {
          if(ppk) {
            const { name } = wallet;
            const preppedName = name
              .replace(/\s/g, '_')
              .replace(/\W/g, '');
            api.openFileSaveDialog({
              title: 'Save Key File',
              defaultPath: preppedName + '.json',
              filters: [
                {name: 'JSON', extensions: ['json']},
              ],
              properties: []
            })
              .then(({ canceled, filePath }) => {
                if(!canceled && filePath) {
                  api.saveFile(filePath, ppk)
                    .then(() => {
                      setShowSaveKeyFileModal(false);
                      setPrivateKey('');
                    })
                    .catch(console.error);
                }
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  };
  const onUnjailClick = () => {
    setShowUnjailModal(true);
  };
  const onUnjailModalClose = () => {
    setShowUnjailModal(false);
  };
  const onUnjailModalSubmit = () => {
    const password = masterPassword?.get();
    if(wallet && walletController && password) {
      walletController.sendUnjailTransaction(
        wallet.address,
        password,
      )
        .then(tx => {
          setShowUnjailModal(false);
        })
        .catch(console.error);
    }
  };
  const onConfirmRemoveCancel = () => {
    setShowRemoveModal(false);
  };
  const onConfirmRemoveConfirm = async () => {
    setShowRemoveModal(false);
    if(wallet && walletController) {
      setShowRemoveModal(true);
      const success = walletController.deleteWallet(wallet.address);
      if (success)
        dispatch(setActiveView({activeView: activeViews.WALLET_OVERVIEW}));
    }
  };

  const stakedAmountUpokt = wallet ? wallet.stakedAmount : bignumber(0);
  const stakedAmount = math.divide(stakedAmountUpokt, bignumber(1000000)).toString();

  const watchOnly = wallet?.watchOnly || false;

  const accountType = wallet?.accountType;

  const typeIcon = !accountType ?
    null
    :
    accountType === accountTypes.NODE ?
      <Icon name={'node'} style={styles.accountTypeIcon} />
      :
      accountType === accountTypes.APP ?
        <Icon name={'ellipse'} style={styles.accountTypeIcon} />
        :
        null;

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
            {(showSend || watchOnly) ? null : <ButtonPrimary style={styles.sendButton} onClick={() => setShowSend(true)}>{localize.text('Send', 'universal')}</ButtonPrimary>}
            {watchOnly ?
              <Card round={true} style={styles.watchOnlyCard}>
                <FlexRow style={styles.watchOnlyFlexRow} justifyContent={'center'}>
                  <Header5 style={styles.watchOnlyText}>{localize.text('Watch Only', 'walletDetail')}</Header5>
                </FlexRow>
              </Card>
              :
              null
            }
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
                      {typeIcon}
                      <BodyText1><strong>{
                        wallet?.accountType === accountTypes.APP ?
                          localize.text('App', 'universal')
                          :
                          wallet?.accountType === accountTypes.NODE ?
                            localize.text('Node', 'universal')
                            :
                            localize.text('Wallet', 'universal')
                      }</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Status', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <Icon name={wallet?.status === accountStatus.STAKED ? 'staked' : wallet?.status === accountStatus.UNSTAKING ? 'unstaking' : 'unstake'} style={styles.accountTypeIcon} />
                      <BodyText1><strong>{wallet?.status === accountStatus.STAKED ? localize.text('Staked', 'walletDetail') : wallet?.status === accountStatus.UNSTAKING ? localize.text('Unstaking', 'walletDetail') : localize.text('Not Staked', 'walletDetail')}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={styles.cardItem}>
                    <BodyText3>{localize.text('Staked POKT', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <Icon name={'stakedTokens'} style={styles.accountTypeIcon} />
                      <BodyText1><strong>{localize.number(Number(stakedAmount), {useGrouping: true})}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn style={{...styles.cardItem, visibility: watchOnly ? 'hidden' : 'visible'}}>
                    <BodyText3>{localize.text('Jail Status', 'walletOverview')}</BodyText3>
                    <FlexRow justifyContent={'flex-start'}>
                      <BodyText1><strong>{wallet?.jailed ? localize.text('Jailed', 'walletDetail') : localize.text('Not Jailed', 'walletDetail')}</strong></BodyText1>
                    </FlexRow>
                  </FlexColumn>
                  <FlexColumn justifyContent={'center'} style={{minWidth: 219, visibility: watchOnly ? 'hidden' : 'visible'}}>
                    {wallet?.accountType === accountTypes.WALLET
                      ?
                      null
                      :
                      wallet?.jailed ?
                        <ButtonSecondary onClick={onUnjailClick} disabled={!wallet?.jailed}>{localize.text('Unjail', 'walletDetail')}</ButtonSecondary>
                        :
                        wallet?.status === accountStatus.STAKED ?
                          <ButtonSecondary onClick={onUnstakeClick}>{localize.text('Unstake', 'walletDetail')}</ButtonSecondary>
                          :
                          null
                    }
                  </FlexColumn>
                </FlexRow>
              </Card>
              <Switcher labels={[localize.text('Account Info', 'walletDetail'), localize.text('Transaction History', 'walletDetail')]} selected={switcherIdx} onChange={onSwitcherChange} />
              {switcherIdx === 0 ?
                <div style={styles.infoContainer}>
                  <Header5 style={styles.infoHeader}>{localize.text('Address', 'universal')}</Header5>
                  <FlexRow justifyContent={'flex-start'}>
                    <TextInput style={styles.input} type={'text'} value={wallet?.address} readOnly={true} />
                    {watchOnly ?
                      <ButtonSecondary style={styles.infoButton}
                                       onClick={onRemoveWallet}>{localize.text('Remove this Account', 'walletDetail')}</ButtonSecondary>
                      :
                      <ButtonSecondary style={styles.infoButton}
                                       onClick={onSaveKeyFileClick}>{localize.text('Download Key File', 'walletDetail')}</ButtonSecondary>
                    }
                  </FlexRow>
                  {!watchOnly ? <Header5 style={{...styles.infoHeader, ...styles.publicKeyHeader}}>{localize.text('Public Key', 'universal')}</Header5> : null}
                  {!watchOnly ?
                    <FlexRow justifyContent={'flex-start'}>
                      <TextInput style={styles.input} type={'text'} value={wallet?.publicKey} readOnly={true}/>
                      <ButtonSecondary style={styles.infoButton}
                                       onClick={onRevealPrivateKeyClick}>{localize.text('Reveal Private Key', 'walletDetail')}</ButtonSecondary>
                    </FlexRow>
                    :
                    null
                  }
                  {!watchOnly ?
                    <TextButton style={styles.removeButton} onClick={onRemoveWallet}>
                      <BodyText2
                        style={styles.removeButtonText}>{localize.text('Remove this account', 'walletDetail')}</BodyText2>
                    </TextButton>
                    :
                    null
                  }
                </div>
                :
                null
              }
              {switcherIdx === 1 ? <TransactionTable wallets={wallet ? [wallet] : []} /> : null}
            </div>
            :
            <form style={styles.sendContainer} onSubmit={onSendSubmit}>
              <TextInput style={styles.sendInput} type={'text'} placeholder={localize.text('Amount in POKT', 'walletSend')} wide={true} value={sendAmount} onChange={onSendAmountChange} autofocus={true} required={true} />
              <TextInput style={{...styles.sendInput, marginTop: 32}} type={'text'} placeholder={localize.text('Send to Address', 'walletSend')} wide={true} value={sendAddress} onChange={onSendAddressChange} required={true} />
              <TextInput style={{...styles.sendInput, marginTop: 32}} type={'text'} placeholder={localize.text('Add a Tx memo', 'walletSend')} wide={true} value={sendMemo} onChange={onSendMemoChange} required={false} />
              <FlexRow style={styles.enableSaveAddressRow} wrap={'nowrap'} justifyContent={'flex-start'} alignItems={'center'}>
                <Toggle style={styles.enableSaveToggle} enabled={saveAddressEnabled} onToggle={enabled => setSaveAddressEnabled(enabled)} />
                <BodyText1>{localize.text('Save to Address Book', 'walletDetail')}</BodyText1>
              </FlexRow>
              {saveAddressEnabled ?
                <TextInput style={{...styles.sendInput, marginTop: 16}} type={'text'}
                           placeholder={localize.text('Enter label of the address', 'walletSend')} wide={true}
                           value={saveAddressLabel} onChange={onSaveAddressLabelChange} required={true} />
                :
                null
              }
              <div style={styles.sendFeeContainer}>
                <BodyText1>{localize.text('Transaction Fee {{fee}} POKT', 'walletSend', {fee: TRANSACTION_FEE})}</BodyText1>
              </div>
              <ButtonPrimary type={'submit'} style={{marginTop: 32}}>{localize.text('Send', 'univeral')}</ButtonPrimary>
            </form>
          }
          {showPrivateKeyModal ?
            <ModalPrivateKey privateKey={privateKey} />
            :
            null
          }
        </MainBody>
      </MainContainer>
      {showUnlockForKeyFileModal ?
        <ModalUnlockWallet onClose={onUnlockForKeyFileClose} onSubmit={onUnlockForKeyFileSubmit} />
        :
        null
      }
      {showUnlockForPrivateKeyModal ?
        <ModalUnlockWallet onClose={onUnlockForPrivateKeyModalClose} onSubmit={onUnlockForPrivateKeyModalSubmit} />
        :
        null
      }
      {showSaveKeyFileModal ?
        <ModalExportKeyFile onClose={onSaveKeyFileModalClose} onSubmit={onSaveKeyFileModalSubmit} />
        :
        null
      }
      {showUnjailModal ?
        <ModalUnjail onClose={onUnjailModalClose} onSubmit={onUnjailModalSubmit} />
        :
        null
      }
      {showUnstakeModal ?
        <ModalUnstake onClose={onUnstakeModalClose} onSubmit={onUnstakeModalSubmit} />
        :
        null
      }
      {showRemoveModal ?
        <ModalConfirm
          title={localize.text('Remove Account', 'walletDetail')}
          text={localize.text('Are you sure you want remove this from your POKT Wallet?', 'walletDetail')}
          confirmButtonText={localize.text('Remove', 'walletDetail')}
          onCancel={onConfirmRemoveCancel}
          onConfirm={onConfirmRemoveConfirm} />
        :
        null
      }
    </FlexRow>
  );
}
