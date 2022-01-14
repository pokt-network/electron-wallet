import { createContext } from 'react';
import { WalletController } from '../modules/wallet-controller';

export const WalletControllerContext = createContext<WalletController|null>(null);
