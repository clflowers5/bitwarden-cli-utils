import BitwardenUser from '../src/BitwardenUser';
import asyncExec from '../src/cli/asyncExec';

jest.mock('../src/cli/asyncExec');

// todo: fix tests now that sessionKey is conditionally added.
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
      expect(asyncExec).toHaveBeenCalledWith('bw login username password');
    });

    it('throws if session key cannot be parsed', async () => {
      asyncExec.mockImplementationOnce(() => ({
        stdout: 'SESSION="abc123"'
      }));
      await expect(sut.login()).rejects.toThrow();
      expect(asyncExec).toHaveBeenCalledWith('bw login username password');
    });

    it('resolves void on success', async () => {
      asyncExec.mockImplementationOnce(() => ({
        stdout: 'BW_SESSION="abc123"'
      }));
      await expect(sut.login()).resolves.toEqual(undefined);
      expect(asyncExec).toHaveBeenCalledWith('bw login username password');
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
    it('throws if stderr is returned', async () => {
      const errorMessage = 'oh no!';
      asyncExec.mockImplementationOnce(() => ({ stderr: errorMessage }));
      await expect(sut.logout()).rejects.toThrow(new Error(errorMessage));
      expect(asyncExec).toHaveBeenCalledWith('bw logout');
    });

    it('resolves void on success', async () => {
      asyncExec.mockImplementationOnce(() => ({}));
      await expect(sut.logout()).resolves.toEqual(undefined);
      expect(asyncExec).toHaveBeenCalledWith('bw logout');
    });
  });

  describe('getItem', () => {
    // todo:
  });
});
