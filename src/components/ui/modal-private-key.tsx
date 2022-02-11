import { Header4 } from './header';
import React, { useContext } from 'react';
import { localizeContext } from '../../hooks/localize-hook';
import { Modal } from './modal';
import { TextInput } from '@pokt-foundation/ui';
import { ButtonPrimary } from './button';
import { FlexRow } from './flex';
import { useDispatch } from 'react-redux';
import { setShowPrivateKeyModal } from '../../reducers/app-reducer';
import { BodyText1 } from './text';

interface ModalPrivateKeyProps {
  privateKey: string
}

export const ModalPrivateKey = ({ privateKey }: ModalPrivateKeyProps) => {

  const dispatch = useDispatch();
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
    input: {
      flexGrow: 1,
      borderWidth: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fafafa',
      marginRight: 60,
      fontSize: 14,
    },
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setShowPrivateKeyModal({show: false}));
  };

  const onClose = () => {
    dispatch(setShowPrivateKeyModal({show: false}));
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <Header4>{localize.text('Private Key', 'modalPrivateKey')}</Header4>
        <div style={styles.textContainer}>
          <BodyText1>{localize.text('If someone obtains your private key they can steal your POKT. Please store it securely.', 'modalPrivateKey')}</BodyText1>
        </div>
        <form style={styles.form} onSubmit={onSubmit}>
          <TextInput style={styles.input} type={'text'} wide={true} value={privateKey} readOnly={true} />
          <FlexRow justifyContent={'center'}>
            <ButtonPrimary type={'submit'} size={'md'} style={styles.submitButton}>{localize.text('Hide', 'universal')}</ButtonPrimary>
          </FlexRow>
        </form>
      </div>
    </Modal>
  );
};
