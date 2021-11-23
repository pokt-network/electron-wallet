import { HttpRpcProvider, Pocket, RpcError } from '@pokt-network/pocket-js';
import { RPCController } from './rpc-controller';

describe('RPCController class tests', () => {

  let rpcController: RPCController;

  beforeEach(() => {
    const dispatcher = new URL('https://some-node.com');
    const pocket = new Pocket([dispatcher], new HttpRpcProvider(dispatcher));
    rpcController = new RPCController(pocket);
  });

  test('RPCController.getBalance() should get the balance of an address', async () => {

    const address = 'someaddress';
    const balanceString = '1000';

    // mock the pocket.rpc.query.getBalance function to return a valid response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getBalance: () => Promise.resolve({isValid: () => true, balance: BigInt(balanceString)})}});

    const successfulRes = await rpcController.getBalance(address);
    expect(successfulRes.toString()).toEqual(balanceString);

    // mock the pocket.rpc.query.getBalance function to return an error response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getBalance: () => Promise.resolve(RpcError({code: '1234', message: 'something'}))}});

    await expect(rpcController.getBalance(address)).rejects.toThrow();

  });

  test('RPCController.getTransaction() should get transaction data', async () => {

    const txHash = 'sometransactionhash';
    const transaction = {
      hash: txHash,
    };

    // mock the pocket.rpc.query.getTX function to return a valid response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getTX: () => Promise.resolve({isValid: () => true, transaction})}});

    const successfulRes = await rpcController.getTransaction(txHash);
    expect(successfulRes.hash).toEqual(txHash);

    // mock the pocket.rpc.query.getTX function to return an error response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getTX: () => Promise.resolve(RpcError({code: '1234', message: 'something'}))}});

    await expect(rpcController.getTransaction(txHash)).rejects.toThrow();

  });

  test('RPCController.getAccountTransactions() should get account transactions', async () => {

    const expectedResponse = {
      transactions: [
        {hash: 'somehash'},
        {hash: 'anotherhash'},
      ],
      totalCount: 10
    }

    const address = 'someaddress';

    // mock the pocket.rpc.query.getAccountTxs function to return a valid response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getAccountTxs: () => Promise.resolve({isValid: () => true, transactions: expectedResponse.transactions, totalCount: expectedResponse.totalCount})}});

    const successfulRes = await rpcController.getAccountTransactions(address, true,  false);
    expect(successfulRes.totalCount).toEqual(expectedResponse.totalCount);
    expectedResponse.transactions.forEach(t => successfulRes.transactions.some(tt => tt.hash === t.hash));

    // mock the pocket.rpc.query.getAccountTxs function to return an error response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getAccountTxs: () => Promise.resolve(RpcError({code: '1234', message: 'something'}))}});

    await expect(rpcController.getAccountTransactions(address, true,  false)).rejects.toThrow();

  });

  test('RPCController.getNode() should get a node\'s information', async () => {

    const address = 'someaddress';

    // mock the pocket.rpc.query.getNode function to return a valid response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getNode: () => Promise.resolve({isValid: () => true, node: {address}})}});

    const successfulRes = await rpcController.getNode(address);
    expect(successfulRes.address).toEqual(address);

    // mock the pocket.rpc.query.getNode function to return an error response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getNode: () => Promise.resolve(RpcError({code: '1234', message: 'something'}))}});

    await expect(rpcController.getNode(address)).rejects.toThrow();

  });

  test('RPCController.getApp() should get an app\'s information', async () => {

    const address = 'someaddress';

    // mock the pocket.rpc.query.getApp function to return a valid response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getApp: () => Promise.resolve({isValid: () => true, application: {address}})}});

    const successfulRes = await rpcController.getApp(address);
    expect(successfulRes.address).toEqual(address);

    // mock the pocket.rpc.query.getApp function to return an error response
    // @ts-ignore
    rpcController._pocket.rpc = () => ({query: {getApp: () => Promise.resolve(RpcError({code: '1234', message: 'something'}))}});

    await expect(rpcController.getApp(address)).rejects.toThrow();

  });

  test('RPCController.sendRawTx() should send a raw transaction', async () => {
    // ToDo implement test functionality
  });

});
