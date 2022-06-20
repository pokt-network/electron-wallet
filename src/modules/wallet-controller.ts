import { Wallet, WalletData } from './wallet';
import { KeyUtils } from './key-utils';
import { Subject } from 'rxjs';
import { RPCController } from './rpc-controller';
import { makePassword } from '../util';
import { Block, CoinDenom, Pocket, Transaction } from "@pokt-network/pocket-js";
import { isError } from "lodash";
import { accountTypes, DEFAULT_REQUEST_TIMEOUT, TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT } from "../constants";

export class WalletController {

  events = {
    error: new Subject<string>(),
    walletsChanged: new Subject<Wallet[]>(),
    walletCreated: new Subject<Wallet>(),
    walletUpdated: new Subject<Wallet>(),
    walletDeleted: new Subject<string>(),
  };

  _pocket: Pocket;
  _keyUtils: KeyUtils;
  _rpcController: RPCController;
  _wallets: Wallet[] = [];

  constructor(keyUtils: KeyUtils, rpcController: RPCController, pocket: Pocket) {
    this._keyUtils = keyUtils;
    this._rpcController = rpcController;
    this._pocket = pocket;
  }

  addWallet(walletData: WalletData, newWallet = false): void {
    const wallet = new Wallet(walletData, this._rpcController);
    if(newWallet)
      this.events.walletCreated.next(wallet);
    wallet.events.error.subscribe(message => {
      this.events.error.next(message);
    });
    wallet.events.change.subscribe(() => {
      this.events.walletUpdated.next(wallet);
      this.events.walletsChanged.next([...this._wallets]);
    });
    this._wallets.push(wallet);
    this.events.walletsChanged.next([...this._wallets]);
  }

  async createWallet(name: string, password = makePassword()): Promise<string> {
    const account = await this._keyUtils.createAcount(password);
    if(!account)
      return '';
    const ppk = await this._keyUtils.getPPK(password, account.addressHex);
    const walletData = {
      name,
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      ppk,
      address: account.addressHex,
    };
    this.addWallet(walletData, true);
    return walletData.address;
  }

  importWalletFromData(walletData: WalletData): string {
    if(this._wallets.some(w => w.address === walletData.address))
      return '';
    this.addWallet(walletData, true);
    return walletData.address;
  }

  async getWalletDataFromPPK(name: string, ppkJson: string, ppkPassword: string, password = makePassword()): Promise<WalletData|null> {
    const account = await this._keyUtils.importAccountFromPPK(password, ppkJson, ppkPassword);
    if(!account)
      return null;
    const ppk = await this._keyUtils.getPPK(password, account.addressHex);
    return {
      name,
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      ppk,
      address: account.addressHex,
    };
  }

  async getWalletDataFromRawPrivateKey(name: string, rawPrivateKey: string, password = makePassword()): Promise<WalletData|null> {
    const account = await this._keyUtils.importAccountFromRawPrivateKey(password, rawPrivateKey);
    if(!account)
      return null;
    const ppk = await this._keyUtils.getPPK(password, account.addressHex);
    return {
      name: name || account.addressHex.slice(0, 12),
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      ppk,
      address: account.addressHex,
    };
  }

  async importWatchAccount(name: string, address: string): Promise<string> {
    const walletData = {
      name,
      publicKey: '',
      privateKeyEncrypted: '',
      ppk: '',
      address,
      watchOnly: true,
    };
    if(this._wallets.some(w => w.address === walletData.address))
      return '';
    this.addWallet(walletData);
    return address;
  }

  async getRawPrivateKeyFromWallet(address: string, password: string): Promise<string> {
    const wallet = this._wallets.find(w => w.address === address);
    if(!wallet)
      return '';
    return this._keyUtils.getRawPrivateKeyFromPPK(password, wallet.ppk);
  }

  deleteWallet(address: string): boolean {
    const idx = this._wallets.findIndex(w => w.address === address);
    if(idx < 0)
      return false;
    this._wallets.splice(idx, 1);
    this.events.walletDeleted.next(address);
    this.events.walletsChanged.next([...this._wallets]);
    return true;
  }

  getWallets(): Wallet[] {
    return [...this._wallets];
  }

  async sendTransaction(fromAddress: string, amount: string, toAddress: string, memo: string, password: string): Promise<string> {
    const wallet = this._wallets.find(w => w.address === fromAddress);
    if(!wallet)
      return '';
    const privateKey = await this.getRawPrivateKeyFromWallet(wallet.address, password);
    const transactionSender = await this._pocket.withPrivateKey(privateKey);
    if(isError(transactionSender))
      return '';
    const rawTxResponse = await transactionSender
      .send(fromAddress, toAddress, (Number(amount) * 1000000).toString(10))
      .submit(TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT, CoinDenom.Upokt, memo, DEFAULT_REQUEST_TIMEOUT);
    if(isError(rawTxResponse))
      return '';
    return rawTxResponse.hash;
  }

  async sendUnjailTransaction(address: string, password: string): Promise<string> {
    const wallet = this._wallets.find(w => w.address === address);
    if(!wallet)
      return '';
    const privateKey = await this.getRawPrivateKeyFromWallet(wallet.address, password);
    const transactionSender = await this._pocket.withPrivateKey(privateKey);
    if(isError(transactionSender))
      return '';
    let rawTxResponse;
    if(wallet.accountType === accountTypes.APP) {
      rawTxResponse = await transactionSender
        .appUnjail(address)
        .submit(TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT, CoinDenom.Upokt);
    } else if(wallet.accountType === accountTypes.NODE) {
      rawTxResponse = await transactionSender
        .nodeUnjail(address)
        .submit(TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT, CoinDenom.Upokt);
    } else {
      return '';
    }
    if(isError(rawTxResponse))
      return '';
    return rawTxResponse.hash;
  }

  async sendUnstakeTransaction(address: string, password: string): Promise<string> {
    const wallet = this._wallets.find(w => w.address === address);
    if(!wallet)
      return '';
    const privateKey = await this.getRawPrivateKeyFromWallet(wallet.address, password);
    const transactionSender = await this._pocket.withPrivateKey(privateKey);
    if(isError(transactionSender))
      return '';
    let rawTxResponse;
    if(wallet.accountType === accountTypes.APP) {
      rawTxResponse = await transactionSender
        .appUnstake(address)
        .submit(TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT, CoinDenom.Upokt);
    } else if(wallet.accountType === accountTypes.NODE) {
      rawTxResponse = await transactionSender
        .nodeUnstake(address)
        .submit(TRANSACTION_CHAIN_ID, TRANSACTION_FEE_UPOKT, CoinDenom.Upokt);
    } else {
      return '';
    }
    if(isError(rawTxResponse))
      return '';
    return rawTxResponse.hash;
  }

  async getBlock(blockHeight: string): Promise<Block> {
    return await this._rpcController.getBlock(blockHeight);
  }

  async getTransaction(tx: string): Promise<Transaction> {
    return await this._rpcController.getTransaction(tx);
  }

  async getPPKFromRawKey(privateKey: string, password: string): Promise<string> {
    return await this._keyUtils.getPPKFromRawKey(privateKey, password);
  }

}
