import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Globals} from '../globals'
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-send-tx',
  templateUrl: './send-tx.component.html',
  styleUrls: ['./send-tx.component.css']
})
export class SendTxComponent implements OnInit {

  step: string = "send";

  txForm: FormGroup;
  showPK: boolean;
  eyeIcon: string = "remove_red_eye";
  fromAccount: any;
  @ViewChild('balance') balance;
  sending: boolean = false;
  receipt: Map<string,any>;

  // Contract stuff
  contract: any;
  func: any;
  functionResult: any;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService, private globals: Globals) {
    this.createForm();
  }

  ngOnInit() {
    this.onChanges();
    this.updateBalance(); // help for dev if pk already set. 
  }

  createForm() {
    this.txForm = this.fb.group({
      // from: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ], // can use this updateOn thing on the entire formgroup too
      privateKey: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ],
      to: ['', []],
      amount: ['', [] ],
      byteCode: [''],
      gasLimit: ['300000', []],
      contractAddress: ['', []], // '0x5890624F8A95E808F6ba4258217e2709Ab56dA4C', []],
      contractABI: ['', []],
      contractFunction: ['']
    });
  }

  togglePKView() {
    if (this.showPK) {
      // hide it
      this.showPK = false;
      this.eyeIcon = "remove_red_eye"
    } else {
      this.showPK = true;
      this.eyeIcon = "remove_red_eye_outline" // this isn't working... :(
    }
  }

  onChanges(): void {
    this.txForm.get('privateKey').valueChanges.subscribe(val => {
      console.log("changed", val);
      this.fromAccount = null;
      this.balance.reset();
      this.updateBalance();
    });
    this.txForm.get('contractAddress').valueChanges.subscribe(val => {
      console.log("contract address", val);
      this.updateContractInfo();
    });
    this.txForm.get('contractABI').valueChanges.subscribe(val => {
      // console.log("contract ABI", val);
      this.updateContractInfo();
    });
    this.txForm.get('contractFunction').valueChanges.subscribe(val => {
      console.log("contract function:", val);
      this.loadFunction(); 
    });
  }

  updateContractInfo(): void {
    let ca = this.txForm.get('contractAddress').value;
    if (ca.length == 42) {
      // parse the abi
      let abi = this.txForm.get('contractABI').value;
      if (abi.length > 0) {
        try {
          abi = JSON.parse(abi);
        } catch(e) {
          console.log("parse error:", e);
          return;
        }
        console.log("parsed:", abi);
        let web3 = this.walletService.w3();
        this.contract = new web3.eth.Contract(abi, ca);
        console.log("contract", this.contract);
        console.log("jsonint", this.contract.options.jsonInterface);
      }
    }
  }

  funcsToSelect(): string[] {
    let ret: string[] = [];
    let abi = this.contract.options.jsonInterface;
    // console.log("abi:", abi);
    for (let i = 0; i < abi.length; i++) {
      let func = abi[i];
      if (func.type === "function"){
        ret.push(func);
      }
    }
    return ret;
  }

  loadFunction(): void {
    let fname = this.txForm.get('contractFunction').value;
    console.log("fname:", fname);
    let abi = this.contract.options.jsonInterface;
    // console.log("abi:", abi);
    for (let i = 0; i < abi.length; i++) {
      let func = abi[i];
      console.log("func:", func);
      if (func.name === fname) {
        this.func = func;
        // TODO: IF ANY INPUTS, add a sub formgroup 
        if (func.constant) {
          // if constant, just show value
          // There's a bug in the response here: https://github.com/ethereum/web3.js/issues/1566
          // So doing it myself... :frowning:
          let m = this.contract.methods[func.name + "()"]();
          console.log("method:", m);
          console.log("m.encode:", m.encodeABI());
          // m.call({
          //   from: this.fromAccount.address,
          //   gasPrice: "2",
          //   gas: "50000"
          // })
          // .then(function(result){
          //   console.log("result:", result);
          //   this.functionResult = result;
          // });
          // 
          // manually doing above:
          let web3 = this.walletService.w3();
          let funcABI = web3.eth.abi.encodeFunctionCall(func, []);
          console.log("funcABI:", "" + funcABI);
          web3.eth.call({
            to: this.contract.options.address,
            data: "" + funcABI
          }).then(result => {
            console.log("result:", result);
            let decoded = web3.eth.abi.decodeLog(func.outputs, result, []);
            console.log("decoded:", decoded);
            // This Result object is frikin stupid, it's literaly an empty object that they add fields too
            // convert to something iterable
            let arrR: Array<Array<any>> = new Array<Array<any>>();
            // let mapR: Map<any,any> = new Map<any,any>();
            // for (let j = 0; j < decoded.__length__; j++){
            //   mapR.push([decoded[0], decoded[1]])
            // }
            Object.keys(decoded).forEach(function(key,index){
              // mapR[key] = decoded[key];
              if (key.startsWith("__")) {
                return;
              }
              arrR.push([key,decoded[key]]);
            })
            console.log("mapR:", arrR);
            this.functionResult = arrR;
          }).catch(err => console.log(err));


          // let tx = {
          //   // from: this.fromAccount.address,
          //   to: this.txForm.get('contractAddress').value,
          //   data: m.encodeABI(),
          //   gas: '2000000'
          // }
          // this.sendAndWait(this.fromAccount.privateKey, tx)
        }
        break;
      }
    }
  }

  setStep(step: string) {
    this.step = step;
    this.updateValidators();

  }

  updateValidators(): void {
    if (this.step === 'send') {
      console.log("setting send validators")
      this.txForm.get('byteCode').setValidators(null);
      this.txForm.get('byteCode').updateValueAndValidity();
      this.txForm.get('gasLimit').setValidators(null);
      this.txForm.get('gasLimit').updateValueAndValidity();

      this.txForm.get('to').setValidators([Validators.required]);
      this.txForm.get('to').updateValueAndValidity();
      this.txForm.get('amount').setValidators([Validators.required, Validators.min(0.00000001)]);
      this.txForm.get('amount').updateValueAndValidity();
    }
    if (this.step === 'deploy') {
      console.log("setting deploy validators")
      this.txForm.get('to').setValidators(null);
      this.txForm.get('to').updateValueAndValidity();
      this.txForm.get('amount').setValidators(null);
      this.txForm.get('amount').updateValueAndValidity();

      this.txForm.get('byteCode').setValidators([Validators.required]);
      this.txForm.get('byteCode').updateValueAndValidity();
      this.txForm.get('gasLimit').setValidators([Validators.required]);
      this.txForm.get('gasLimit').updateValueAndValidity();
    }
  }

  validate(): boolean {
    // if send tx, then to and amount are required
    // if (this.step === 'send') {
    //   if(this.txForm.get('to').value.length === 0){
    //     this.txForm.get('to').addE = true;
    //   }
    // }
    // if deploying contract, then byteCode and gasLimit are required
    return true;
  }

  updateBalance(): void {
    let pk = this.txForm.get('privateKey').value;

    if (pk.length === 64) {
      if (pk.indexOf('0x') !== 0) {
        pk = '0x' + pk;
        this.txForm.get('privateKey').setValue(pk);
      }
    }
    let addr = null;
    if (pk.length === 66){
      try {
        this.fromAccount = this.walletService.w3().eth.accounts.privateKeyToAccount(pk);
        addr = this.fromAccount.address;
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return;
      }
    }
    if (pk.length == 42) {
      // maybe it's an address
      addr = pk;
    }
    if (addr != null) {
      this.balance.update(addr);
    }
  }

  sendTx(): void {
    if (this.txForm.invalid) {
      return;
    }
    this.receipt = null;

    if(!this.validate()){
      return;
    }

    let pk = this.txForm.get('privateKey').value;  
    
    this.sending = true;
    let tx = null;
    
    if (this.step === 'deploy') {
      let byteCode = this.txForm.get('byteCode').value;
      tx = {data: byteCode, gas: '2000000'}
    } else {
      let to = this.txForm.get('to').value;
      if (!this.walletService.isAddress(to)){
        console.error('ERROR: Invalid TO address.');
        this.messageService.add('ERROR: Invalid TO address.');
        return;
      }
      let amount = this.txForm.get('amount').value;
      // now send tx
      try {
        amount = this.walletService.w3().utils.toWei(amount, 'ether')
      } catch(e) {
        // todo: try catch this whole function?
        this.messageService.add('ERROR: ' + e);
        this.sending = false;
        return;
      }
      tx = {to: to, value: amount, gas: '2000000'}
    }
    this.sendAndWait(pk, tx)
  }

  sendAndWait(pk: string, tx: any) {
    this.walletService.sendTx(
      pk,
      tx
    ).subscribe(receipt => {
      console.log("component got receipt:", receipt);
      this.receipt = receipt;
      this.balance.update(pk);
    },
    err => {
      console.error('ERROR:', err);
      this.messageService.add("ERROR! " + err);
    },
    () => {
      this.sending = false;
    })
  }

  public explorerHost() {
    return this.globals.explorerHost();
  }

}
