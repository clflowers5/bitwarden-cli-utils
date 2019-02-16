# Bitwarden CLI Utils

[![Build Status](https://travis-ci.com/clflowers5/bitwarden-cli-utils.svg?branch=master)](https://travis-ci.com/clflowers5/bitwarden-cli-utils)
[![codecov](https://codecov.io/gh/clflowers5/bitwarden-cli-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/clflowers5/bitwarden-cli-utils)

## Overview
Simple wrapper for the Bitwarden CLI to allow for easy retrieval and (eventually) management of credentials.

The project is written in TypeScript and compiled with declarations to a target of ES2015.

## Security
Security of your Bitwarden Username and Password should be a big deal, that's the keys to the kingdom!

`BitwardenUser` manages the `sessionKey` returned from a successful login for you for convenience. Any subsequent commands will append the `--session` option to the command so you don't have to worry about handling it.

## Documentation

### `BitwardenUser`
Named export from `bitwarden-cli-utils`.

* `constructor(username: string, password: string)`
  * Bitwarden Username and Password. Stored as private instance variables.

```typescript
import { BitwardenUser } from 'bitwarden-cli-utils';

const user = new BitwardenUser('myUsername', 'myPassword');
```

* `public async login(): Promise<void>`
  * Attempts to login using the previously provided username and password.
  * Throws/Rejects with error if login fails.

```typescript
await user.login();
```

* `public async logout(): Promise<void>`
  * Attempts to logout a session.
  * Throws/Rejects with error if logout fails.

```typescript
await user.logout();
```

* `public async getItem(subject: string): Promise<BitwardenItem>`
  * Retrieves the entire Bitwarden Object specified by the subject.
  * View `types.ts` for `BitwardenItem` interface definition.
  * Throws/Rejects with error if subject cannot be identified or is ambiguous (returns multiple items).

```typescript
const result = await user.getItem('google');
```

* `public async getCredentials(subject: string): Promise<Credentials>`
  * Retrieves a simplified credentials object for the specified subject.
  * Contains username and password.
  * View `types.ts` for `Credentials` interface definition.
  * Throws/Rejects with error if subject cannot be identified or is ambiguous (returns multiple items).

```typescript
const result = await user.getCredentials('google');
```