import { Component } from '@angular/core';
import {Globals} from './globals'
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GoChain Wallet';
  public network: string;

  constructor(private globals: Globals, private walletService: WalletService) {
    this.network = globals.network;
  }

  public changeNetwork() {
    this.globals.network = this.network;
    this.walletService.reset();
    console.log("changed network to: ", this.network);
  }
}
