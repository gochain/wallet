import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Globals {
  network: string = 'mainnet';
  version: string = '1.1.20'

  constructor() {
    let nw = localStorage.getItem('network');
    if (nw !== null) {
      this.network = nw;
    }
  }

  setNetwork(network: string){
    this.network = network;
    localStorage.setItem('network', network);
  }

  public rpcHost(): string {
    if (this.network == "testnet") {
      return "https://testnet-rpc.gochain.io";
    }
    return "https://rpc.gochain.io";
  }

  public explorerHost(): string {
    // if (environment.production) {
      if (this.network == "testnet") {
        return "https://testnet-explorer.gochain.io";
      }
      return "https://explorer.gochain.io";
    // }
    // return 'http://localhost:8000';
  }
}
