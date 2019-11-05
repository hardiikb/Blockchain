import { Component } from '@angular/core';
import {AppService} from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'User App';
  success = false;
  constructor(private appService : AppService) { 
  }

  onRegister(firstName, lastName, passportNo, bioMetrics, dob, passportIssue, passportExpiry, countryCode, type){
    console.log("hello")
  	let userObj = {
  		firstName: firstName,
  		lastName: lastName,
      passportNo: passportNo,
      bioMetrics: bioMetrics,
      dob: dob,
      passportIssue: passportIssue,
      passportExpiry: passportExpiry,
      countryCode: countryCode,
      type: type
    }
    
    this.appService.addIdentity(userObj).subscribe(response => {
        alert(response)
    });
  }

  onReadIdentity(passportNo, bioMetrics){
    console.log(passportNo)
    console.log(bioMetrics)
    if(passportNo.length == 0){
      passportNo = null;
    }
    if(bioMetrics.length == 0){
      bioMetrics = null;
    }
    let userObj = {
      passportNo: passportNo,
      bioMetrics: bioMetrics
    }
    this.appService.readIdentity(userObj).subscribe(response => {
      let resObj = JSON.parse(response.toString());
      if("message" in resObj){
        alert(resObj.message)
      }else{
        alert("Passport No: " + resObj.passportNo + "\n" + "Birth Date: " + resObj.birthDate + "\n" + "Country Code: " + resObj.countryCode + "\n" + "First Name: " + resObj.givenName + "\n" + "Last Name: " + resObj.lastName + "\n" + "Passport Type: " + resObj.type + "\n" + "Expiry Date: " + resObj.expiryDate + "\n" + "Issue Date: " + resObj.issueDate)

      }
      // if("passportNo" in resObj){
      //   alert("Passport No: " + resObj.passportNo + "\n" + "Birth Date: " + resObj.birthDate + "\n" + "Country Code: " + resObj.countryCode + "\n" + "First Name: " + resObj.givenName + "\n" + "Last Name: " + resObj.lastName + "\n" + "Passport Type: " + resObj.type + "\n" + "Expiry Date: " + resObj.expiryDate + "\n" + "Issue Date: " + resObj.issueDate)
      // }
      // else{
      //   alert("Passport No: " + resObj.passportNo + "\n" + "Birth Date: " + resObj.birthDate + "\n" + "Country Code: " + resObj.countryCode + "\n" + "First Name: " + resObj.givenName + "\n" + "Last Name: " + resObj.lastName + "\n" + "Passport Type: " + resObj.type + "\n" + "Expiry Date: " + resObj.expiryDate + "\n" + "Issue Date: " + resObj.issueDate)
      // }
    });
  }

  onUpdateIdentity(passportNo, bioMetrics, newPassportNo){
    console.log(passportNo)
    console.log(bioMetrics)
    console.log(newPassportNo)
    let userObj = {
      passportNo: passportNo,
      bioMetrics: bioMetrics,
      newPassportNo: newPassportNo
    }
    this.appService.updateIdentity(userObj).subscribe(response => {
        alert(response)
    });
  }
}
