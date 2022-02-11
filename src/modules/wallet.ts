import { Subject } from 'rxjs';
import { RpcError, Transaction } from '@pokt-network/pocket-js';
import { accountStatus, accountTypes } from '../constants';
import { bignumber } from 'mathjs';
import { RPCController } from './rpc-controller';

export interface WalletData {
  name: string;
  publicKey: string;
  privateKeyEncrypted: string;
  ppk: string;
  address: string;
  balance?: string;
  accountType?: string;
  status?: string;
  jailed?: boolean;
}

export class Wallet {

  events = {
    change: new Subject<Wallet>(),
    error: new Subject<string>(),
  };

  _rpcController: RPCController;

  name: string;
  publicKey: string;
  privateKeyEncrypted: string;
  ppk: string;
  address: string;
  balance = bignumber(0);
  accountType = accountTypes.NODE;
  status = accountStatus.NOT_STAKED;
  jailed = false;
  transactions: Transaction[] = [];

  constructor(data: WalletData, rpcController: RPCController) {
    this._rpcController = rpcController;
    this.name = data.name;
    this.publicKey = data.publicKey;
    this.privateKeyEncrypted = data.privateKeyEncrypted;
    this.ppk = data.ppk;
    this.address = data.address;
    if(typeof data.balance === 'string')
      this.balance = bignumber(data.balance);
    this.accountType = data.accountType || this.accountType;
    this.status = data.status || this.status;
    this.jailed = data.jailed || this.jailed;
  }

  private logError(message: string): void {
    this.events.error.next(message);
  }

  private logRPCError(method: string, err: Error|RpcError): void {
    if(err instanceof RpcError) {
      this.logError(`wallet.${method}() failed with error code ${err.code} and message "${err.message}"`);
    } else {
      this.logError(`wallet.${method}() failed with message "${err.message}" \n ${err.stack}`);
    }
  }

  toObject(): WalletData {
    return {
      name: this.name,
      publicKey: this.publicKey,
      privateKeyEncrypted: this.privateKeyEncrypted,
      ppk: this.ppk,
      address: this.address,
      balance: this.balance.toString(),
      accountType: this.accountType,
      status: this.status,
      jailed: this.jailed,
    };
  }

  setName(newName: string) {
    this.name = newName;
    this.events.change.next(this);
  }

  async updateBalance(): Promise<boolean> {
    try {
      const balance = await this._rpcController.getBalance(this.address);
      const prevBalance = this.balance;
      if(prevBalance.toString() !== balance.toString()) {
        this.balance = bignumber(balance.toString());
        this.events.change.next(this);
      }
      return true;
    } catch(err) {
      // @ts-ignore
      this.logRPCError('updateBalance', err);
    }
    return false;
  }

  async updateTransactions(): Promise<boolean> {
    try {
      const sentTransactions = await this._rpcController.getAccountTransactions(this.address, false, false);
      const receivedTransactions = await this._rpcController.getAccountTransactions(this.address, true, false);
      this.transactions = [
        ...sentTransactions.transactions,
        ...receivedTransactions.transactions,
      ];
      this.events.change.next(this);
      return true;
    } catch(err) {
      // @ts-ignore
      this.logRPCError('updateBalance', err);
    }
    return false;
  }

}
