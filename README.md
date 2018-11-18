# GoChain Wallet

The Official GoChain Wallet.

Live at https://wallet.gochain.io

## Getting setup locally

```sh
npm install -g @angular/cli
npm install
make run
```

## Development server

Run `make run` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Creating a docker container to run locally

```sh
docker build -t wallet .
docker run -p 80:80 wallet
```
