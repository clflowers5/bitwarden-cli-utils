import parseJsonFromString from './../../src/jsonHelpers/parseJsonFromString';

describe('parseJsonFromString', () => {
  it('throws if string cannot be parsed to json', () => {
    expect(() => parseJsonFromString('abc123')).toThrowError();
  });

  it('parses valid string json and returns json object', () => {
    expect(
      parseJsonFromString('{ "a": "123", "b": 55, "c": "hello" }')
    ).toEqual({
      a: '123',
      b: 55,
      c: 'hello'
    });
  });
});
