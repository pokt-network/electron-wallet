import React, { useContext } from 'react';
import { Sidebar } from '../ui/sidebar';
import { MainHeader, MainHeaderTitle } from '../ui/main-header';
import { FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { MainBody } from '../ui/main-body';
import { localizeContext } from '../../hooks/localize-hook';
import { TextButton } from '../ui/button';
import { Header5 } from '../ui/header';
import { APIContext } from '../../hooks/api-hook';
import { links } from '../../constants';

export const WalletOverview = () => {

  const api = useContext(APIContext);

  const localize = useContext(localizeContext);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <MainHeader>
          <MainHeaderTitle>{localize.text('Wallet Overview', 'wallet-overview')}</MainHeaderTitle>
          <TextButton onClick={() => api.openExternal(links.BUY_POCKET)}>
            <Header5>{localize.text('Buy POKT', 'create-password')}</Header5>
          </TextButton>
        </MainHeader>
      </MainContainer>
    </FlexRow>
  );
}
