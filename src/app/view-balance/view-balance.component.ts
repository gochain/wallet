import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Globals} from '../globals'
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.scss']
})
export class ViewBalanceComponent implements OnInit {
  balForm: FormGroup;
  balance: string;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService, private globals: Globals) {
    this.createForm();
  }

  ngOnInit() {
    this.onChanges();
  }

  createForm() {
    this.balForm = this.fb.group({
      // from: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ], // can use this updateOn thing on the entire formgroup too
      address: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ]
    });
  }

  onChanges(): void {
    this.balForm.get('address').valueChanges.subscribe(val => {
      console.log("changed", val);
      this.updateBalance();
    });
  }

  updateBalance(): void{
    let val = this.balForm.get('address').value;

    if (val.indexOf('0x') !== 0) {
      val = '0x' + val;
      this.balForm.get('address').setValue(val);
    }

    if (this.walletService.isAddress(val)){
      this.walletService.getBalance(val).subscribe(balance => {
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
