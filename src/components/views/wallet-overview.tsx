import React, { useContext } from 'react';
import { Sidebar } from '../ui/sidebar';
import { FlexColumn, FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { MainBody } from '../ui/main-body';
import { localizeContext } from '../../hooks/localize-hook';
import { ButtonSecondary } from '../ui/button';
import { Header1, Header4 } from '../ui/header';
import { accountTypes, activeViews } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { BodyText1, BodyText2, BodyText3 } from '../ui/text';
import pocketLogo from '../../images/pocket-logo.svg';
import * as math from 'mathjs';
import { bignumber, BigNumber } from 'mathjs';
import { Card } from '../ui/card';
import { TransactionTable } from '../ui/transactions-table';
import { PricingContext } from '../../hooks/pricing-hook';
import { AppHeader } from "../ui/app-header";
import { setActiveView } from "../../reducers/app-reducer";
import { Icon } from "../ui/icon";

export const WalletOverview = () => {

  const dispatch = useDispatch();
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
    mainColumn: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      overflow: 'hidden',
    },
    transactionsTable: {
      flexGrow: -1,
      overflow: 'auto'
    },
  };

  let totalBalance: BigNumber = math.bignumber(0);
  for(const w of wallets) {
    totalBalance = math.add(math.bignumber(w.balance), math.bignumber(totalBalance)) as BigNumber;
  }
  totalBalance = math.divide(totalBalance, math.bignumber(1000000)) as BigNumber;
  const convertedBalance = pricing.convert(totalBalance, 'USD');

  const onImportAccountClick = () => {
    dispatch(setActiveView({activeView: activeViews.IMPORT_ACCOUNT}));
  };

  const totalStakedUpokt: BigNumber = wallets
    .reduce((sum: BigNumber, w): BigNumber => {
      const { stakedAmount } = w;
      return math.add(stakedAmount, sum) as BigNumber;
    }, bignumber(0));
  const totalStaked = math.divide(totalStakedUpokt, bignumber(1000000));

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Wallet Overview', 'wallet-overview')} />
        <MainBody>
          <FlexColumn style={styles.mainColumn as React.CSSProperties}>
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
            <Card round={true} style={styles.card}>
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
                    <Icon name={'node'} style={styles.nodeTypeIcon} />
                    <BodyText1><strong>{wallets.filter(w => w.accountType === accountTypes.NODE).length}</strong></BodyText1>
                  </FlexRow>
                </FlexColumn>
                <FlexColumn style={styles.cardItem}>
                  <BodyText3>{localize.text('Total Apps', 'walletOverview')}</BodyText3>
                  <FlexRow justifyContent={'flex-start'}>
                    <Icon name={'ellipse'} style={styles.nodeTypeIcon} />
                    <BodyText1><strong>{wallets.filter(w => w.accountType === accountTypes.APP).length}</strong></BodyText1>
                  </FlexRow>
                </FlexColumn>
                <FlexColumn style={styles.cardItem}>
                  <BodyText3>{localize.text('Total Staked POKT', 'walletOverview')}</BodyText3>
                  <FlexRow justifyContent={'flex-start'}>
                    <Icon name={'stakedTokens'} style={styles.nodeTypeIcon} />
                    <BodyText1><strong>{localize.number(Number(totalStaked.toString()), {useGrouping: true})}</strong></BodyText1>
                  </FlexRow>
                </FlexColumn>
                <FlexColumn justifyContent={'center'}>
                  <ButtonSecondary onClick={onImportAccountClick}>{localize.text('Import Account', 'walletOverview')}</ButtonSecondary>
                </FlexColumn>
              </FlexRow>
            </Card>
            <Header4 style={styles.transactionHistoryHeader}>{localize.text('Aggregated Transaction History', 'walletOverview')}</Header4>
            <TransactionTable style={styles.transactionsTable} wallets={wallets} />
          </FlexColumn>
        </MainBody>
      </MainContainer>
    </FlexRow>
  );
}
