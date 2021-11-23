import {
  Application,
  Node,
  Pocket, RawTxResponse,
  Transaction
} from '@pokt-network/pocket-js';
import { isError } from 'lodash';
import { DEFAULT_REQUEST_TIMEOUT } from '../constants';

export class RPCController {

  _pocket: Pocket;
  _timeout = DEFAULT_REQUEST_TIMEOUT;

  constructor(pocket: Pocket) {
    this._pocket = pocket;
  }

  private checkForRPCProvider() {
    if(!this._pocket.rpc || (this._pocket.rpc && !this._pocket.rpc())) {
      throw new Error('No rpc provider in Pocket instance');
    }
  }

  async getBalance(address: string, blockHeight = '0', timeout = this._timeout): Promise<BigInt> {
    this.checkForRPCProvider();
    // @ts-ignore
    const res = await this._pocket.rpc().query.getBalance(address, BigInt(blockHeight), timeout);
    if(isError(res)) {
      throw res;
    } else {
      return res.balance;
    }
  }

  async getTransaction(id: string, timeout = this._timeout): Promise<Transaction> {
    this.checkForRPCProvider();
    // @ts-ignore
    const res = await this._pocket.rpc().query.getTX(id, timeout);
    if(isError(res)) {
      throw res;
    } else {
      return res.transaction;
    }
  }

  async getAccountTransactions(address: string, received: boolean, prove: boolean, page = 1, perPage = 30, timeout = this._timeout): Promise<{transactions: Transaction[], totalCount: number}> {
    this.checkForRPCProvider();
    // @ts-ignore
    const res = await this._pocket.rpc().query.getAccountTxs(address, received, prove, page, perPage, timeout);
    if(isError(res)) {
      throw res;
    } else {
      return {
        transactions: res.transactions,
        totalCount: res.totalCount,
      }
    }
  }

  async getNode(address: string, height = '0', timeout = this._timeout): Promise<Node> {
    this.checkForRPCProvider();
    // @ts-ignore
    const res = await this._pocket.rpc().query.getNode(address, BigInt(height), timeout);
    if(isError(res)) {
      throw res;
    } else {
      return res.node;
    }
  }

  async getApp(address: string, height = '0', timeout = this._timeout): Promise<Application> {
    this.checkForRPCProvider();
    // @ts-ignore
    const res = await this._pocket.rpc().query.getApp(address, BigInt(height), timeout);
    if(isError(res)) {
      throw res;
    } else {
      return res.application;
    }
  }

  async sendRawTx(fromAddress: string, tx: string, timeout = this._timeout): Promise<RawTxResponse> {
    // @ts-ignore
    const res = await this._pocket.rpc().client.rawtx(fromAddress, tx, timeout);
    if(isError(res)) {
      throw res;
    } else {
      return res;
    }
  }

}
