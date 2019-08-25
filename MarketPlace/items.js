var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var itemSchema = new Schema({
	userId : String,
	balance : Number,
	onCart : [{
		itemName : String,
		itemPrice : Number,
		itemId : String
	}],

	onSale : [{
		itemName : String,
		itemPrice : Number,
		itemId : String
	}]
})

var Users = mongoose.model("Items",itemSchema);
module.exports = Users;