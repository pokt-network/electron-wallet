import { escapeRegExp } from 'lodash';

export class Localize {

  _locale: string;
  _localeData: any;
  _collator: Intl.Collator;

  constructor(locale: string, localeData: any) {
    this._locale = locale;
    this._localeData = localeData;
    this._collator = new Intl.Collator(locale);
    this.compare = this.compare.bind(this);
  }

  locale(): string {
    return this._locale;
  }

  text(key: string, context: string, replacers = {}): string {
    const { _localeData: localeData } = this;
    let val = localeData[key] && localeData[key][context] ? localeData[key][context].val : key;
    val = Object.keys(replacers).reduce((str, k) => {
      const patt = new RegExp(`{{${escapeRegExp(k)}}}`, 'g');
      // @ts-ignore
      return str.replace(patt, replacers[k]);
    }, val);
    return val;
  }

  number(num: number|BigInt = 0, options = {useGrouping: false}): string {
    return num.toLocaleString(this._locale, options);
  }

  compare(a: string|number|BigInt, b: string|number|BigInt): number {
    if(typeof a === 'string' && typeof b === 'string')
      return this._collator.compare(a, b);
    else if((typeof a === 'number' && typeof b === 'number') || (typeof a === 'bigint' && typeof b === 'bigint'))
      return a === b ? 0 : a > b ? 1 : -1;
    else
      return 0;
  }

}
