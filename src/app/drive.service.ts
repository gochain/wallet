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
  uploadURL: string = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";
  
  constructor(private afAuth: AngularFireAuth, private http: HttpClient, private globals: Globals ) { }

  upload(): Observable<any> {
    let user = this.afAuth.auth.currentUser;
    if(user != null){
      let fd = new FormData();
      let metadata = {
        // "title": "file_name.extension",
        "mimeType": "application/json",
        "description": "Stuff about the file"
      }
      let blob = new Blob([JSON.stringify(metadata, null, 2)], {type : 'application/json'});
      fd.append('metadata', blob);
      let contents = {hello: "world"};
      blob = new Blob([JSON.stringify(contents, null, 2)], {type : 'application/json'});
      fd.append('file', blob);
      let httpOptions = {
        headers: new HttpHeaders({
          // 'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.globals.gAccessToken()
        })
      };
      return this.http.post(this.uploadURL, fd, httpOptions);
    }
  }

}
