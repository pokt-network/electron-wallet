import React, { useContext, useState } from 'react';
import { Sidebar } from "../ui/sidebar";
import { AppHeader } from "../ui/app-header";
import { localizeContext } from "../../hooks/localize-hook";
import { FlexRow } from "../ui/flex";
import { MainContainer } from "../ui/main-container";
import { MainBody } from "../ui/main-body";
import { Header4, Header5 } from '../ui/header';
import { TextInput, useTheme } from "@pokt-foundation/ui";
import { BodyText1 } from "../ui/text";
import { ButtonPrimary, TextButton } from "../ui/button";
import { Card } from "../ui/card";
import chevronDown from '../../images/icons/chevron-down.svg';
import chevronUp from '../../images/icons/chevron-up.svg';
import { APIContext } from "../../hooks/api-hook";
import { WalletControllerContext } from "../../hooks/wallet-hook";
import { useDispatch } from "react-redux";
import { setActiveView, setSelectedWallet } from "../../reducers/app-reducer";
import { activeViews } from "../../constants";
import { masterPasswordContext } from "../../hooks/master-password-hook";
import { InputErrorMessage } from '../ui/input-error';

interface CaretButtonProps {
  enabled: boolean
  text: string
  onClick: ()=>void
}

const CaretButton = ({ enabled, text, onClick }: CaretButtonProps) => {

  const localize = useContext(localizeContext);

  const styles = {
    button: {
      display: 'block',
      width: '100%',
    },
    buttonCard: {
      paddingLeft: 55,
      paddingRight: 29,
      width: '100%',
    },
    buttonRow: {
      height: 70,
      width: '100%',
    }
  };

  return (
    <TextButton style={styles.button} onClick={onClick}>
      <Card round={true} style={styles.buttonCard}>
        <FlexRow style={styles.buttonRow} justifyContent={'space-between'} alignItems={'center'}>
          <Header5>{text}</Header5>
          <img alt={enabled ? localize.text('Arrow up icon', 'universal') : localize.text('Arrow down icon', 'universal')} src={enabled ? chevronUp : chevronDown} />
        </FlexRow>
      </Card>
    </TextButton>
  );
};

