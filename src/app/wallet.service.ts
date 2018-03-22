import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
// import web3 from 'web3';
// import w3 = require('web3');
import w3 from 'web3';
import { MessageService } from './message.service';

@Injectable()
export class WalletService {

  // web3: Web3;
  account: Account; // Map<string, string> = new Map<string, string>(); // { [key:string]:string; }

  constructor(private messageService: MessageService) {
    console.log("WEB3:", w3);
    // console.log("providers:", Web3.providers);
    // this.web3 = new Web3(new Web3.providers.HttpProvider("http://138.68.1.11:8545"));
    // this.account = this.web3.eth.accounts.create()
    // console.log("ACCOUNT CREATED:", this.account)
  }

  getNonce(): Observable<Number> {
    // let p = this.web3.eth.getTransactionCount(this.account.address);
    // var source1 = fromPromise(p);
    // source1.subscribe(nonce => {
    //   console.log(nonce); 
    //   // account1.nonce = response;
    //   // Todo: send the message _after_ fetching the heroes
    //   this.messageService.add('HeroService: fetched heroes');
    //   // return of(HEROES);
    // })
    // return source1;
  }
}

class Account {
  address: string;
  privateKey: string;
}