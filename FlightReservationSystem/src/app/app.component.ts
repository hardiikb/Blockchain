import { Component } from '@angular/core';
import {UserService} from './user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title;
  category = "";
  flightName = "";
  verified = "";

  checker : boolean = false;
  flightCheck : boolean = false;
  flightStatus = "";
  currentBalance = 500;
  firstname;
  lastname;
  confirmation;
  flightId = "";
  userAddress;
  flightAddress;
  onCart = [];
  requests = [];
  f_requests = [];
  onSale = [];
  itemsToBuy = [];
  sales = [];
  switch : boolean = false;
  userDisabled : boolean = false ;
  superBool : boolean = false;
  dict = {
     "superuser" : "0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",
     "12hb" : "0xBA3Dc7eAdBDbD8c7022143A0C8c44dfaEc988419" ,
     "12dj" : "0x8FFb444E5c66eaEF835dD435F86805E7f02FBE92" ,
     "12sw" : "0x2713f672bD26cc393056A75c14169EE0a7a1cc45" ,
     "12dt" : "0x558d6aEF3fa8520694b6263acdbBD0f40391B78F" ,
     "12aa" : "0x21aC1349A9Dc302aE5d2437FD56e7f3B2f4e3545" ,
  }

  categories = [{"airline" : "Southwest Airlines", "airId" : "12sw" },
                {"airline" : "Delta Airlines", "airId" : "12dt" },
                {"airline" : "American Airlines", "airId" : "12aa" }
               ];

  lookup = {
    "12sw" : "Southwest Airlines",
    "12dt" : "Delta Airlines",
    "12aa" : "American Airlines"
  }

  confirmlookup = {
    "12sw" : "12bas",
    "12aa" : "12baa",
    "12dt" : "12bad"
  }
  lastName = "" ;

  constructor(private userService : UserService,private router : Router) { 
    console.log(this.dict["12hb"]);
  }

  onRegister(firstName,lastName,userId){
  	var userObj = {
  		firstName : firstName,
  		lastName : lastName,
  		userId : userId
  	}
  	
  }

  onLogIn(logInId){
    this.userDisabled = true;
    this.switch = false;
    this.userAddress = this.dict[logInId];
    console.log(this.userAddress);
  	var logInObj = {
  		logInId : logInId
  	}
    console.log(logInObj);
    this.userService.getUsers(logInObj).subscribe(user => {
        
        
        console.log(user);
        this.title = user["userId"];
        this.firstname = user["firstName"];
        this.lastname = user["lastName"];
        this.onCart = [];
        this.onCart.push(user["ticket"]);
        this.confirmation = this.onCart[0].confirmation;
        

    });
  }

  onAir(value){
    this.switch = true;
    this.userDisabled = false;
    this.checker = false;
    this.flightCheck = false;
    this.verified = "";
    this.flightStatus = "";
    this.userAddress = this.dict[value];
    this.confirmation = this.confirmlookup[value];
    console.log(this.userAddress);
    this.userService.getAirlines(value).subscribe(airline =>{
        this.flightId = airline["airId"];
        this.flightName = this.lookup[this.flightId];
        this.requests = []
        this.requests = airline["customerReq"];
        console.log(this.requests);

        this.f_requests = [];
        this.f_requests = airline["flightReq"];
        console.log(this.f_requests);
    })

  }

  flightchange(airid, from, to, confirmation, date){
    console.log("flight change");
    var reqObj = {
      identify : "change",
      userId : this.title,
      airId : airid.innerHTML,
      from : from.innerHTML,
      to : to.innerHTML,
      confirmation : confirmation.innerHTML,
      date : date.innerHTML
    }
    console.log(reqObj);
    this.userService.flightchange(reqObj).subscribe(items => console.log(items));
  }

  forward(airline, airId, from,to, date, userId, confirmation){
    console.log(this.lookup[this.flightId]);
    console.log(confirmation.innerHTML);
    var forwardObj = {
      identify : "forward",
      airline : this.lookup[this.flightId],
      airId : this.flightId,
      destAirId : airId.innerHTML,
      from : from.innerHTML,
      to : to.innerHTML,
      date : date.innerHTML,
      userId : userId.innerHTML,
      confirmation : confirmation.innerHTML 
    }
    this.userService.flightchange(forwardObj).subscribe(items => console.log(items));
  }

  check(userId, confirmation){

    console.log("check");
    console.log(userId.innerHTML);
    console.log(confirmation.innerHTML);
    var checkObj = {
      identify : "check",
      airId : this.flightId,
      userId : userId.innerHTML,
      confirmation : confirmation.innerHTML
    }
    
    this.userService.flightchange(checkObj).subscribe(verify =>{
        console.log(verify);
        this.verified = JSON.stringify(verify);
        if(JSON.stringify(verify) == '"verified"'){
          console.log("verifiedffff");
          this.checker = true;
        }
    })

  }

  finalcheck(airId,userId,from,to,date){

    var finalObj = {
      identify : "checkfinal",
      airId : this.flightId,
      destAirId : airId.innerHTML,
      userId : userId.innerHTML,
      from : from.innerHTML,
      to : to.innerHTML,
      date : date.innerHTML
    }

    this.userService.flightchange(finalObj).subscribe(items => {
      console.log(items);
      this.flightStatus = JSON.stringify(items);
      if(JSON.stringify(items) == '"verified"'){
          console.log("verifiedffff");
          this.flightCheck = true;
        }
    })
  }

  finalconfirm(airId,userId,from,to,date){

    var finalObj = {
      identify : "confirmfinal",
      airId : this.flightId,
      destAirId : airId.innerHTML,
      userId : userId.innerHTML,
      from : from.innerHTML,
      to : to.innerHTML,
      date : date.innerHTML
    }

    this.userService.flightchange(finalObj).subscribe(items => {
      this.flightStatus = JSON.stringify(items);
      if(JSON.stringify(items) == '"verified"'){
          console.log("verifiedffff");
          this.flightCheck = true;
        }
    })
  }

  finalsettle(airId,userId,from,to,date){

    var finalObj = {
      identify : "settlefinal",
      airId : this.flightId,
      destAirId : airId.innerHTML,
      userId : userId.innerHTML,
      from : from.innerHTML,
      to : to.innerHTML,
      date : date.innerHTML
    }

    this.userService.flightchange(finalObj).subscribe(items => {
      this.flightStatus = JSON.stringify(items);
      if(JSON.stringify(items) == '"verified"'){
          console.log("verifiedffff");
          this.flightCheck = true;
        }
    })
  }

  refill(e){
    
    if(e.target.name == "registerUser"){
      var regObj = {
        identify : "registerUser",
        address : this.userAddress,
        confirmation : this.confirmation
      }

      this.userService.flightchange(regObj).subscribe(items => console.log(items));
    }else if(e.target.name == "unregisterUser"){
      var unRegObj = {
        identify : "unregisterUser",
        address : this.userAddress
      }

      this.userService.flightchange(unRegObj).subscribe(items => console.log(items)); 
      
    }else if(e.target.name == "registerAirline"){
      console.log(this.userAddress);
      var ReggObj = {
        identify : "registerAirline",
        address : this.userAddress,
        confirmation : this.confirmation
      }

      this.userService.flightchange(ReggObj).subscribe(items => console.log(items)); 
      
    }else{
      var unReggObj = {
        identify : "unregisterAirline",
        address : this.userAddress,
      }

      this.userService.flightchange(unReggObj).subscribe(items => console.log(items));
    }
  }



  
}

