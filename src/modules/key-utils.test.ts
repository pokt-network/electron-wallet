import { KeyUtils } from './key-utils';
import { Account, Pocket } from '@pokt-network/pocket-js';

describe('KeyUtils class tests', () => {

  let keyUtils: KeyUtils;

  beforeEach(() => {
    const pocket = new Pocket([new URL('http://somenode.something')]);
    keyUtils = new KeyUtils(pocket);
  });

  test('KeyUtils.createAccount() should create an Account', async () => {
    const pocket = new Pocket([new URL('http://somenode.something')]);
    let loggedError = '';
    const keyUtils = new KeyUtils(pocket);
    keyUtils.events.error.subscribe(message => {
      loggedError = message;
    });
    const goodAccount = await keyUtils.createAcount('password');
    // @ts-ignore
    expect(goodAccount).toBeInstanceOf(Account);
    expect(loggedError.length).toEqual(0);
    const badAccount = await keyUtils.createAcount('');
    expect(badAccount).toBeNull()
    expect(loggedError.length).toBeGreaterThan(0);
  });

});
