# Test Scripts

These are some simple scripts to play around with web3 and things without having to use the UI.

Run with:

```sh
tsc encode.ts && node encode.js
```

Can also compare against direct JSON-RPC calls, eg: this does a call using the encoded function from the encode.ts script.

```sh
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to": "0x030EAd0f7C692B8c0528fb7d720df00164f1be97", "data":"0x06fdde03"}, "latest"],"id":1}'  https://testnet-rpc.gochain.io
```
