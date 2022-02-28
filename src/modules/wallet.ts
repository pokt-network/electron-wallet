import { Subject } from 'rxjs';
import { Application, Node, RpcError, StakingStatus, Transaction } from '@pokt-network/pocket-js';
import { accountStatus, accountTypes } from '../constants';
import { BigNumber, bignumber } from 'mathjs';
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
  stakedAmount?: string;
  jailed?: boolean;
  watchOnly?: boolean;
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
  accountType = accountTypes.WALLET;
  status = accountStatus.NOT_STAKED;
  stakedAmount = bignumber(0);
  jailed = false;
  transactions: Transaction[] = [];
  watchOnly = false;

  static statusNumToStatus(statusNum: StakingStatus): string {
    return statusNum === 2 ? accountStatus.STAKED : statusNum === 1 ? accountStatus.UNSTAKING : accountStatus.NOT_STAKED;
  }

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
    if(typeof data.stakedAmount === 'string')
      this.stakedAmount = bignumber(data.stakedAmount);
    this.jailed = data.jailed || this.jailed;
    this.watchOnly = data.watchOnly || this.watchOnly;
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

  private async getAppInfo(): Promise<Application|null> {
    try {
      return await this._rpcController.getApp(this.address);
    } catch(err) {
      // do nothing with error, it just means that it isn't an app
      return null;
    }
  }

  private async getNodeInfo(): Promise<Node|null> {
    try {
      return await this._rpcController.getNode(this.address);
    } catch(err) {
      // do nothing with error, it just means that it isn't a node
      return null;
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
      stakedAmount: this.stakedAmount.toString(),
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
      this.logRPCError('updateTransactions', err);
      return false;
    }
  }

  async updateAccountInfo(): Promise<boolean> {
    try {
      let accountType: string|null = null;
      let appInfo: Application|null = null;
      let nodeInfo: Node|null = null;
      let jailed: boolean;
      let status: string;
      let stakedAmount: BigNumber;
      if([accountTypes.WALLET, accountTypes.APP].includes(this.accountType)) {
        appInfo = await this.getAppInfo();
        if(appInfo) {
          accountType = accountTypes.APP;
        } else {
          nodeInfo = await this.getNodeInfo();
          if(nodeInfo)
            accountType = accountTypes.NODE;
        }
      } else if(this.accountType === accountTypes.NODE) {
        nodeInfo = await this.getNodeInfo();
        if(nodeInfo) {
          accountType = accountTypes.NODE;
        } else {
          appInfo = await this.getAppInfo();
          if(appInfo)
            accountType = accountTypes.APP;
        }
      }
      if(appInfo && accountType === accountTypes.APP) {
        jailed = appInfo.jailed;
        status = Wallet.statusNumToStatus(appInfo.status);
        stakedAmount = bignumber(appInfo.stakedTokens.toString(10));
      } else if(nodeInfo && accountType === accountTypes.NODE) {
        jailed = nodeInfo.jailed;
        status = Wallet.statusNumToStatus(nodeInfo.status);
        stakedAmount = bignumber(nodeInfo.stakedTokens.toString(10));
      } else {
        accountType = accountTypes.WALLET;
        jailed = false;
        status = accountStatus.NOT_STAKED;
        stakedAmount = bignumber(0);
      }
      if(
        accountType !== this.accountType
        || jailed !== this.jailed
        || status !== this.status
        || stakedAmount.toString() !== this.stakedAmount.toString()
      ) {
        this.accountType = accountType;
        this.jailed = jailed;
        this.status = status;
        this.stakedAmount = stakedAmount;
        this.events.change.next(this);
      }
      return true;
    } catch(err) {
      // @ts-ignore
      this.logRPCError('updateAccountInfo', err);
      return false;
    }
  }

}
