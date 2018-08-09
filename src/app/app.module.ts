import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatProgressBarModule, MatToolbarModule, MatSnackBarModule,
        MatSelectModule, MatExpansionModule, MatIconModule } from '@angular/material';

import { Globals } from './globals';

import { AppComponent } from './app.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './wallet.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ViewBalanceComponent } from './view-balance/view-balance.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GetGoComponent } from './get-go/get-go.component';
import { SendTxComponent } from './send-tx/send-tx.component';
import { ChartsModule } from 'ng2-charts';
import { BalanceComponent } from './balance/balance.component';
import { ContractsComponent } from './contracts/contracts.component';

const appRoutes: Routes = [
  { path: 'view-balance', component: ViewBalanceComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'get-go', component: GetGoComponent },
  { path: 'send-tx', component: SendTxComponent },
  { path: 'contracts', component: ContractsComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  { path: '',
    // redirectTo: '/heroes',
    pathMatch: 'full',
    component: WalletComponent
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    WalletComponent,
    MessagesComponent,
    CreateAccountComponent,
    PageNotFoundComponent,
    GetGoComponent,
    SendTxComponent,
    ViewBalanceComponent,
    BalanceComponent,
    ContractsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    // FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatProgressBarModule, MatToolbarModule, MatSnackBarModule,
    MatSelectModule, MatExpansionModule, MatIconModule,
    ChartsModule
  ],
  providers: [
    Globals,
    WalletService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
