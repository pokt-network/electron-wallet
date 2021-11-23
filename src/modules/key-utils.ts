import { Account, Pocket } from '@pokt-network/pocket-js';
import { isError } from 'lodash';
import { Subject } from 'rxjs';

export class KeyUtils {

  events = {
    error: new Subject<string>(),
  };

  _pocket: Pocket;

  constructor(pocket: Pocket) {
    this._pocket = pocket;
  }

  async createAcount(password: string): Promise<Account | null> {
    const res = await this._pocket.keybase.createAccount(password);
    if(isError(res)) {
      this.events.error.next('KeyUtils.generateKeyPair() ' + res.message + '\n' + res.stack);
      return null;
    }
    return res;
  }

}
