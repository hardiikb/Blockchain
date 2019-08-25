var mongoose = require("mongoose");
var Schema = mongoose.Schema ;

var productSchema = new Schema({
	p_id : String,
	serial : String,
	sender : String,
	receiver : String

})

var Products = mongoose.model("Products",productSchema);
module.exports = Products;