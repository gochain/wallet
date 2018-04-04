import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatProgressBarModule, MatToolbarModule, MatSnackBarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './wallet.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';


@NgModule({
  declarations: [
    AppComponent,
    WalletComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatProgressBarModule, MatToolbarModule, MatSnackBarModule
  ],
  providers: [
    WalletService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
