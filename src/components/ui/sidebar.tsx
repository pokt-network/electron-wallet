import { FlexColumn, FlexRow } from './flex';
import pocketTextLogo from '../../images/pocket-text-logo.svg';
import { ButtonPrimary, TextButton } from './button';
import React, { useContext } from 'react';
import { useTheme } from '@pokt-foundation/ui';
import { localizeContext } from '../../hooks/localize-hook';
import { BodyText2, BodyText4 } from './text';

interface SidebarButtonProps {
  children: any
}
const SidebarButton = ({ children }: SidebarButtonProps) => {

  const styles = {
    button: {
      width: '100%',
      paddingTop: 14,
      paddingBottom: 14,
    },
  };

  return (
    <TextButton style={styles.button} onClick={() => {}}>
      <FlexRow justifyContent={'flex-start'}>
        <BodyText2>{children}</BodyText2>
      </FlexRow>
    </TextButton>
  );
};

export const Sidebar = () => {

  const localize = useContext(localizeContext);
  const poktTheme = useTheme();
  const { backgroundInverted } = poktTheme;

  const styles = {
    sidebar: {
      borderRadius: '0 16px 16px 0',
      width: 229,
      minWidth: 229,
      maxWidth: 229,
      paddingTop: 35,
      paddingBottom: 0,
      paddingLeft: 25,
      paddingRight: 25,
      backgroundColor: `rgba(${backgroundInverted.r}, ${backgroundInverted.g}, ${backgroundInverted.b}, .05)`,
    },
    pocketLogo: {
      width: 133,
      marginBottom: 60,
    },
    createButton: {
      width: '100%',
      marginBottom: 36,
    },
    copyrightContainer: {
      marginLeft: -25,
      marginRight: -25,
      paddingTop: 14,
      paddingBottom: 26,
    },
    topButtonContainer: {
      width: '100%',
      flexGrow: 1,
      minHeight: 0,
    }
  };

  return (
    <FlexColumn style={styles.sidebar}>
      <FlexRow justifyContent={'center'}>
        <img style={styles.pocketLogo} src={pocketTextLogo} alt={localize.text('Pocket text logo', 'start')} />
      </FlexRow>
      <FlexRow justifyContent={'center'}>
        <ButtonPrimary size={'md'} style={styles.createButton} disabled={true}>{localize.text('Create', 'universal')}</ButtonPrimary>
      </FlexRow>
      <div style={styles.topButtonContainer}>
        <SidebarButton>{localize.text('Wallet Overview', 'sidebar')}</SidebarButton>
      </div>
      <SidebarButton>{localize.text('Import Account', 'sidebar')}</SidebarButton>
      <SidebarButton>{localize.text('Watch Account', 'sidebar')}</SidebarButton>
      <SidebarButton>{localize.text('Hardware Wallet', 'sidebar')}</SidebarButton>
      <SidebarButton>{localize.text('Stats', 'sidebar')}</SidebarButton>
      <FlexRow style={styles.copyrightContainer} justifyContent={'center'}>
        <BodyText4>{localize.text('App Terms of Use - © Pocket Network Inc. 2021', 'sidebar')}</BodyText4>
      </FlexRow>
    </FlexColumn>
  )
};
