/*
var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var userSchema = new Schema({
	firstName : String,
	lastName : String,
	userId : String
})

var Users = mongoose.model("Users",userSchema);
module.exports = Users;

*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var userSchema = new Schema({
	userId : String,
	firstName : String,
	lastName : String,
	ticket : {
		airId : String,
		airline : String,
		from : String,
		to : String,
		confirmation : String,
		date : String
	}
})

var Users = mongoose.model("Users",userSchema);
module.exports = Users;


