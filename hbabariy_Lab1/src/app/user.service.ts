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
    return this.http.get(this.heroesUrl + "/" + id.logInId);
  }

  postUsers(user){
    console.log("User Service " + user);
    return this.http.post(this.heroesUrl,user,httpOptions);
  }
  // from own cart to own sale..
  updateItems(id){
    return this.http.put(this.heroesUrl,id,httpOptions);
  }
  // from others sale to own cart..
  transferItems(ids){
    console.log("service");
    console.log(ids);
    return this.http.put(this.heroesUrl + "/hello",ids,httpOptions);
  }

  refill(id){
    console.log(id);

    return this.http.get(this.heroesUrl + "/" + id.userId + "/" + id.address + "/" + id.name + "/" + id.superuser);
  }

} 
