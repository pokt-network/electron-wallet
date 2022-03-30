import { FlexColumn } from './flex';
import React from 'react';
import { BigShape } from './big-shape';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { activeViews } from '../../constants';

interface MainContainerProps {
  children: any
}
export const MainContainer = ({ children }: MainContainerProps) => {

  const {
    activeView,
  } = useSelector(({ appState }: RootState) => appState);

  const styles = {
    container: {
      position: 'relative',
      flexGrow: 1,
      paddingLeft: 45,
      paddingRight: 45,
    },
    bigShape: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    }
  };

  let bigShape;
  if([activeViews.IMPORT_ACCOUNT, activeViews.WATCH_ACCOUNT].includes(activeView)) {
    bigShape = 'circle';
  } else if([activeViews.SEND, activeViews.ADDRESS_BOOK].includes(activeView)) {
    bigShape = 'square';
  } else if([activeViews.CREATE_PASSWORD].includes(activeView)) {
    bigShape = 'triangle';
  } else {
    bigShape = '';
  }

  return (
    <FlexColumn style={styles.container as React.CSSProperties}>
      {bigShape === 'circle' || bigShape === 'square' || bigShape === 'triangle' ?
        <BigShape name={bigShape} size={'lg'} style={styles.bigShape} />
        :
        null
      }
      {children}
    </FlexColumn>
  );
};
