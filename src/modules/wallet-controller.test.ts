import { WalletController } from './wallet-controller';
import { HttpRpcProvider, Pocket } from '@pokt-network/pocket-js';
import { KeyUtils } from './key-utils';
import * as uuid from 'uuid';
import { Wallet } from './wallet';
import { RPCController } from './rpc-controller';

const generateWalletData = () => ({
  name: uuid.v4(),
  publicKey: uuid.v4(),
  privateKeyEncrypted: uuid.v4(),
  address: uuid.v4(),
});

describe('WalletController class tests', () => {

  const dispatcher = new URL('https://some-node.provider.com');
  const pocket = new Pocket([dispatcher], new HttpRpcProvider(dispatcher));
  const rpcController = new RPCController(pocket);

  let walletController: WalletController;

  beforeEach(() => {
    walletController = new WalletController(new KeyUtils(pocket), rpcController);
  });

  test('WalletController.addWallet() should add a wallet to the wallets', async () => {
    let walletsChangedEventCalled = false;
    walletController.events.walletsChanged.subscribe(() => {
      walletsChangedEventCalled = true;
    });
    expect(walletController._wallets.length).toEqual(0);
    const walletData = generateWalletData();
    walletController.addWallet(walletData);
    expect(walletController._wallets.length).toEqual(1);
    const idx = walletController._wallets.findIndex(w => w.publicKey === walletData.publicKey);
    expect(idx).toEqual(0);
    expect(walletController._wallets[idx].publicKey).toEqual(walletData.publicKey);
    expect(walletsChangedEventCalled).toEqual(true);
  });

  test('WalletController.createWallet() should create a wallet and add it to the wallets', async () => {
    let walletsChangedEventCalled = false;
    walletController.events.walletsChanged.subscribe(() => {
      walletsChangedEventCalled = true;
    });
    let walletCreatedEventCalled = false;
    walletController.events.walletCreated.subscribe(() => {
      walletCreatedEventCalled = true;
    });
    const name = 'some wallet name';
    const publicKey = await walletController.createWallet(name, 'some password');
    expect(typeof publicKey).toEqual('string');
    expect(publicKey.length).toBeGreaterThan(0);
    expect(walletController._wallets.length).toEqual(1);
    expect(walletController._wallets[0].publicKey).toEqual(publicKey);
    expect(walletController._wallets[0].name).toEqual(name);
    expect(walletCreatedEventCalled).toEqual(true);
    expect(walletsChangedEventCalled).toEqual(true);
  });

  test('WalletController.deleteWallet() should delete a wallet from the wallets', async () => {
    let walletsChangedEventCalled = false;
    walletController.events.walletsChanged.subscribe(() => {
      walletsChangedEventCalled = true;
    });
    let walletDeletedEventCalled = false;
    walletController.events.walletDeleted.subscribe(() => {
      walletDeletedEventCalled = true;
    });
    const walletData = generateWalletData();
    const wallet = new Wallet(walletData, rpcController);
    walletController._wallets.push(wallet);
    const unsuccessfulDelete = walletController.deleteWallet('nonexistentpublickey');
    expect(unsuccessfulDelete).toEqual(false);
    expect(walletDeletedEventCalled).toEqual(false);
    expect(walletsChangedEventCalled).toEqual(false);
    const successfulDelete = walletController.deleteWallet(wallet.publicKey);
    expect(successfulDelete).toEqual(true);
    expect(walletController._wallets.length).toEqual(0);
    expect(walletDeletedEventCalled).toEqual(true);
    expect(walletsChangedEventCalled).toEqual(true);
  });

});
