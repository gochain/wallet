# Wallet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## NOTE: YOU NEED TO MODIFY WEB3 SLIGHTLY TO MAKE THIS WORK

After `npm install`, edit web3/index.d.ts, change it to:

```ts
import * as t from './types.d'

export default class Web3 {
  static providers: t.Providers
  static givenProvider: t.Provider
  static modules: {
    Eth: new (provider: t.Provider) => t.Eth
    Net: new (provider: t.Provider) => t.Net
    Personal: new (provider: t.Provider) => t.Personal
    Shh: new (provider: t.Provider) => t.Shh
    Bzz: new (provider: t.Provider) => t.Bzz
  }
  constructor(provider?: t.Provider | string)
  version: string
  BatchRequest: new () => t.BatchRequest
  extend(methods: any): any // TODO
  bzz: t.Bzz
  currentProvider: t.Provider
  eth: t.Eth
  ssh: t.Shh
  givenProvider: t.Provider
  providers: t.Providers
  setProvider(provider: t.Provider): void
  utils: t.Utils
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
