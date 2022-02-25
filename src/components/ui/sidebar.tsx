import { FlexColumn, FlexRow } from './flex';
import pocketTextLogo from '../../images/pocket-text-logo.svg';
import { ButtonPrimary, TextButton } from './button';
import React, { useContext } from 'react';
import { useTheme } from '@pokt-foundation/ui';
import { localizeContext } from '../../hooks/localize-hook';
import { BodyText2, BodyText4 } from './text';
import { ModalCreateWallet } from './modal-create';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setActiveView, setSelectedWallet, setShowCreateModal } from '../../reducers/app-reducer';
import walletIcon from '../../images/icons/wallet.svg';
import chevronRight from '../../images/icons/chevron-right.svg';
import { activeViews } from '../../constants';

interface SidebarButtonProps {
  children: any
  leftIcon?: any
  rightIcon?: any
  selected?: boolean
  onClick: () => void
}
const SidebarButton = ({ selected = false, children, leftIcon, rightIcon, onClick }: SidebarButtonProps) => {

  const localize = useContext(localizeContext);
  const theme = useTheme();

  const styles = {
    button: {
      width: '100%',
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 25,
      paddingRight: 25,
      borderLeftStyle: 'solid',
      borderLeftWidth: 3,
      borderLeftColor: selected ? theme.accent : 'transparent',
    },
    leftIcon: {
      marginRight: 12,
    },
  };

  return (
    <TextButton style={styles.button} hoverBackground={'rgba(196, 196, 196, .1)'} onClick={onClick}>
      <FlexRow justifyContent={'flex-start'} alignItems={'center'}>
        {leftIcon ? <img alt={localize.text('Wallet icon', 'sidebar')} style={styles.leftIcon} src={leftIcon} /> : null}
        <BodyText2>{children}</BodyText2>
        <div style={{flexGrow: 1}} />
        {rightIcon ? <img alt={localize.text('Open wallet icon', 'sidebar')} src={rightIcon} /> : null}
      </FlexRow>
    </TextButton>
  );
};

export const Sidebar = () => {

  const dispatch = useDispatch();
  const localize = useContext(localizeContext);
  const poktTheme = useTheme();
  const { backgroundInverted } = poktTheme;
  const {
    activeView,
    showCreateModal,
    wallets,
    selectedWallet,
  } = useSelector(({ appState }: RootState) => appState);

  const styles = {
    sidebar: {
      borderRadius: '0 16px 16px 0',
      width: 229,
      minWidth: 229,
      maxWidth: 229,
      paddingTop: 35,
      paddingBottom: 0,
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
      paddingTop: 14,
      paddingBottom: 26,
    },
    topButtonContainer: {
      width: '100%',
      flexGrow: 1,
      minHeight: 0,
    },
    createButtonContainer: {
      paddingLeft: 25,
      paddingRight: 25,
    }
  };

  const onWalletOverviewClick = () => {
    dispatch(setActiveView({activeView: activeViews.WALLET_OVERVIEW}));
  };
  const onWalletClick = (address: string) => {
    dispatch(setSelectedWallet({address}))
    dispatch(setActiveView({activeView: activeViews.WALLET_DETAIL}));
  };
  const onImportAccountClick = () => {
    dispatch(setActiveView({activeView: activeViews.IMPORT_ACCOUNT}));
  };
  const onWatchAccountClick = () => {
    dispatch(setActiveView({activeView: activeViews.WATCH_ACCOUNT}));
  };
  const onHardwareWalletClick = () => {
    console.log('hardward wallet click');
  };
  const onStatsClick = () => {
    console.log('on stats click');
  };

  return (
    <FlexColumn style={styles.sidebar}>
      <FlexRow justifyContent={'center'}>
        <img style={styles.pocketLogo} src={pocketTextLogo} alt={localize.text('Pocket text logo', 'start')} />
      </FlexRow>
      <FlexRow justifyContent={'center'} style={styles.createButtonContainer}>
        <ButtonPrimary size={'md'} style={styles.createButton} disabled={false} onClick={() => dispatch(setShowCreateModal({show: true}))}>{localize.text('Create', 'universal')}</ButtonPrimary>
      </FlexRow>
      <div style={styles.topButtonContainer}>
        <SidebarButton selected={activeView === activeViews.WALLET_OVERVIEW} rightIcon={chevronRight} onClick={onWalletOverviewClick}>{localize.text('Wallet Overview', 'sidebar')}</SidebarButton>
        {wallets
          .map(w => {
            return (
              <SidebarButton key={w.address} selected={activeView === activeViews.WALLET_DETAIL && w.address === selectedWallet} leftIcon={walletIcon} rightIcon={chevronRight} onClick={() => onWalletClick(w.address)}>{w.name}</SidebarButton>
            );
          })
        }
      </div>
      <SidebarButton onClick={onImportAccountClick}>{localize.text('Import Account', 'sidebar')}</SidebarButton>
      <SidebarButton onClick={onWatchAccountClick}>{localize.text('Watch Account', 'sidebar')}</SidebarButton>
      <SidebarButton onClick={onHardwareWalletClick}>{localize.text('Hardware Wallet', 'sidebar')}</SidebarButton>
      <SidebarButton onClick={onStatsClick}>{localize.text('Stats', 'sidebar')}</SidebarButton>
      <FlexRow style={styles.copyrightContainer} justifyContent={'center'}>
        <BodyText4>{localize.text('App Terms of Use - © Pocket Network Inc. 2021', 'sidebar')}</BodyText4>
      </FlexRow>
      {showCreateModal ? <ModalCreateWallet /> : null}
    </FlexColumn>
  )
};
