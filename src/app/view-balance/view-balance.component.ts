import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Globals} from '../globals';
import {WalletService} from '../wallet.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.scss']
})
export class ViewBalanceComponent implements OnInit {
  fromAccount: any;
  balForm: FormGroup;
  balance: string;
  address: string;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService, private globals: Globals) {
    this.createForm();
  }

  ngOnInit() {
    this.onChanges();
  }

  createForm() {
    this.balForm = this.fb.group({
      // from: ['', {validators: Validators.required /*, updateOn: 'blur'*/ } ], // can use this updateOn thing on the entire formgroup too
      address: ['', {validators: Validators.required /*, updateOn: 'blur'*/}],
    });
  }

  onChanges(): void {
    this.balForm.get('address').valueChanges.subscribe(val => {
      console.log('changed', val);
      this.updateBalance();
    });

  }

  updateBalance(): void {
    let addr = this.balForm.get('address').value;

    if (addr.length === 40) {
      if (addr.indexOf('0x') !== 0) {
        addr = '0x' + addr;
        this.balForm.get('address').setValue(addr);
      }
    }

    this.address = addr;

    if (addr.length === 42) {
      if (this.walletService.isAddress(addr)) {
        this.walletService.getBalance(addr).subscribe(balance => {
            console.log('balance:', balance);
            this.messageService.add('Updated balance.');
            this.balance = balance;
          },
          err => {
            console.error('ERROR:', err);
            this.messageService.add('ERROR: ' + err);
          },
          () => {
            console.log(`We're done here!`);
          });
      }
    }
  }

  public explorerHost() {
    return this.globals.explorerHost();
  }
}
