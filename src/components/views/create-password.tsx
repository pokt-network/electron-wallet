import React, { useContext, useState } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { FlexRow } from '../ui/flex';
import { Sidebar } from '../ui/sidebar';
import { MainContainer } from '../ui/main-container';
import { MainHeader, MainHeaderTitle } from '../ui/main-header';
import { MainBody } from '../ui/main-body';
import { Header3, Header5 } from '../ui/header';
import { BodyText1 } from '../ui/text';
import { Field, TextInput, useTheme } from '@pokt-foundation/ui';
import { ButtonPrimary, TextButton } from '../ui/button';
import { MasterPassword, masterPasswordIsSet } from '../../modules/master-password';
import { useDispatch } from 'react-redux';
import { masterPasswordContext } from '../../hooks/master-password-hook';
import { setActiveView } from '../../reducers/app-reducer';
import { activeViews } from '../../constants';

export const CreatePassword = () => {

  const dispatch = useDispatch();

  const { setMasterPassword } = useContext(masterPasswordContext);
  const [ password, setPassword ] = useState('');
  const [ passwordRepeat, setPasswordRepeat ] = useState('');

  const poktTheme = useTheme();

  const localize = useContext(localizeContext);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    header: {
      paddingBottom: 10,
      color: poktTheme.accentAlternative,
    },
    warningParagraph: {
      fontWeight: 700,
    },
    form: {
      width: 700,
      maxWidth: '100%',
      paddingTop: 20,
    },
    input: {
      marginBottom: 30,
      backgroundColor: 'transparent',
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== passwordRepeat)
      return;
    const isSet = masterPasswordIsSet();
    const masterPassword = MasterPassword(password);
    if(!isSet)
      masterPassword.set();
    else if(!masterPassword.verify()) {
      return;
    }
    setMasterPassword(masterPassword);
    dispatch(setActiveView({activeView: activeViews.WALLET_OVERVIEW}));
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const onPasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPasswordRepeat(e.target.value);
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <MainHeader>
          <MainHeaderTitle>{localize.text('Welcome to Pocket Wallet', 'create-password')}</MainHeaderTitle>
          <TextButton onClick={() => {}}>
            <Header5>{localize.text('Buy POKT', 'create-password')}</Header5>
          </TextButton>
        </MainHeader>
        <MainBody>
          <Header3 style={styles.header}>{localize.text('Protect your Wallet', 'create-password')}</Header3>
          <p><BodyText1>{localize.text('Create a password to lock your Wallet. You will need this to unlock your accounts, perform transactions, and export your keys.', 'create-password')}</BodyText1></p>
          <p><BodyText1 style={styles.warningParagraph}>{localize.text('We can NOT help you recover this password so please back it up securely.', 'create-password')}</BodyText1></p>
          <form style={styles.form} onSubmit={onSubmit}>
            <TextInput type={'password'} style={styles.input} wide={true} value={password} onChange={onPasswordChange} required={true} autofocus={true} placeholder={localize.text('Password', 'universal')} />
            <TextInput type={'password'} style={styles.input} wide={true} value={passwordRepeat} onChange={onPasswordRepeatChange} required={true} placeholder={localize.text('Confirm Password', 'universal')} />
            <ButtonPrimary size={'md'} type={'submit'}>{localize.text('Create', 'universal')}</ButtonPrimary>
          </form>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
};
