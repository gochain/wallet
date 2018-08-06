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
      to: ['', Validators.required ],
      amount: ['', [Validators.required, Validators.min(0.00000001)] ]
    });
  }


  onChanges(): void {
    this.txForm.get('privateKey').valueChanges.subscribe(val => {
      console.log("changed", val);
      this.balance.reset();
      this.updateBalance();
    });
  }

  updateBalance(): void{
    let val = this.txForm.get('privateKey').value;

    if (val.length === 64) {
      if (val.indexOf('0x') !== 0) {
        val = '0x' + val;
        this.txForm.get('privateKey').setValue(val);
      }
    }
    if (val.length === 66){
      this.balance.update(this.txForm.get('privateKey').value);
    }
  }

  sendTx(): void {
    if (this.txForm.invalid) {
      return
    }
    this.receipt = null;
    let to = this.txForm.get('to').value;
    if (!this.walletService.isAddress(to)){
      console.error('ERROR: Invalid TO address.');
      this.messageService.add('ERROR: Invalid TO address.');
      return;
    }
    this.sending = true;
    let pk = this.txForm.get('privateKey').value;
    this.walletService.sendTx(
      pk,
      to,
      this.txForm.get('amount').value
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
