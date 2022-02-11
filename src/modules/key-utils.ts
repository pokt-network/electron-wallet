import { Account, Pocket } from '@pokt-network/pocket-js';
import { isError } from 'lodash';
import { Subject } from 'rxjs';
import * as uuid from 'uuid';

export class KeyUtils {

  events = {
    error: new Subject<string>(),
  };

  _pocket: Pocket;

  constructor(pocket: Pocket) {
    this._pocket = pocket;
    {
      const password = 'something';
      for(let i = 0; i < 5; i++) {
        this._pocket.keybase.createAccount(password)
          .then(res => {
            if(isError(res)) {
              console.error(res);
            } else {
              const { addressHex } = res;
              this._pocket.keybase.getUnlockedAccount(addressHex, password)
                .then(res1 => {
                  if(isError(res1)) {
                    console.error(res1);
                  } else {
                    console.log('new private key', res1.privateKey.toString('hex'));
                    // this._pocket.keybase.exportPPK(res1.privateKey.toString('hex'), password)
                    //   .then(res2 => {
                    //     if(isError(res2)) {
                    //       console.error(res2);
                    //     } else {
                    //       console.log(res2);
                    //     }
                    //   })
                    //   .catch(console.error);
                  }
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }
    }
  }

  async createAcount(password: string): Promise<Account | null> {
    const res = await this._pocket.keybase.createAccount(password);
    if(isError(res)) {
      this.events.error.next('KeyUtils.createAccount() ' + res.message + '\n' + res.stack);
      return null;
    }
    return res;
  }

  async importAccountFromPPK(password: string, ppkJson: string, ppkPassword: string): Promise<Account | null> {
    const res = await this._pocket.keybase.importPPKFromJSON(ppkPassword, ppkJson, password);
    if(isError(res)) {
      this.events.error.next('KeyUtils.importAccountFromPPK() ' + res.message + '\n' + res.stack);
      return null;
    }
    return res;
  }

  async importAccountFromRawPrivateKey(password: string, rawPrivateKey: string): Promise<Account | null> {
    const res = await this._pocket.keybase.importAccount(Buffer.from(rawPrivateKey, 'hex'), password);
    if(isError(res)) {
      this.events.error.next('KeyUtils.importAccountRawPrivateKey() ' + res.message + '\n' + res.stack);
      return null;
    }
    return res;
  }

}
