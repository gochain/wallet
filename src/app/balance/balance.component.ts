import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { MessageService } from '../message.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balance: string;
  fromAccount: any;
  address: string; // this is if it's not a private key being used
  
  constructor(private walletService: WalletService, private messageService: MessageService, private globals: Globals) { }

  ngOnInit() {
  }

  update(keyOrAddress: string): void{
    let val = keyOrAddress; 

    if (val.length === 66) {
      try {
        this.fromAccount = this.walletService.w3().eth.accounts.privateKeyToAccount(val);
        this.address = this.fromAccount.address;
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return
      }
    }
    // maybe address then
    if (val.length === 42) {
      this.address = val;
    }
    if (this.address != null) {
      if (this.walletService.isAddress(this.address)){
        this.walletService.getBalance(this.address).subscribe(balance => {
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
    this.address = null; 
  }

  public explorerHost() {
    return this.globals.explorerHost();
  }

}
