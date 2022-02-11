import { FlexColumn, FlexRow } from '../ui/flex';
import React, { useContext, useState } from 'react';
import { Card } from '../ui/card';
import { BodyText1, BodyText2 } from '../ui/text';
import walletTextLogo from '../../images/wallet-text-logo.svg';
import pocketTextLogo from '../../images/pocket-text-logo.svg';
import { ButtonPrimary, TextButton } from '../ui/button';
import { localizeContext } from '../../hooks/localize-hook';
import { useDispatch } from 'react-redux';
import { setActiveView } from '../../reducers/app-reducer';
import { activeViews, links } from '../../constants';
import { MasterPassword, masterPasswordIsSet } from '../../modules/master-password';
import { TextInput } from '@pokt-foundation/ui';
import { masterPasswordContext } from '../../hooks/master-password-hook';
import { APIContext } from '../../hooks/api-hook';

export const Start = () => {

  const api = useContext(APIContext);

  const dispatch = useDispatch();
  const localize = useContext(localizeContext);
  const passwordSet = masterPasswordIsSet();
  const [ password, setPassword ] = useState('');
  const { setMasterPassword } = useContext(masterPasswordContext);

  const styles = {
    column: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    card: {
      width: 763,
      maxWidth: '90%',
      paddingTop: 105,
      paddingBottom: 0,
    },
    textLogo: {
      width: 236,
      maxWidth: '100%',
      marginBottom: 42,
    },
    description: {
      width: 390,
      textAlign: 'center',
    },
    startButton: {
      marginTop: 40,
      width: 187,
    },
    bottomRow: {
      width: '100%',
      height: 111,
      gap: 116,
    },
    pocketLogo: {
      width: 154,
      maxWidth: '100%',
    },
    topSpacer: {
      width: '100%',
      flexGrow: 1,
      flexBasis: 1,
    },
    bottomSpacer: {
      width: '100%',
      flexGrow: 1,
      flexBasis: 1,
    },
    input: {
      marginTop: 40,
      width: 400,
      maxWidth: '100%',
      background: 'transparent',
    },
  };

  const onHelpClick = () => {
    api.openExternal(links.HELP);
  };
  const onImportClick = () => {
    console.log('onImportClick');
  };
  const onQuitClick = () => {
    window.close();
  };
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(passwordSet) {
      const masterPassword = MasterPassword(password);
      if(masterPassword.verify()) {
        dispatch(setActiveView({activeView: activeViews.WALLET_OVERVIEW}));
        setMasterPassword(masterPassword);
      }
    } else {
      dispatch(setActiveView({activeView: activeViews.CREATE_PASSWORD}));
    }
  };

  return (
    <FlexColumn style={styles.column as React.CSSProperties} justifyContent={'center'} alignItems={'center'}>
      <div style={styles.topSpacer} />
      <Card round={true} style={styles.card}>
        <FlexColumn alignItems={'center'}>
          <img style={styles.textLogo} src={walletTextLogo} alt={localize.text('Wallet text logo', 'start')} />
          <p style={styles.description as React.CSSProperties}><BodyText1>{localize.text('This is an open-source interface for easy management of your POKT accounts.', 'start')}</BodyText1></p>
          <form onSubmit={onSubmit}>
            {passwordSet ?
              <TextInput type={'password'} style={styles.input} wide={true} required={true} value={password} autofocus={true} onChange={onPasswordChange} placeholder={localize.text('Wallet Password', 'start')} />
              :
              null
            }
            <FlexRow justifyContent={'center'}>
              {passwordSet ?
                <ButtonPrimary type={'submit'} style={styles.startButton}>{localize.text('Unlock', 'start')}</ButtonPrimary>
                :
                <ButtonPrimary type={'submit'} style={styles.startButton}>{localize.text('Start', 'start')}</ButtonPrimary>
              }
            </FlexRow>
          </form>
          <FlexRow style={styles.bottomRow} justifyContent={'center'} alignItems={'center'}>
            <TextButton onClick={onHelpClick}><BodyText2>{localize.text('Help', 'universal')}</BodyText2></TextButton>
            <TextButton onClick={onImportClick}><BodyText2>{localize.text('Import', 'universal')}</BodyText2></TextButton>
            <TextButton onClick={onQuitClick}><BodyText2>{localize.text('Quit', 'universal')}</BodyText2></TextButton>
          </FlexRow>
        </FlexColumn>
      </Card>
      <FlexRow style={styles.bottomSpacer} justifyContent={'center'} alignItems={'center'}>
        <img style={styles.pocketLogo} src={pocketTextLogo} alt={localize.text('Pocket text logo', 'start')} />
      </FlexRow>
    </FlexColumn>
  );
};
