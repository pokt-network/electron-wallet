import { Localize } from './localize';

describe('Localize class tests', () => {

  const locale = 'en-US';
  const localeData = {
    'OK': {
      'universal': {
        val: 'OK'
      }
    },
    'Hello, {{name}}!': {
      'start': {
        val: 'Hello, {{name}}!',
      }
    },
  };
  let localize: Localize;

  beforeEach(() => {
    localize = new Localize(locale, localeData);
  });

  test('Localize.locale() should return the locale', () => {
    expect(localize.locale()).toEqual(locale);
  });

  test('Localize.text() should return a localized string', () => {
    expect(localize.text('some unknown key', 'universal')).toEqual('some unknown key');
    expect(localize.text('OK', 'some unknown context')).toEqual('OK');
    expect(localize.text('OK', 'universal')).toEqual('OK');
    expect(localize.text('Hello, {{name}}!', 'start', {name: 'Jill'})).toEqual('Hello, Jill!');
  });

  test('Localize.number() should return a localized number', () => {
    expect(localize.number(2.3)).toEqual('2.3');
    expect(localize.number(1000)).toEqual('1000');
    expect(localize.number(1000, {useGrouping: true})).toEqual('1,000');
    localize = new Localize('de', localeData);
    expect(localize.number(2.3)).toEqual('2,3');
    expect(localize.number(1000, {useGrouping: true})).toEqual('1.000');
  });

  test('Localize.compare() should sort according to locale', () => {
    expect(localize.compare('c', 'c')).toEqual(0);
    expect(localize.compare('b', 'c')).toEqual(-1);
    expect(localize.compare('c', 'b')).toEqual(1);
    expect(localize.compare(0, 'c')).toEqual(0); // bad input
    // sorting strings
    const unsortedStrs = ['b', 'b', 'a', 'c'];
    const sortedStrs = [...unsortedStrs]
      .sort(localize.compare);
    expect(sortedStrs[0]).toEqual('a');
    expect(sortedStrs[1]).toEqual('b');
    expect(sortedStrs[2]).toEqual('b');
    expect(sortedStrs[3]).toEqual('c');
    // sorting numbers
    const unsortedNums = [2, 3, 2, 1];
    const sortedNums = [...unsortedNums]
      .sort(localize.compare);
    expect(sortedNums[0]).toEqual(1);
    expect(sortedNums[1]).toEqual(2);
    expect(sortedNums[2]).toEqual(2);
    expect(sortedNums[3]).toEqual(3);
    // sorting bigints
    const unsortedBIs = [BigInt(2), BigInt(3), BigInt(2), BigInt(1)];
    const sortedBIs = [...unsortedBIs]
      .sort(localize.compare);
    expect(sortedBIs[0]).toEqual(BigInt(1));
    expect(sortedBIs[1]).toEqual(BigInt(2));
    expect(sortedBIs[2]).toEqual(BigInt(2));
    expect(sortedBIs[3]).toEqual(BigInt(3));
  });

});
