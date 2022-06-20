import React, { useContext, useState } from 'react';
import { Sidebar } from "../ui/sidebar";
import { AppHeader } from "../ui/app-header";
import { localizeContext } from "../../hooks/localize-hook";
import { FlexRow } from "../ui/flex";
import { MainContainer } from "../ui/main-container";
import { MainBody } from "../ui/main-body";
import { Header4 } from '../ui/header';
import { TextInput, useTheme } from "@pokt-foundation/ui";
import { BodyText1 } from "../ui/text";
import { ButtonPrimary } from "../ui/button";
import { WalletControllerContext } from "../../hooks/wallet-hook";
import { setActiveView, setSelectedWallet } from "../../reducers/app-reducer";
import { activeViews } from "../../constants";
import { useDispatch } from "react-redux";
import { InputErrorMessage } from '../ui/input-error';

export const WatchAccount = () => {

  const [ accountName, setAccountName ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ importError, setImportError ] = useState('');

  const dispatch = useDispatch();
  const localize = useContext(localizeContext);
  const theme = useTheme();
  const walletController = useContext(WalletControllerContext);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    heading: {
      marginBottom: 7,
      color: theme.accentAlternative,
    },
    subheading: {
    },
    formContainer: {
      marginTop: 26,
      display: 'block',
      width: 808,
      maxWidth: '100%',
    },
    form: {
      display: 'block',
      width: '100%',
    },
    nameInput: {
      marginTop: 0,
    },
    addressHeading: {
      marginTop: 30,
      color: theme.accentAlternative,
    },
    addressInput: {
      marginTop: 20
    },
    submitButton: {
      marginTop: 50,
    },
    errorMessage: {
      marginTop: 10,
      marginBottom: -32,
    },
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit!', accountName, address);
    const preppedName = accountName.trim();
    const preppedAddress = address.trim();
    if(!preppedName || !preppedAddress)
      return;
    if(walletController) {
      if(walletController.getWallets().some(w => w.address === preppedAddress)) {
        setImportError(localize.text('Duplicate account. You cannot import the same account twice.', 'watchAccount'));
      } else {
        walletController
          .importWatchAccount(preppedName, preppedAddress)
          .then(() => {
            setTimeout(() => {
              const wallets = walletController.getWallets();
              const wallet = wallets.find(w => w.address === preppedAddress);
              if(wallet) {
                dispatch(setSelectedWallet({address: wallet.address}))
                dispatch(setActiveView({activeView: activeViews.WALLET_DETAIL}));
              }
            }, 500);
          })
          .catch(console.error);
      }
    }
  };

  const onAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAccountName(e.target.value);
  };
  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Watch Account', 'watchAccount')} />
        <MainBody>
          <Header4 style={styles.heading}>
            {localize.text('Add a Watched Account', 'watchAccount')}
          </Header4>
          <BodyText1 style={styles.subheading}>
            {localize.text("This feature allows you to monitor your account's balance and transactions without needing to import the account keys.", 'watchAccount')}
          </BodyText1>
          <div style={styles.formContainer}>
            <form style={styles.form} onSubmit={onSubmit}>
              <TextInput style={styles.nameInput} placeholder={localize.text('Account Name', 'watchAccount')} type={'text'} wide={true} value={accountName} onChange={onAccountNameChange} required={true} autofocus={true} />
              <Header4 style={styles.addressHeading}>
                {localize.text('Address', 'watchAccount')}
              </Header4>
              <TextInput style={styles.addressInput} placeholder={localize.text('Address', 'universal')} type={'text'} wide={true} value={address} onChange={onAddressChange} required={true} />
              {importError ?
                <InputErrorMessage style={styles.errorMessage} message={importError}/>
                :
                null
              }
              <ButtonPrimary style={styles.submitButton} type={'submit'}>{localize.text('Save Account', 'watchAccount')}</ButtonPrimary>
            </form>
          </div>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
};
