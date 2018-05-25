
import {concatMap, map} from 'rxjs/operators'
import {throwError as observableThrowError,  Observable ,  of ,  from as fromPromise } from 'rxjs';
// import 'rxjs/add/operator/concatMap'
import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import {Globals} from './globals'
import { MessageService } from './message.service';

declare let window: any;

@Injectable()
export class WalletService {

  private web3: any;

  constructor(private messageService: MessageService, private globals: Globals) {
    
  }

  public reset(): void {
    this.web3 = null;
  }

  createAccount(): any {
    let account = this.w3().eth.accounts.create();
    console.log("ACCOUNT CREATED:", account);
    return account;
  }

  public w3(): any {
    if (this.web3 == null) {
      console.log("Connecting to: ", this.globals.rpcHost());
      let p = new (<any>Web3).providers.HttpProvider(this.globals.rpcHost());
      this.web3 = new (<any>Web3)(p);
    }
    return this.web3;
  }

  sendTx(privateKey: string, to: string, amount: number): any {
    console.log("SENDTX");
    let from = null;
    try {
      from = this.w3().eth.accounts.privateKeyToAccount(privateKey);
    } catch(e) {
      this.messageService.add('ERROR: ' + e);
      return observableThrowError(e);
    }
    let p = this.w3().eth.getTransactionCount(from.address);
    let source1 = fromPromise(p);
    let tx = null;
    return source1.pipe(
      concatMap(nonce => {
        console.log("GOT NONCE:", nonce);
        this.messageService.add('Got nonce: ' + nonce);
        // now send tx
        try {
          amount = this.w3().utils.toWei(amount, 'ether')
        } catch(e) {
          this.messageService.add('ERROR: ' + e);
          return observableThrowError(e);
        }
        tx = {to: to, value: amount, nonce: nonce, gas: '2000000'}
        let p2 = this.w3().eth.accounts.signTransaction(tx, privateKey);
        if (p2 instanceof Promise) {
          return fromPromise(p2);
        } else {
          // this would be a Signature
          return of(p2);
          // return this.sendSignedTx(tx, signed);
        }
      }),
      concatMap(signed => {
        return this.sendSignedTx(tx, signed);
      })
    )
  }

  sendSignedTx(tx, signed): Observable<any> {
    console.log("signed:", signed);
    tx.signed = signed;
    let p2 = fromPromise(this.w3().eth.sendSignedTransaction(tx.signed.rawTransaction))
    this.messageService.add('Transaction submitted, waiting for receipt...');
    return p2;
  }

  getBalance(address: string): Observable<string> {
    let source1 = null;
    try {
      let p = this.w3().eth.getBalance(address);
      source1 = fromPromise(p);
      return source1.pipe(
        map(balance => {
          console.log("converting balance:", balance);
          balance = this.w3().utils.fromWei(balance, 'ether')
          return balance;
        })
      )
    } catch(e) {
      this.messageService.add('ERROR: ' + e);
      return observableThrowError(e);  
    }
  }
  
  isAddress(address: string): boolean {
    return this.w3().utils.isAddress(address);
  }
}

class Account {
  address: string;
  privateKey: string;
}