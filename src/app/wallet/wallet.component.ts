import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  nonce: Number;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    this.getNonce();
  }

  getNonce(): void {
    this.walletService.getNonce().subscribe(nonce => this.nonce = nonce);
  }

}
