import { Wallet } from '../../modules/wallet';
import { FlexColumn, FlexRow } from './flex';
import React, { useContext } from 'react';
import { BodyText1, BodyText3 } from './text';
import { localizeContext } from '../../hooks/localize-hook';
import { useTheme } from '@pokt-foundation/ui';
import * as math from 'mathjs';
import { BigNumber } from 'mathjs';
import { splitAddress, splitHash } from '../../util';
import { TextButton } from './button';
import chevronRight from '../../images/icons/chevron-right.svg';
import { useDispatch } from "react-redux";
import { setActiveView, setSelectedTransaction } from "../../reducers/app-reducer";
import { activeViews } from "../../constants";

interface TransactionsTableProps {
  wallets: Wallet[]
}
export const TransactionTable = ({ wallets }: TransactionsTableProps) => {

  const dispatch = useDispatch();
  const theme = useTheme();
  const localize = useContext(localizeContext);

  const transactions = [];
  for(const w of wallets) {
    for(const t of w.transactions) {
      transactions.push([t.height, w.address === t.stdTx.msg.value.to_address ? 'Received' : 'Sent', w.name, t.stdTx.msg.value.amount, w.address, t.hash, ]);
    }
  }

  const styles = {
    row: {
      paddingLeft: 25,
      // paddingRight: 25,
      paddingTop: 11,
      paddingBottom: 11,
      borderBottomStyle: 'solid',
      borderBottomWidth: 2,
      borderBottomColor: '#32404F',
    },
    column: {
      flexGrow: 1
    },
    accentText: {
      color: theme.accent,
    },
  };

  const onOpenTransactionClick = (tx: string) => {
    dispatch(setSelectedTransaction({selectedTransaction: tx}));
    dispatch(setActiveView({activeView: activeViews.TRANSACTION_SUMMARY}));
  };

  return (
    <div>
      {transactions
        .sort((a, b) => a[0] === b[0] ? 0 : a[0] > b[0] ? -1 : 1)
        .map(t => {
          const [ height, type, walletName, amount, address, txHash ] = t;
          const preppedAmount = math.divide(math.bignumber(amount), math.bignumber(1000000)).toString();
          return (
            <FlexRow key={height + txHash} style={styles.row as React.CSSProperties} justifyContent={'flex-start'}>
              <FlexColumn style={{...styles.column, width: 130, minWidth: 130}}>
                <BodyText3>{type}</BodyText3>
                <BodyText1><strong>{`${localize.number(Number(preppedAmount), {useGrouping: true})} POKT`}</strong></BodyText1>
              </FlexColumn>
              <FlexColumn style={styles.column}>
                <BodyText3>{walletName}</BodyText3>
                <BodyText1 style={styles.accentText}><strong>{splitAddress(address)}</strong></BodyText1>
              </FlexColumn>
              <FlexColumn style={styles.column}>
                <BodyText3>{localize.text('TX Hash', 'transactionsTable')}</BodyText3>
                <BodyText1 style={styles.accentText}><strong>{splitHash(txHash)}</strong></BodyText1>
              </FlexColumn>
              <FlexColumn style={{...styles.column, width: 100, minWidth: 100}} justifyContent={'center'}>
                <BodyText1>Jan 14, 2022</BodyText1>
              </FlexColumn>
              <FlexColumn style={{...styles.column, width: 40, minWidth: 40}} justifyContent={'center'}>
                <TextButton onClick={() => onOpenTransactionClick(txHash)}><img alt={localize.text('Open transaction icon', 'transactionsTable')} src={chevronRight} /></TextButton>
              </FlexColumn>
            </FlexRow>
          );
        })
      }
    </div>
  );
};
