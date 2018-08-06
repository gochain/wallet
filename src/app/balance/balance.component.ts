import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balance: string;
  fromAccount: any;
  
  constructor(private walletService: WalletService, private messageService: MessageService) { }

  ngOnInit() {
  }

  update(keyOrAddress: string): void{
    let val = keyOrAddress; 
    let address = null;

    if (val.length === 66) {
      try {
        this.fromAccount = this.walletService.w3().eth.accounts.privateKeyToAccount(val);
        address = this.fromAccount.address;
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return
      }
    }
    // maybe address then
    if (val.length === 42) {
      address = val;
    }
    if (address != null) {
      if (this.walletService.isAddress(address)){
        this.walletService.getBalance(address).subscribe(balance => {
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

  reset(): void {
    this.balance = null;
    this.fromAccount = null;
  }

}
