import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Globals} from './globals'
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GoChain Wallet';
  public network: string;

  constructor(private globals: Globals, private walletService: WalletService, private router: Router) {
    this.network = globals.network;
    this.router = router;
  }

  public changeNetwork() {
    this.globals.network = this.network;
    this.walletService.reset();
    console.log("changed network to: ", this.network);
  }

  public explorerHost() {
    return this.globals.explorerHost();
  }

  public explorerUrl() {
    return this.globals.explorerUrl();
  }
}
