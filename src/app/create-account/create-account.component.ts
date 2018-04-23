import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  newAccount: any;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
  }

  createAccount(): void {
    this.newAccount = this.walletService.createAccount();
  }

}
