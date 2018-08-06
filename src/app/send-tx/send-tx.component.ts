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
  fromAccount: any;
  // balance: string;
  sending: boolean = false;
  receipt: Map<string,any>;

  @ViewChild('balance') balance;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService, private globals: Globals) {
    this.createForm();
  }

  ngOnInit() {
    this.onChanges();
  }

  createForm() {
    this.txForm = this.fb.group({
      // from: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ], // can use this updateOn thing on the entire formgroup too
      privateKey: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ],
      to: ['', []],
      amount: ['', [] ],
      byteCode: [''],
      gasLimit: ['300000', []]
    });
  }


  onChanges(): void {
    this.txForm.get('privateKey').valueChanges.subscribe(val => {
      console.log("changed", val);
      this.fromAccount = null;
      this.balance.reset();
      this.updateBalance();
    });
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

  updateBalance(): void{
    let pk = this.txForm.get('privateKey').value;

    if (pk.length === 64) {
      if (pk.indexOf('0x') !== 0) {
        pk = '0x' + pk;
        this.txForm.get('privateKey').setValue(pk);
      }
    }
    if (pk.length === 66){
      try {
        this.fromAccount = this.walletService.w3().eth.accounts.privateKeyToAccount(pk);
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return;
      }
      this.balance.update(this.txForm.get('privateKey').value);
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
