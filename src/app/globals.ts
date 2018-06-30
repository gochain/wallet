import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class Globals {
  network: string = 'mainnet';
  // googleAccessToken: string;


  constructor(public afAuth: AngularFireAuth ) { }

  public rpcHost(): string {
    if (this.network == "testnet") {
      return "https://testnet-rpc.gochain.io";
    }
    return "https://rpc.gochain.io";
  }

  public explorerHost(): string {
    if (environment.production) {
      if (this.network == "testnet") {
        return "https://testnet-explorer.gochain.io";
      }
      return "https://explorer.gochain.io";
    }
    return 'http://localhost:8000';
  }

  public gAccessToken(): string {
    return sessionStorage.getItem("gAccessToken"); // set in auth component
  }
}
