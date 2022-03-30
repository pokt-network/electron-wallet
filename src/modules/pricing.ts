import request from 'superagent';
import * as math from 'mathjs';

export class Pricing {

  static currencies = ['USD'];
  static async getPricingData(currencies: string[] = Pricing.currencies): Promise<{[key: string]: number}> {
    const data: {[key: string]: number} = {};
    for(let i = 0; i < currencies.length; i++) {
      // https://min-api.cryptocompare.com/data/price?fsym=POKT&tsyms=USD
      try {
        const currency = currencies[i];
        const { body } = await request
          .get('https://api.coingecko.com/api/v3/coins/pocket-network')
          .timeout(10000);
        data[currency] = body.market_data.current_price[currency.toLowerCase()];
      } catch(err) {
        // do nothing with error
      }
    }
    return data;
  }

  _pricingData: {[key: string]: number};

  constructor(pricingData: {[key: string]: number}) {
    this._pricingData = pricingData;
  }

  convert(amount: math.BigNumber, currency: string): string {
    try {
      const pricingData = this._pricingData;
      if(!pricingData[currency])
        return '0';
      return math.multiply(amount, math.bignumber(pricingData[currency])).toString();
    } catch(err) {
      return '0';
    }
  }

}
