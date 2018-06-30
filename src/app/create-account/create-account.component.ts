import { Component, OnInit } from '@angular/core';

import { WalletService } from '../wallet.service';
import { DriveService } from '../drive.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  newAccount: any;

  constructor(private walletService: WalletService, public drive: DriveService) { }

  ngOnInit() {
  }

  createAccount(): void {
    this.newAccount = this.walletService.createAccount();
    this.drive.upload().subscribe((data) => console.log(data));
  }

}
