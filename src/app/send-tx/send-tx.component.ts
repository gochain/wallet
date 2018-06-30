import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Globals} from '../globals';
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
  balance: string;
  sending: boolean = false;
  receipt: Map<string,any>;

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

    if (val.length === 66) {
      try {
        this.fromAccount = this.walletService.w3().eth.accounts.privateKeyToAccount(val);
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return
      }
      if (this.walletService.isAddress(this.fromAccount.address)){
        this.walletService.getBalance(this.fromAccount.address).subscribe(balance => {
          console.log("balance:", balance);
          this.messageService.add("Updated balance.");
          this.balance = balance;
        },
        err => {
          console.error('ERROR:', err);
          this.messageService.add('ERROR: ' + err);
        },
        () => {
          console.log(`We're done here!`);
        })
      }
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
    this.walletService.sendTx(
      this.txForm.get('privateKey').value,
      to,
      this.txForm.get('amount').value
    ).subscribe(receipt => {
      console.log("component got receipt:", receipt);
      this.receipt = receipt;
      this.updateBalance();
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
