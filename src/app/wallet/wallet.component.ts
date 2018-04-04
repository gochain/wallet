import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  nonce: Number;
  txForm: FormGroup;
  balance: string;
  sending: boolean = false;
  receipt: Map<string,any>;

  // fields for creating an account
  account: any;
  // f2Address: string;
  // f2PrivateKey: string;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService) { 
    this.createForm();
  }

  ngOnInit() {
    // this.getNonce();
    this.onChanges();
  }

  createForm() {
    this.txForm = this.fb.group({
      from: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ], // can use this updateOn thing on the entire formgroup too
      privateKey: ['', Validators.required ],
      to: ['', Validators.required ],
      amount: ['', [Validators.required, Validators.min(0.00000001)] ]
    });
  }

  // getNonce(): void {
  //   this.walletService.getNonce().subscribe(nonce => this.nonce = nonce);
  // }

  onChanges(): void {
    this.txForm.get('from').valueChanges.subscribe(val => {
      console.log("changed", val);
      this.updateBalance();
    });
  }

  updateBalance(): void{
    let val = this.txForm.get('from').value;
    if (this.walletService.isAddress(val)){
      this.walletService.getBalance(val).subscribe(balance => {
        console.log("balance:", balance);
        this.messageService.add("Updated balance.");
        this.balance = balance;
      },
      err => {
        console.error('ERROR:', err);
      },
      () => {
        console.log(`We're done here!`);
      })         
    }
  }

  createAccount(): void {
    this.account = this.walletService.createAccount();
  }

  sendTx(): void {
    if (this.txForm.invalid) {
      return
    }
    this.sending = true;
    this.walletService.sendTx(
      this.txForm.get('from').value,
      this.txForm.get('privateKey').value,
      this.txForm.get('to').value,
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
}
