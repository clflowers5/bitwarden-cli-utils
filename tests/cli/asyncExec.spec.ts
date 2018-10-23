describe('asyncExec', () => {
  let execMock: jest.Mock;
  let promisifyMock: jest.Mock;

  beforeEach(() => {
    execMock = jest.fn();
    promisifyMock = jest.fn();

    jest.mock('util', () => ({ promisify: promisifyMock }));
    jest.mock('child_process', () => ({ exec: execMock }));
  });

  it('wraps exec with promisify', () => {
    const sut = require('../../src/cli/asyncExec');
    expect(promisifyMock).toHaveBeenCalledWith(execMock);
  });
});
