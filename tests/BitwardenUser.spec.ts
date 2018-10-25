import BitwardenUser from '../src/BitwardenUser';
import asyncExec from '../src/cli/asyncExec';

jest.mock('../src/cli/asyncExec');

describe('BitwardenUser', () => {
  let sut: BitwardenUser;

  beforeEach(() => {
    sut = new BitwardenUser('username', 'password');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can be constructed', () => {
    const constructedSut = new BitwardenUser('username', 'password');
    expect(constructedSut).toBeInstanceOf(BitwardenUser);
  });

  describe('login', () => {
    it('throws if stderr is returned', async () => {
      const errorMessage = 'oh no!';
      asyncExec.mockImplementationOnce(() => ({ stderr: errorMessage }));
      await expect(sut.login()).rejects.toThrow(new Error(errorMessage));
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw login username password');
    });

    it('throws if session key cannot be parsed', async () => {
      asyncExec.mockImplementationOnce(() => ({
        stdout: 'SESSION="abc123"'
      }));
      await expect(sut.login()).rejects.toThrow();
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw login username password');
    });

    it('resolves void on success', async () => {
      asyncExec.mockImplementationOnce(() => ({
        stdout: 'BW_SESSION="abc123"'
      }));
      await expect(sut.login()).resolves.toEqual(undefined);
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw login username password');
    });

    it('subsequent commands include "sessionKey" argument', async () => {
      const sessionKey = 'abc123';
      asyncExec.mockImplementation(() => ({
        stdout: `BW_SESSION="${sessionKey}"`
      }));
      await expect(sut.login()).resolves.toEqual(undefined);
      await expect(sut.login()).resolves.toEqual(undefined);
      expect(asyncExec.mock.calls.length).toBe(2);
      expect(asyncExec.mock.calls[0][0]).not.toContain(
        `--session ${sessionKey}`
      );
      expect(asyncExec.mock.calls[1][0]).toContain(`--session ${sessionKey}`);
    });
  });

  describe('logout', () => {
    afterEach(() => {
      expect(asyncExec.mock.calls.length).toBe(1);
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw logout');
    });

    it('throws if stderr is returned', async () => {
      const errorMessage = 'oh no!';
      asyncExec.mockImplementationOnce(() => ({ stderr: errorMessage }));
      await expect(sut.logout()).rejects.toThrow(new Error(errorMessage));
    });

    it('resolves void on success', async () => {
      asyncExec.mockImplementationOnce(() => ({}));
      await expect(sut.logout()).resolves.toEqual(undefined);
    });
  });

  describe('getItem', () => {
    afterEach(() => {
      expect(asyncExec.mock.calls.length).toBe(1);
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw get item abc');
    });

    it('throws if stderr is returned', async () => {
      const errorMessage = 'oh no!';
      asyncExec.mockImplementationOnce(() => ({ stderr: errorMessage }));
      await expect(sut.getItem('abc')).rejects.toThrow(new Error(errorMessage));
    });

    it('throws if returned item cannot be parsed to JSON object', async () => {
      const returnedItem = '{a: 123, "b": "hello", c: [notValidJson]}';
      asyncExec.mockImplementationOnce(() => ({ stdout: returnedItem }));
      await expect(sut.getItem('abc')).rejects.toThrow();
    });

    it('returns valid retrieved object', async () => {
      const returnedItem = '{"a": "abc", "b": 35, "c": [1, 2, 3]}';
      asyncExec.mockImplementationOnce(() => ({ stdout: returnedItem }));
      await expect(sut.getItem('abc')).resolves.toEqual(
        JSON.parse(returnedItem)
      );
    });
  });

  describe('getCredentials', () => {
    afterEach(() => {
      expect(asyncExec.mock.calls.length).toBe(1);
      expect(asyncExec).toHaveBeenCalledWith('npx --no-install bw get item abc');
    });

    it('throws if stderr is returned', async () => {
      const errorMessage = 'oh no!';
      asyncExec.mockImplementationOnce(() => ({ stderr: errorMessage }));
      await expect(sut.getCredentials('abc')).rejects.toThrow(
        new Error(errorMessage)
      );
    });

    it('throws if returned item cannot be parsed to JSON object', async () => {
      const returnedItem = '{a: 123, "b": "hello", c: [notValidJson]}';
      asyncExec.mockImplementationOnce(() => ({ stdout: returnedItem }));
      await expect(sut.getCredentials('abc')).rejects.toThrow();
    });

    it('returns valid retrieved credentials', async () => {
      const username = 'myLogin';
      const password = 'myPassword';
      const returnedItem = `{"login": { "username": "${username}", "password": "${password}" } }`;
      asyncExec.mockImplementationOnce(() => ({ stdout: returnedItem }));
      await expect(sut.getCredentials('abc')).resolves.toEqual({
        username: username,
        password: password
      });
    });
  });
});
