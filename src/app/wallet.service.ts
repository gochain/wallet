import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatMap'
import { fromPromise } from 'rxjs/observable/fromPromise';
import * as Web3 from 'web3';
import { MessageService } from './message.service';

declare let window: any;

@Injectable()
export class WalletService {

  private web3: any;
  account: Account; // Map<string, string> = new Map<string, string>(); // { [key:string]:string; }

  constructor(private messageService: MessageService) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Thank you Quintor/angular-truffle-box
    console.log("Web3:", Web3)
    let p = new (<any>Web3).providers.HttpProvider("https://testnet-rpc.gochain.io");
    this.web3 = new (<any>Web3)(p);
  }
 
  createAccount(): any {
    let account = this.web3.eth.accounts.create();
    console.log("ACCOUNT CREATED:", this.account);
    return account;
  }

  sendTx(from: string, privateKey: string, to: string, amount: number): any {
    console.log("SENDTX");
    let p = this.web3.eth.getTransactionCount(from);
    let source1 = fromPromise(p);
    let tx = null;
    return source1.concatMap(nonce => {
      console.log("GOT NONCE:", nonce);
      this.messageService.add('Got nonce: ' + nonce);
      // now send tx
      try {
        amount = this.web3.utils.toWei(amount, 'ether')
      } catch(e) {
        this.messageService.add('ERROR: ' + e);
        return Observable.throw(e);
      }
      tx = {to: to, value: amount, nonce: nonce, gas: '2000000'}
      let p2 = this.web3.eth.accounts.signTransaction(tx, privateKey);
      if (p2 instanceof Promise) {
        return fromPromise(p2);
      } else {
        // this would be a Signature
        return of(p2);
        // return this.sendSignedTx(tx, signed);
      }
    }).concatMap(signed => {
      return this.sendSignedTx(tx, signed);
    })
  }

  sendSignedTx(tx, signed): Observable<any> {
    console.log("signed:", signed);
    tx.signed = signed;
    let p2 = fromPromise(this.web3.eth.sendSignedTransaction(tx.signed.rawTransaction))
    this.messageService.add('Transaction submitted, waiting for receipt...');
    return p2;
  }

  getBalance(address: string): Observable<string> {
    let source1 = null;
    try {
      let p = this.web3.eth.getBalance(address);
      source1 = fromPromise(p);
      return source1.map(balance => {
        console.log("converting balance:", balance);
        balance = this.web3.utils.fromWei(balance, 'ether')
        return balance;
      })
    } catch(e) {
      this.messageService.add('ERROR: ' + e);
      return Observable.throw(e);  
    }
  }
  
  isAddress(address: string): boolean {
    return this.web3.utils.isAddress(address);
  }
}

class Account {
  address: string;
  privateKey: string;
}