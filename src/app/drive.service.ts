import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {throwError as observableThrowError,  Observable ,  of ,  from as fromPromise } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

import {Globals} from './globals';

@Injectable({
  providedIn: 'root'
})

// good info here: https://stackoverflow.com/questions/10317638/how-do-i-add-create-insert-files-to-google-drive-through-the-api
export class DriveService {
  uploadURL: string = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  
  constructor(private afAuth: AngularFireAuth, private http: HttpClient, private globals: Globals ) { }

  uploadJSON(name: string, body: {[key: string]: string}): Observable<any> {
    let user = this.afAuth.auth.currentUser;
    if(user != null){
      // let fd = new FormData();
      // let metadata = {
      //   // "title": "file_name.extension",
      //   "name": "gokey-" + name,
      //   "mimeType": "application/json",
      //   "description": "Stuff about the file"
      // }
      // let blob = new Blob([JSON.stringify(metadata, null, 2)], {type : 'application/json; charset=UTF-8'});
      // fd.append('metadata', blob);
      // blob = new Blob([JSON.stringify(body, null, 2)], {type : 'application/json'});
      // fd.append('file', blob);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'multipart/related; boundary=foo_bar_baz',
          'Authorization': 'Bearer ' + this.globals.gAccessToken()
        })
      };
      let b = `--foo_bar_baz
Content-Type: application/json; charset=UTF-8

{
  "name": "` + name + `",
  "mimeType": "application/json"
}

--foo_bar_baz
Content-Type: application/json

` + JSON.stringify(body) + `
--foo_bar_baz--`
      return this.http.post(this.uploadURL, b, httpOptions);
    }
  }

  listFiles(q: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.globals.gAccessToken()
      })
    };
    return this.http.get('https://www.googleapis.com/drive/v3/files?q=' + q, httpOptions);
  }
}
