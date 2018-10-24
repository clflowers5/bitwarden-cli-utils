export interface Credentials {
  username: string;
  password: string;
}

export interface BitwardenUri {
  match: any;
  uri: string;
}

export interface BitwardenPasswordHistory {
  lastUsedDate: string;
  password: string;
}

export interface BitwardenUriCollection extends Array<BitwardenUri> {}

export interface BitwardenPasswordHistoryCollection
  extends Array<BitwardenPasswordHistory> {}

export interface BitwardenItem {
  object: string;
  id: string;
  organizationId: string | null;
  folderId: string | null;
  type: number;
  name: string;
  notes: any;
  favorite: boolean;
  login: {
    uris: BitwardenUriCollection;
    username: string;
    password: string;
    totp: any;
    passwordRevisionDate: string;
  };
  revisionDate: string;
  passwordHistory: BitwardenPasswordHistoryCollection;
}
