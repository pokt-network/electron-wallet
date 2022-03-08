import React, { useContext } from 'react';
import { Header4, Header5 } from './header';
import { localizeContext } from '../../hooks/localize-hook';
import { FlexRow } from './flex';
import { TextButton } from './button';

interface MainHeaderTitleProps {
  children: any
}
export const MainHeaderTitle = ({ children }: MainHeaderTitleProps) => {

  const styles = {
    title: {
      flexGrow: 1,
    },
  };

  return (
    <Header4 style={styles.title}>{children}</Header4>
  );
}

interface MainHeaderProps {
  children: any
}
export const MainHeader = ({ children }: MainHeaderProps) => {

  const styles = {
    container: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#5F6569',
      borderBottomWidth: 1,
      paddingLeft: 25,
      paddingTop: 36,
      paddingBottom: 19,
      position: 'relative',
    },
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      {children}
    </FlexRow>
  );
};
