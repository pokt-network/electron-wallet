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
import { activeViews } from '../../constants';
import { Icon } from "./icon";

interface SidebarButtonProps {
  children: any
  leftIcon?: any
  rightIcon?: any
  selected?: boolean
  onClick: () => void
}
const SidebarButton = ({ selected = false, children, leftIcon, rightIcon, onClick }: SidebarButtonProps) => {

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
  };

  return (
    <TextButton style={styles.button} hoverBackground={'rgba(196, 196, 196, .1)'} onClick={onClick}>
      <FlexRow justifyContent={'flex-start'} alignItems={'center'}>
        {leftIcon ? leftIcon : null}
        <BodyText2>{children}</BodyText2>
        <div style={{flexGrow: 1}} />
        {rightIcon ? rightIcon : null}
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
      position: 'relative',
      overflow: 'hidden',
    },
    createButtonContainer: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    leftIcon: {
      marginRight: 12,
    },
    walletsOuterContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    scrollableWalletsContainer: {
      flex: -1,
      overflowY: 'auto',
    },
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
      <div style={styles.topButtonContainer as React.CSSProperties}>
        <FlexColumn style={styles.walletsOuterContainer as React.CSSProperties}>
          <SidebarButton selected={activeView === activeViews.WALLET_OVERVIEW} leftIcon={<Icon name={'target'} style={styles.leftIcon} />} rightIcon={<Icon name={'chevronRight'} />} onClick={onWalletOverviewClick}>{localize.text('Wallet Overview', 'sidebar')}</SidebarButton>
          <div style={styles.scrollableWalletsContainer as React.CSSProperties}>
            {wallets
              .map(w => {
                return (
                  <SidebarButton key={w.address} selected={[activeViews.WALLET_DETAIL, activeViews.SEND].includes(activeView) && w.address === selectedWallet} leftIcon={<Icon name={w.watchOnly ? 'eyeOn' : 'wallet'} style={styles.leftIcon} />} rightIcon={<Icon name={'chevronRight'} />} onClick={() => onWalletClick(w.address)}>{w.name}</SidebarButton>
                );
              })
            }
          </div>
        </FlexColumn>
      </div>
      <SidebarButton leftIcon={<Icon name={'import'} style={styles.leftIcon} />} onClick={onImportAccountClick}>{localize.text('Import Account', 'sidebar')}</SidebarButton>
      <SidebarButton leftIcon={<Icon name={'eyeOn'} style={styles.leftIcon} />} onClick={onWatchAccountClick}>{localize.text('Watch Account', 'sidebar')}</SidebarButton>
      {/*<SidebarButton leftIcon={<Icon name={'cpu'} style={styles.leftIcon} />} onClick={onHardwareWalletClick}>{localize.text('Hardware Wallet', 'sidebar')}</SidebarButton>*/}
      {/*<SidebarButton leftIcon={<Icon name={'barChart'} style={styles.leftIcon} />} onClick={onStatsClick}>{localize.text('Stats', 'sidebar')}</SidebarButton>*/}
      <FlexRow style={styles.copyrightContainer} justifyContent={'center'}>
        <BodyText4>{localize.text('App Terms of Use - © Pocket Network Inc. 2021', 'sidebar')}</BodyText4>
      </FlexRow>
      {showCreateModal ? <ModalCreateWallet /> : null}
    </FlexColumn>
  )
};
