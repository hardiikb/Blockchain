var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var airlinesSchema = new Schema({
	airId : String,
	balance : Number,
	sold : [{
		userId : String,
		confirmation : String
	}],
	available : [{
		from : String,
		to : String,
		date : String
	}],
	customerReq : [{
		userId : String,
		confirmation : {
			type : String,
			unique : true
		},
		from : String,
		to : String,
		date : String
	}],
	flightReq : [{
		airline : String,
		airId : String,
		from : String,
		to : String,
		date : String,
		confirmation : String,
		userId : String 
	}]

})

var Airlines = mongoose.model("Airlines",airlinesSchema);
module.exports = Airlines;