export const ImportAccount = () => {

  const [ showKeyfile, setShowKeyfile ] = useState(false);
  const [ showKeyText, setShowKeyText ] = useState(false);
  const [ keyFilePath, setKeyFilePath ] = useState('');
  const [ keyFilePassphrase, setKeyFilePassphrase ] = useState('');
  const [ privateKey, setPrivateKey ] = useState('');
  const [ keyFileImportError, setKeyFileImportError ] = useState('');
  const [ privateKeyImportError, setPrivateKeyImportError ] = useState('');

  const dispatch = useDispatch();
  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const theme = useTheme();
  const walletController = useContext(WalletControllerContext);
  const { masterPassword } = useContext(masterPasswordContext);

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
    buttonsContainer: {
      marginTop: 26,
      display: 'block',
      width: 808,
      maxWidth: '100%',
    },
    keyfileButtonContainer: {
      display: 'block',
      width: '100%',
    },
    privateKeyButtonContainer: {
      display: 'block',
      width: '100%',
      marginTop: 40,
    },
    keyFileInputsContainer: {
      marginTop: 50,
      marginLeft: 70,
      marginRight: 70,
    },
    keyfilePassphraseInput: {
      marginTop: 40,
    },
    privateKeyInput: {
      marginTop: 0,
    },
    keyfileFileInput: {
      cursor: 'pointer',
    },
    importKeyfileButton: {
      marginTop: 50,
    },
    errorMessage: {
      marginTop: 10,
      marginBottom: -32,
    },
  };

  const onKeyfileImportClick = () => {
    setShowKeyfile(!showKeyfile);
    setShowKeyText(false);
  };
  const onPrivateKeyImportClick = () => {
    setShowKeyText(!showKeyText);
    setShowKeyfile(false);
  };

  const onKeyFileInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    api.openFileDialog({
      title: localize.text('Select Keyfile', 'importAccount'),
      filters: [
        {name: 'JSON', extensions: ['json']},
        {name: localize.text('All Files', 'universal'), extensions: ['*']},
      ],
      properties: ['openFile'],
    })
      .then(({ canceled, filePaths }) => {
        if(!canceled && filePaths.length > 0)
          setKeyFilePath(filePaths[0]);
        if(keyFileImportError)
          setKeyFileImportError('');
        const keyfilePassphraseInputNode = document.getElementById('js-keyfilePassphraseInput');
        if(keyfilePassphraseInputNode) {
          keyfilePassphraseInputNode.focus();
        }
      })
      .catch(console.error);
  };

  const onImportKeyfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!keyFilePath) {
      return setKeyFileImportError(localize.text('You must select a key file', 'importAccount'));
    }
    const splitKeyFilePath = keyFilePath.split(/[/\\]/g);
    const name = splitKeyFilePath[splitKeyFilePath.length - 1].replace(/\.json$/i, '');
    const keyFileContents = await api.openFile(keyFilePath);
    const password = masterPassword?.get();
    if(walletController && password)
      walletController.importWalletFromPPK(name, keyFileContents, keyFilePassphrase, password)
        .then(res => {
          if(res) {
            setTimeout(() => {
              const wallets = walletController.getWallets();
              const wallet = wallets.find(w => w.address === res);
              if(wallet) {
                dispatch(setSelectedWallet({address: wallet.address}))
                dispatch(setActiveView({activeView: activeViews.WALLET_DETAIL}));
              }
            }, 500);
          } else {
            setKeyFileImportError(localize.text('Incorrect Keyfile or Password', 'importAccount'));
          }
        })
        .catch(console.error);
  };
  const onKeyFilePassphraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKeyFilePassphrase(e.target.value);
  };
  const onPrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPrivateKey(e.target.value);
  };
  const onImportPrivateKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = masterPassword?.get();
    const trimmedPrivateKey = privateKey.trim();
    if(!trimmedPrivateKey) {
      return setPrivateKeyImportError(localize.text('You must enter a private key', 'importAccount'));
    }
    if(walletController && password)
      walletController.importWalletFromRawPrivateKey('', trimmedPrivateKey, password)
        .then(res => {
          console.log('then');
          if(res) {
            setTimeout(() => {
              const wallets = walletController.getWallets();
              const wallet = wallets.find(w => w.address === res);
              if(wallet) {
                dispatch(setSelectedWallet({address: wallet.address}))
                dispatch(setActiveView({activeView: activeViews.WALLET_DETAIL}));
              }
            }, 500);
          }
        })
        .catch(err => {
          setPrivateKeyImportError(localize.text('Incorrect Private Key', 'importAccount'));
          console.error(err);
        });
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Import Account', 'importAccount')} />
        <MainBody>
          <Header4 style={styles.heading}>
            {localize.text('Import your POKT account', 'importAccount')}
          </Header4>
          <BodyText1 style={styles.subheading}>
            {localize.text('Select a method to import your account.', 'importAccount')}
          </BodyText1>
          <div style={styles.buttonsContainer}>
            <div style={styles.keyfileButtonContainer}>
              <CaretButton enabled={showKeyfile} text={localize.text('Keyfile', 'importAccount')} onClick={onKeyfileImportClick} />
            </div>
            {showKeyfile ?
              <form style={styles.keyFileInputsContainer} onSubmit={onImportKeyfileSubmit}>
                <TextInput onClick={onKeyFileInputClick} style={styles.keyfileFileInput} placeholder={localize.text('Select File', 'importAccount')} type={'text'} wide={true} value={keyFilePath} />
                <TextInput id={'js-keyfilePassphraseInput'} style={styles.keyfilePassphraseInput} placeholder={localize.text('Keyfile Passphrase', 'importAccount')} type={'password'} wide={true} value={keyFilePassphrase} onChange={onKeyFilePassphraseChange} />
                {keyFileImportError ?
                  <InputErrorMessage style={styles.errorMessage} message={keyFileImportError}/>
                  :
                  null
                }
                <ButtonPrimary style={styles.importKeyfileButton} type={'submit'}>{localize.text('Import', 'universal')}</ButtonPrimary>
              </form>
              :
              null
            }
            <div style={styles.privateKeyButtonContainer}>
              <CaretButton enabled={showKeyText} text={localize.text('Private Key', 'importAccount')} onClick={onPrivateKeyImportClick} />
            </div>
            {showKeyText ?
              <form style={styles.keyFileInputsContainer} onSubmit={onImportPrivateKeySubmit}>
                <TextInput id={'js-privateKeyInput'} style={styles.privateKeyInput} placeholder={localize.text('Raw Private Key', 'importAccount')} type={'password'} wide={true} value={privateKey} onChange={onPrivateKeyChange} />
                {privateKeyImportError ?
                  <InputErrorMessage style={styles.errorMessage} message={privateKeyImportError}/>
                  :
                  null
                }
                <ButtonPrimary style={styles.importKeyfileButton} type={'submit'}>{localize.text('Import', 'universal')}</ButtonPrimary>
              </form>
              :
              null
            }
          </div>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
};
