import { Wallet, WalletData } from './wallet';
import { KeyUtils } from './key-utils';
import { Subject } from 'rxjs';
import { RPCController } from './rpc-controller';
import { makePassword } from '../util';

export class WalletController {

  events = {
    error: new Subject<string>(),
    walletsChanged: new Subject<Wallet[]>(),
    walletCreated: new Subject<Wallet>(),
    walletUpdated: new Subject<Wallet>(),
    walletDeleted: new Subject<string>(),
  };

  _keyUtils: KeyUtils;
  _rpcController: RPCController;
  _wallets: Wallet[] = [];

  constructor(keyUtils: KeyUtils, rpcController: RPCController) {
    this._keyUtils = keyUtils;
    this._rpcController = rpcController;
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
    const walletData = {
      name,
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      address: account.addressHex,
    };
    this.addWallet(walletData, true);
    return walletData.publicKey;
  }

  async importWalletFromPPK(name: string, ppkJson: string, ppkPassword: string, password = makePassword()): Promise<string> {
    const account = await this._keyUtils.importAccountFromPPK(password, ppkJson, ppkPassword);
    if(!account)
      return '';
    const walletData = {
      name,
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
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
    const walletData = {
      name: name || account.addressHex.slice(0, 11),
      publicKey: account.publicKey.toString('hex'),
      privateKeyEncrypted: account.encryptedPrivateKeyHex,
      address: account.addressHex,
    };
    if(this._wallets.some(w => w.address === walletData.address))
      return '';
    this.addWallet(walletData, true);
    return walletData.publicKey;
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

}
