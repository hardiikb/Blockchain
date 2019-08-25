import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private heroesUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {
    
  }


  getUsers(id){
    return this.http.get(this.heroesUrl + "/" + id.logInId + "/user");
  }
  
  getAirlines(id){
    return this.http.get(this.heroesUrl + "/" + id + "/airline");
  }
  

  flightchange(obj){
    console.log(obj);
  	return this.http.put(this.heroesUrl + "/hello",obj,httpOptions)
  }



} 
