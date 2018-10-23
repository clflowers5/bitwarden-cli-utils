import * as index from '../src/index';

describe('index', () => {
  it('exposes BitwardenUser as a named export', () => {
    expect(new index.BitwardenUser('', '')).toBeInstanceOf(index.BitwardenUser);
  });
});
