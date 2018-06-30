import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

import {Globals} from '../globals';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private globals: Globals) {
  }

  login() {
    var provider = new auth.GoogleAuthProvider();
    // provider.addScope('profile');
    // provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/drive.appdata');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    this.afAuth.auth.signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token.
      this.globals.googleAccessToken = result.credential['accessToken'];
      console.log("access token:", this.googleAccessToken);
      // The signed-in user info.
      // var user = result.user; 
     });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {
  }

}
