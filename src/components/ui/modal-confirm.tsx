import React, { useContext } from "react";
import { localizeContext } from "../../hooks/localize-hook";
import { Modal } from "./modal";
import { Header4 } from "./header";
import { BodyText1 } from "./text";
import { FlexRow } from "./flex";
import { ButtonPrimary, ButtonSecondary } from "./button";

interface ModalConfirmProps {
  title?: string
  text: string
  cancelButtonText?: string
  confirmButtonText?: string
  onCancel: ()=>void
  onConfirm: ()=>void
}

export const ModalConfirm = ({ title, text, cancelButtonText, confirmButtonText, onCancel, onConfirm }: ModalConfirmProps) => {
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
    buttonsContainer: {
      paddingTop: 12,
    },
    submitButton: {
      marginTop: 36,
    },
  };

  const handleClose = () => {
    onCancel();
  };
  const onCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
  };
  const onConfirmClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Modal onClose={handleClose}>
      <div>
        <Header4>{title ? title : localize.text('Confirm', 'universal')}</Header4>
        <div style={styles.textContainer}>
          <BodyText1>{text}</BodyText1>
        </div>
        <div style={styles.buttonsContainer}>
          <FlexRow justifyContent={'center'} gap={'30px'}>
            <ButtonSecondary type={'button'} size={'md'} style={styles.submitButton} onClick={onCancelClick}>{cancelButtonText ? cancelButtonText : localize.text('Cancel', 'universal')}</ButtonSecondary>
            <ButtonPrimary type={'button'} size={'md'} style={styles.submitButton} onClick={onConfirmClick}>{confirmButtonText ? confirmButtonText : localize.text('OK', 'universal')}</ButtonPrimary>
          </FlexRow>
        </div>
      </div>
    </Modal>
  );
};
