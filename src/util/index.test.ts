import { timeout } from './index';

describe('utilility function tests', () => {

  test('timeout() should resolve after a specified number of milliseconds', async () => {

    const start = Date.now();
    const length = 1000
    await timeout(length);
    expect(Date.now() - start).toBeGreaterThanOrEqual(length);

  });

});
