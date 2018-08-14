import * as Web3 from 'web3';

let p = new (<any>Web3).providers.HttpProvider("https://testnet-rpc.gochain.io");
let web3 = new (<any>Web3)(p);
let caddress = "0x030EAd0f7C692B8c0528fb7d720df00164f1be97";
let abi = {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [
        {
            "name": "",
            "type": "string"
        }
    ]
}
let sig = web3.eth.abi.encodeFunctionCall(abi, [])
console.log(sig);

web3.eth.call({
    to: caddress,
    data: sig
  }).then(result => {
    console.log("result:", result);
    // this.functionResult = result;
    let decoded = web3.eth.abi.decodeLog(abi.outputs, result, []);
    console.log("decoded:", decoded);

  }).catch(err => console.log(err));

