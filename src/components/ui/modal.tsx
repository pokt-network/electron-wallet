import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import React, { useContext } from 'react';
import closeIcon from '../../images/icons/close.svg';
import { localizeContext } from '../../hooks/localize-hook';
import { TextButton } from './button';
import { BigShape, BigShapeType } from './big-shape';

interface ModalProps {
  shape?: BigShapeType
  children: React.ReactNode,
  onClose: () => void
}

export const Modal = ({ children, shape, onClose }: ModalProps) => {

  const localize = useContext(localizeContext);

  const {
    windowWidth,
    windowHeight,
  } = useSelector(({ appState }: RootState) => appState);

  const styles = {
    overlay: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: windowWidth,
      height: windowHeight,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 10000,
    },
    container: {
      width: 596,
      maxWidth: '90%',
      backgroundImage: 'linear-gradient(179.48deg, #111B24 13.28%, #202832 76.43%)',
      borderRadius: 10,
      padding: 43,
      paddingTop: 139,
      position: 'relative',
    },
    closeIcon: {
      position: 'absolute',
      right: 25,
      top: 18,
    },
    bigShape: {
      position: 'absolute',
      marginLeft: -177,
      left: '50%',
      top: -125,
    },
  };

  let overlayNode: any;

  const onOverlayClick = (e: React.MouseEvent) => {
    if(e.target === overlayNode)
      onClose();
  };

  return (
    <div ref={node => node ? overlayNode = node : null} style={styles.overlay as React.CSSProperties} onClick={onOverlayClick}>
      <div style={styles.container as React.CSSProperties}>
        {shape ?
          <BigShape name={shape} style={styles.bigShape} />
          :
          null
        }
        <TextButton onClick={onClose}><img alt={localize.text('Close icon', 'modal')} src={closeIcon} style={styles.closeIcon as React.CSSProperties} /></TextButton>
        {children}
      </div>
    </div>
  );
};
