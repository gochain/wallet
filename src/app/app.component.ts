import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Globals} from './globals'
import { WalletService } from './wallet.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GoChain Wallet';
  public version: string = this.globals.version;
  public network: string;

  constructor(private globals: Globals, private walletService: WalletService, public router: Router) {
    this.network = globals.network;
    this.router = router;
  }

  public changeNetwork() {
    this.globals.setNetwork(this.network);
    this.walletService.reset();
    console.log("changed network to: ", this.network);
  }

  public explorerHost() {
    return this.globals.explorerHost();
  }
}
