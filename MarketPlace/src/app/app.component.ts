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
  title = 'my-app';
  currentBalance = 500;
  firstname;
  lastname;
  address;
  onCart = [];
  onSale = [];
  itemsToBuy = [];
  sales = []
  userDisabled : boolean = false ;
  superBool : boolean = false;
  dict = {
     "superuser" : "0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",
     "12hb" : "0xBA3Dc7eAdBDbD8c7022143A0C8c44dfaEc988419" ,
     "12dj" : "0x8FFb444E5c66eaEF835dD435F86805E7f02FBE92" ,
     "12jc" : "0x2713f672bD26cc393056A75c14169EE0a7a1cc45" ,
     "12cp" : "0x558d6aEF3fa8520694b6263acdbBD0f40391B78F" ,
     "12od" : "0x21aC1349A9Dc302aE5d2437FD56e7f3B2f4e3545" ,
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
  	this.userService.postUsers(userObj).subscribe(users => console.log(users));
  }

  onLogIn(logInId){
    this.address = this.dict[logInId];
  	var logInObj = {
  		logInId : logInId
  	}
    this.userService.getUsers(logInObj).subscribe(user => {
        console.log(user["itemsToBuy"]);
        this.userDisabled = true;
        this.title = user["user"].userId;
        this.firstname = user["user"].firstName;
        this.lastname = user["user"].lastName;

        this.onCart = user["items"]["onCart"];
        this.onSale = user["items"]["onSale"];
        this.currentBalance = user["items"]["balance"];

        let allButOne = user["itemsToBuy"];
        console.log(allButOne);
        this.itemsToBuy = [];
        
        for(let user of allButOne){
          // stored every user except one to assign userid on the items listed
          this.itemsToBuy.push(user);
        }
        console.log(this.itemsToBuy);
    });
  }

  onSuper(value){
    if(this.dict[value]!= undefined){
      this.superBool = true;
    }
  }
  ondisplay(value){
    console.log(value.innerHTML)
  }

  putOnSale(value){
    console.log(value.innerHTML);
    
    let pos = this.onCart.map(function(e) { return e.itemId; }).indexOf(value.innerHTML);
    
    this.onSale.push(this.onCart[pos]);
    if(pos != -1){

      let itemObj = {
        userId : this.title,
        item   : this.onCart[pos]
      };
      this.userService.updateItems(itemObj).subscribe(items => console.log(items));
      this.onCart.splice(pos,1);
    }

  }
  
  buy(userid,buyitemid,itemprice){
    console.log(userid.innerHTML);
    console.log(buyitemid.innerHTML);
    console.log(itemprice.innerHTML);

    //for(let i=0; i< this.itemsToBuy.length; i++){
      //if(this.itemsToBuy[i].userId == userid.innerHTML){
        //let temppos = i;
        //break;
      //}
    //};

       // founded user's position in itemsToBuy 
    let userpos = this.itemsToBuy.map(function(e) { return e.userId; }).indexOf(userid.innerHTML);

      // trying to access that user's "onSale" cart using position.
    let user = this.itemsToBuy[userpos]["onSale"];

    // retrieved position of the item logged in user wants to buy in "OnSale" 
    // cart..
    let pos = user.map(function(e) { return e.itemId; }).indexOf(buyitemid.innerHTML);
    console.log(pos);

    // added it into logged in user's "OnCart".
    this.onCart.push(user[pos]);
    console.log(user[pos].itemPrice);
    
    let transferObj = {
      cartUserId : this.title,
      saleUserId : this.itemsToBuy[userpos]["userId"],
      item : user[pos],
      buyer : this.dict[this.title],
      seller : this.dict[this.itemsToBuy[userpos]["userId"]]
    }

    this.userService.transferItems(transferObj).subscribe(items => console.log(items));
    this.currentBalance = this.currentBalance - user[pos].itemPrice;
    // removed it from "onsale" of founded user....
    this.itemsToBuy[userpos]["onSale"].splice(pos,1);

  }

  refill(e){
    console.log(e.target.name);
    if(e.target.name == "register"){
      this.currentBalance = 500;
    }
    if(e.target.name == "unregister"){
      this.currentBalance = 0;
    }

    let refiller = {
      userId : this.title,
      address : this.dict[this.title],
      name : e.target.name,
      superuser : this.dict["superuser"]
    }
    this.userService.refill(refiller).subscribe(result => console.log(result));
  }

  
}

