import { Wallet, WalletData } from './wallet';
import { KeyUtils } from './key-utils';
import { Subject } from 'rxjs';
import { RPCController } from './rpc-controller';
import { makePassword } from '../util';
import { CoinDenom, Pocket, Transaction } from "@pokt-network/pocket-js";
import { isError } from "lodash";

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
    return walletData.publicKey;
  }

  async importWalletFromPPK(name: string, ppkJson: string, ppkPassword: string, password = makePassword()): Promise<string> {
    const account = await this._keyUtils.importAccountFromPPK(password, ppkJson, ppkPassword);
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
    if(this._wallets.some(w => w.address === walletData.address))
      return '';
    this.addWallet(walletData, true);
    return walletData.publicKey;
  }

  async importWalletFromRawPrivateKey(name: string, rawPrivateKey: string, password = makePassword()): Promise<string> {
    const account = await this._keyUtils.importAccountFromRawPrivateKey(password, rawPrivateKey);
    if(!account)
      return '';
    const ppk = await this._keyUtils.getPPK(password, account.addressHex);
    const walletData = {
      name: name || account.addressHex.slice(0, 11),
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      ppk,
      address: account.addressHex,
    };
    if(this._wallets.some(w => w.address === walletData.address))
      return '';
    this.addWallet(walletData, true);
    return walletData.publicKey;
  }

  async getRawPrivateKeyFromWallet(publicKey: string, password: string): Promise<string> {
    const wallet = this._wallets.find(w => w.publicKey === publicKey);
    if(!wallet)
      return '';
    return this._keyUtils.getRawPrivateKeyFromPPK(password, wallet.ppk);
  }

  deleteWallet(publicKey: string): boolean {
    const idx = this._wallets.findIndex(w => w.publicKey === publicKey);
    if(idx < 0)
      return false;
    this._wallets.splice(idx, 1);
    this.events.walletDeleted.next(publicKey);
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
    const privateKey = await this.getRawPrivateKeyFromWallet(wallet.publicKey, password);
    const transactionSender = await this._pocket.withPrivateKey(privateKey);
    if(isError(transactionSender))
      return '';
    const rawTxResponse = await transactionSender
      .send(fromAddress, toAddress, (Number(amount) * 1000000).toString(10))
      .submit('testnet', '10000', CoinDenom.Upokt);
    if(isError(rawTxResponse))
      return '';
    return rawTxResponse.hash;
  }

  async getTransaction(tx: string): Promise<Transaction> {
    return await this._rpcController.getTransaction(tx);
  }

}
