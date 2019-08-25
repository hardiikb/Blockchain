import { Injectable } from '@angular/core';
import { extras } from './heroes/extras';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { 
  	  
  }
  getExtra(){
  	return extras;
  }

  getHeroes(){
  	return this.http.get(this.heroesUrl);
  }

  postHeroes(hero){
    console.log("Hero Service " + hero);
    var obj = {
      name : hero
    }
    return this.http.post(this.heroesUrl,obj,httpOptions);
  }
}
