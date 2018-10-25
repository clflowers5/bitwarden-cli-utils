import asycExec from './cli/asyncExec';
import throwIfPresent from './errorHelpers/throwIfPresent';
import parseJsonFromString from './jsonHelpers/parseJsonFromString';
import { BitwardenItem, Credentials } from './types';
import { NPX_NO_INSTALL } from './cli/npxCommands';

class BitwardenUser {
  private static SESSION_REGEX = /BW_SESSION="(.*?)"/;

  private sessionKey: string = '';

  constructor(private username: string, private password: string) {}

  public async login(): Promise<void> {
    const response = await this.executeBitwardenCommand(
      `login ${this.username} ${this.password}`
    );
    this.sessionKey = this.parseSessionKey(response);
  }

  public async logout(): Promise<void> {
    await this.executeBitwardenCommand('logout');
  }

  public async getItem(subject: string): Promise<BitwardenItem> {
    const response = await this.executeBitwardenCommand(`get item ${subject}`);
    return parseJsonFromString(response) as BitwardenItem;
  }

  public async getCredentials(subject: string): Promise<Credentials> {
    const item = await this.getItem(subject);
    return {
      username: item.login.username,
      password: item.login.password
    };
  }

  private async executeBitwardenCommand(command: string): Promise<string> {
    const { stdout, stderr } = await asycExec(
      `${NPX_NO_INSTALL} bw ${command} ${this.buildSessionArgument()}`.trim()
    );
    throwIfPresent(stderr);
    return stdout;
  }

  private buildSessionArgument(): string {
    return this.sessionKey ? `--session ${this.sessionKey}` : '';
  }

  private parseSessionKey(response: string): string {
    const result = BitwardenUser.SESSION_REGEX.exec(response);
    if (Array.isArray(result) && result[1]) {
      return result[1];
    } else {
      throw new Error(
        `Failed to extract session key from input: ${JSON.stringify(response)}`
      );
    }
  }
}

export default BitwardenUser;
