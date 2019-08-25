var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var userSchema = new Schema({
	firstName : String,
	lastName : String,
	userId : String
})

var Users = mongoose.model("Users",userSchema);
module.exports = Users;