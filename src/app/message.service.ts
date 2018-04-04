import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class MessageService {
  messages: string[] = [];

  constructor(public snackBar: MatSnackBar){}

  add(message: string) {
    // this.messages.push(message);
    this.snackBar.open(message, null, {duration: 10000})
  }

  clear() {
    this.messages = [];
  }
}