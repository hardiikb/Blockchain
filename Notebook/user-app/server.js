var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var read_identity = require("../user_chain_data/readIdentity.js");
var add_identity = require("../user_chain_data/addIdentity.js");
var update_identity = require("../user_chain_data/updateIdentity.js");
var block_listener = require("../user_chain_data/blockEventListener.js");

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.get("/:passportNo/:bioMetrics", function(req,res){
    block_listener();
    read_identity(req,res);
})

app.post("/", function(req,res){
    add_identity(req,res);
})

app.put("/", function(req,res){
    update_identity(req,res);
})
app.listen(3000, function(){
    console.log("listening on 3000");
})
