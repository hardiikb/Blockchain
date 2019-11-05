import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private identityServerUrl = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  readIdentity(userObj){
    console.log("app service " + userObj.passportNo + userObj.bioMetrics);
    return this.http.get(this.identityServerUrl + "/" + userObj.passportNo + "/" + userObj.bioMetrics);
  }

  addIdentity(userObj){
    console.log("app service " + userObj.firstName + userObj.lastName);
    return this.http.post(this.identityServerUrl,userObj,httpOptions);
  }

  updateIdentity(userObj){
    console.log("app put service " + userObj.passportNo + userObj.bioMetrics + userObj.newPassportNo);
    return this.http.put(this.identityServerUrl,userObj,httpOptions);
  }
}
