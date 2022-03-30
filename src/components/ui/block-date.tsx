import { useContext, useEffect, useState } from 'react';
import { WalletControllerContext } from '../../hooks/wallet-hook';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface BlockDateProps {
  blockHeight?: string
  dateType?: "localeString"|"localeDateString"
  includeFromNow?: boolean
}
export const BlockDate = ({ blockHeight, dateType = 'localeString', includeFromNow = false }: BlockDateProps) => {

  const walletController = useContext(WalletControllerContext);
  const [ date, setDate ] = useState<Date|undefined>(undefined);

  useEffect(() => {
    if(blockHeight && walletController) {
      walletController.getBlock(blockHeight)
        .then(block => {
          const time = block.header.time;
          setDate(new Date(time));
        })
        .catch(console.error);
    }
  }, [blockHeight, walletController]);

  if(!date)
    return null;

  const fromNow = includeFromNow ? dayjs(date).fromNow() : '';
  const dateStr = dateType === 'localeString' ? date.toLocaleString() : date.toLocaleDateString();

  return (
    <span>{includeFromNow ? `${fromNow}, ${dateStr}` : dateStr}</span>
  );
};
