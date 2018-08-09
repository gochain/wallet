import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Globals} from '../globals'
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  step: string = "send";

  txForm: FormGroup;
  fromAccount: any;
  // balance: string;
  sending: boolean = false;
  receipt: Map<string,any>;

  constructor(private walletService: WalletService, private fb: FormBuilder, private messageService: MessageService, private globals: Globals) {
    this.createForm();
  }

  ngOnInit() {
    // this.onChanges();
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

}
