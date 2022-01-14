import React, { useContext } from 'react';
import { Sidebar } from '../ui/sidebar';
import { MainHeader, MainHeaderTitle } from '../ui/main-header';
import { FlexColumn, FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { MainBody } from '../ui/main-body';
import { localizeContext } from '../../hooks/localize-hook';
import { ButtonPrimary, ButtonSecondary, TextButton } from '../ui/button';
import { Header1, Header4, Header5 } from '../ui/header';
import { APIContext } from '../../hooks/api-hook';
import { links } from '../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { BodyText1, BodyText2, BodyText3 } from '../ui/text';
import pocketLogo from '../../images/pocket-logo.svg';
import { Wallet } from '../../modules/wallet';
import * as math from 'mathjs';
import { BigNumber } from 'mathjs';
import { Card } from '../ui/card';
import ellipse from '../../images/icons/ellipse.svg';
import { TransactionTable } from '../ui/transactions-table';
import { PricingContext } from '../../hooks/pricing-hook';

export const WalletOverview = () => {

  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const pricing = useContext(PricingContext);
  const {
    wallets,
  } = useSelector(({ appState }: RootState) => appState);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    balanceContainer: {
      marginTop: 8,
    },
    convertedBalanceContainer: {
      marginLeft: 55,
      marginTop: 8,
    },
    totalBalanceHeader: {
      marginLeft: 12,
    },
    card: {
      marginTop: 35,
      borderRadius: 10,
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 24,
      paddingBottom: 24,
    },
    cardItem: {
      gap: 16,
    },
    nodeTypeIcon: {
      marginRight: 12,
    },
    transactionHistoryHeader: {
      marginTop: 59,
      marginBottom: 39,
    },
  };

  let totalBalance: BigNumber = math.bignumber(0);
  for(const w of wallets) {
    totalBalance = math.add(math.bignumber(w.balance), math.bignumber(totalBalance)) as BigNumber;
  }
  totalBalance = math.divide(totalBalance, math.bignumber(1000000)) as BigNumber;
  const convertedBalance = pricing.convert(totalBalance, 'USD');

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
        <MainBody>
          <FlexRow justifyContent={'flex-start'}>
            <BodyText2>{localize.text('Wallet Total Balance', 'walletOverview')}</BodyText2>
          </FlexRow>
          <FlexRow style={styles.balanceContainer} justifyContent={'flex-start'}>
            <img alt={localize.text('Pocket logo', 'universal')} src={pocketLogo} />
            <Header1 style={styles.totalBalanceHeader}>{`${localize.number(totalBalance.toNumber(), {useGrouping: true})} POKT`}</Header1>
          </FlexRow>
          <FlexRow style={styles.convertedBalanceContainer} justifyContent={'flex-start'}>
            <BodyText1>{`$${localize.number(Number(convertedBalance), {useGrouping: true})} USD`}</BodyText1>
          </FlexRow>
          <Card style={styles.card}>
            <FlexRow justifyContent={'space-between'}>
              <FlexColumn style={styles.cardItem}>
                <BodyText3>{localize.text('Total Accounts', 'walletOverview')}</BodyText3>
                <FlexRow justifyContent={'flex-start'}>
                  <BodyText1><strong>{wallets.length}</strong></BodyText1>
                </FlexRow>
              </FlexColumn>
              <FlexColumn style={styles.cardItem}>
                <BodyText3>{localize.text('Total Nodes', 'walletOverview')}</BodyText3>
                <FlexRow justifyContent={'flex-start'}>
                  <BodyText1><strong>{0}</strong></BodyText1>
                </FlexRow>
              </FlexColumn>
              <FlexColumn style={styles.cardItem}>
                <BodyText3>{localize.text('Total Apps', 'walletOverview')}</BodyText3>
                <FlexRow justifyContent={'flex-start'}>
                  <img style={styles.nodeTypeIcon} alt={localize.text('App icon', 'walletOverview')} src={ellipse} />
                  <BodyText1><strong>{0}</strong></BodyText1>
                </FlexRow>
              </FlexColumn>
              <FlexColumn style={styles.cardItem}>
                <BodyText3>{localize.text('Total Staked POKT', 'walletOverview')}</BodyText3>
                <FlexRow justifyContent={'flex-start'}>
                  <BodyText1><strong>{0}</strong></BodyText1>
                </FlexRow>
              </FlexColumn>
              <FlexColumn justifyContent={'center'}>
                <ButtonSecondary>{localize.text('Import Account', 'walletOverview')}</ButtonSecondary>
              </FlexColumn>
            </FlexRow>
          </Card>
          <Header4 style={styles.transactionHistoryHeader}>{localize.text('Aggregated Transaction History', 'walletOverview')}</Header4>
          <TransactionTable wallets={wallets} />
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
}