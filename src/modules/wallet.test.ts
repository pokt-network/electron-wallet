import { Wallet } from './wallet';
import * as uuid from 'uuid';
import { RpcError } from '@pokt-network/pocket-js';
import { RPCController } from './rpc-controller';

jest.mock('./rpc-controller', );

describe('Wallet class tests', () => {

  let wallet: Wallet;

  beforeEach(() => {
    const walletData = {
      name: uuid.v4(),
      publicKey: uuid.v4(),
      privateKeyEncrypted: uuid.v4(),
      address: uuid.v4(),
    };
    // @ts-ignore
    wallet = new Wallet(walletData, new RPCController());
  });

  test('Wallet.setName() should update the wallet\'s name', () => {
    const newName = 'some new name';
    wallet.setName(newName);
    expect(wallet.name).toEqual(newName)
  });

  test('Wallet.updateBalance() should update the wallet\'s balance', async () => {
    let errorEventCalled = false;
    wallet.events.error.subscribe(() => {
      errorEventCalled = true;
    });
    let changeEventCalled = false;
    wallet.events.change.subscribe(() => {
      changeEventCalled = true;
    });

    const balanceString = '1000';

    // @ts-ignore
    wallet._rpcController.getBalance.mockResolvedValue(BigInt(balanceString));

    const successfulUpdate = await wallet.updateBalance();
    expect(successfulUpdate).toEqual(true);
    expect(wallet.balance.toString()).toEqual(balanceString);
    expect(errorEventCalled).toEqual(false);
    expect(changeEventCalled).toEqual(true);

    // @ts-ignore
    wallet._rpcController.getBalance.mockRejectedValue(new RpcError('100', 'something'));

    errorEventCalled = false;
    changeEventCalled = false;
    const failedUpdate = await wallet.updateBalance();
    expect(failedUpdate).toEqual(false);
    expect(wallet.balance.toString()).toEqual(balanceString);
    expect(errorEventCalled).toEqual(true);
    expect(changeEventCalled).toEqual(false);
  });

});
