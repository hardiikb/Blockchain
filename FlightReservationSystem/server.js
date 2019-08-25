var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./users");
var Airlines = require("./airlines");

/////////////////////////////////////////////////////////////
var fs = require("fs");
var Web3 = require("web3");
var solc = require("solc");
var path = require("path");
var dict = {
     "superuser" : "0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",
     "12hb" : "0xBA3Dc7eAdBDbD8c7022143A0C8c44dfaEc988419" ,
     "12dj" : "0x8FFb444E5c66eaEF835dD435F86805E7f02FBE92" ,
     "12sw" : "0x2713f672bD26cc393056A75c14169EE0a7a1cc45" ,
     "12dt" : "0x558d6aEF3fa8520694b6263acdbBD0f40391B78F" ,
     "12aa" : "0x21aC1349A9Dc302aE5d2437FD56e7f3B2f4e3545" ,
  }
var lookup = {
    "12sw" : "Southwest Airlines",
    "12dt" : "Delta Airlines",
    "12aa" : "American Airlines"
  }

var confirmlookup = {
    "12bas" : 12,
    "12baa" : 34
}
var Instance;
var Accounts;
//var MarketPlace = require(path.join(__dirname,'build/contracts/MarketPlace.json'));

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

//var MarketPlaceContract = contract(MarketPlace);
var CONTRACT_FILE = "ASK.sol";
var content = fs.readFileSync('./contracts/ASK.sol',"utf8").toString();
var input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_FILE]: {
      content: content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
} 

var compiled = solc.compile(JSON.stringify(input));
var output = JSON.parse(compiled);
var abi = output.contracts[CONTRACT_FILE]['ASK'].abi
var bytecode = '0x' + output.contracts[CONTRACT_FILE]['ASK'].evm.bytecode.object


var mkPlace = new web3.eth.Contract(JSON.parse(JSON.stringify(abi)), null, { data: bytecode } );
var gasPrice;
var gass;


web3.eth.getGasPrice().then((averageGasPrice) => {
    console.log("Average gas price: " + averageGasPrice);
    gasPrice = averageGasPrice;
}).catch(console.error);

mkPlace.deploy().estimateGas().then((estimatedGas) => {
    console.log("Estimated gas: " + estimatedGas);
    gass = estimatedGas;
}).catch(console.error);

address = "0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b";

mkPlace.deploy().send({ from: address , gasPrice : gasPrice, gas: 1000000} ).then( function( instance ) {
    console.log( "Contract mined at " + instance.options.address );
    Instance = instance;
    /*
    instance.methods.hello().call().then(function(value){
        console.log("current value:",value);
    });

    instance.methods.mint("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",5000).estimateGas().then(function(estimate){
        console.log("Estimated:", estimate);
        instance.methods.mint("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",5000).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
            console.log("transaction tx : " ,tx);
        });
        instance.methods.display("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b").call().then(function(value){
            console.log("minter balance : ",value);
        });
    })
    */

});


mongoose.connect("mongodb://localhost/test");

//var marketPlaceAbi = require("./marketPlaceAbi.js");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", function(){

    console.log("connected to database");
})


//console.log(user);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

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

app.get("/:id/:identifier", function(req,res){
	console.log("Client Connected");
    console.log(req.params.id); 
    console.log(req.params.identifier);   
    if(req.params.identifier == "user"){
        Users.findOne({userId: req.params.id }, function(err,user){

            res.json(user);
        })
    }else if(req.params.identifier == "airline"){
        Airlines.findOne({airId: req.params.id }, function(err,airline){

            res.json(airline);
        })
    }else{
        console.log("check");
        console.log(req.params.id.userId);
    }
    


    /*
    user.save(function(err,user){
        console.log("user saved to database");
    })*/
});

app.post("/",function(req,res){
	console.log("post req received");
    console.log(req.body);
    var user = new Users(req.body);
    console.log(user);
    user.save(function(err){
        console.log(err);
    })
});

app.put("/:hello",function(req,res){
    console.log("hello put received");
    
    if(req.body.identify == "change"){
        console.log("change");
        console.log(req.body.confirmation);
        console.log("hello")
        Airlines.findOne({airId : req.body.airId}, function(err,airline){
            console.log(airline);
            if(airline["customerReq"].length == 0){
                Airlines.findOneAndUpdate({airId : req.body.airId}, {$push: {customerReq: req.body}}, function(err,success){
                    if(err){
                        console.log(err);
                    }
                });
            }
            for(let i=0; i<airline["customerReq"].length; i++){
                if(airline["customerReq"][i]["confirmation"] == req.body.confirmation){
                    break;
                }
                if(i == airline["customerReq"].length-1){
                    Airlines.findOneAndUpdate({airId : req.body.airId}, {$push: {customerReq: req.body}}, function(err,success){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        })
        
    }else if(req.body.identify == "forward"){
        console.log("flight");
        console.log(req.body);
        Airlines.findOne({airId : req.body.destAirId}, function(err,airline){
            if(airline["flightReq"].length == 0){
                Airlines.findOneAndUpdate({airId : req.body.destAirId}, {$push: {flightReq: req.body}}, function(err,success){
                    if(err){
                        console.log(err);
                    }
                });
            }

            for(let i=0; i<airline["flightReq"].length; i++){
                if(airline["flightReq"][i]["confirmation"] == req.body.confirmation){
                    break;
                }
                if(i == airline["flightReq"].length-1){
                    Airlines.findOneAndUpdate({airId : req.body.destAirId}, {$push: {flightReq: req.body}}, function(err,success){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        })
        
    }else if(req.body.identify == "check"){
        Instance.methods.reqval(dict[req.body.userId], confirmlookup[req.body.confirmation]).estimateGas().then(function(estimate){
            console.log("Estimated:", estimate);
            Instance.methods.reqval(dict[req.body.userId], confirmlookup[req.body.confirmation]).call({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                if(tx == "true"){
                    Airlines.findOne({airId : req.body.airId}, function(err,airline){
                        for(let i=0; i<airline["sold"].length; i++){
                            if(airline["sold"][i]["confirmation"] == req.body.confirmation && airline["sold"][i]["userId"] == req.body.userId){
                                res.json("verified");
                                break;
                            }

                            if(i==airline["sold"].length-1){
                                res.json("unverified");
                                break;
                            }
                        }

                    })
                }else{
                    res.json("unverified");
                }
                
            });
            
        });

        
    }else if(req.body.identify == "checkfinal"){
        Instance.methods.airline_validation(dict[req.body.airId], dict[req.body.destAirId] ).estimateGas().then(function(estimate){
            console.log("Check estimate" + estimate);
            console.log("aaaaa " + dict[req.body.airId] + " " + dict[req.body.destAirId] );
            Instance.methods.airline_validation(dict[req.body.airId], dict[req.body.destAirId]).call({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                console.log(tx);
                if(tx == "true"){
                    Airlines.findOne({airId : req.body.airId}, function(err,airline){
                        for(let i = 0; i<airline["available"].length; i++){

                            if(airline["available"][i]["from"] == req.body.from && airline["available"][i]["to"] == req.body.to && airline["available"][i]["date"] == req.body.date){
                                 console.log("verified");
                                 res.json("verified");
                                 break;

                            }

                            if(i==airline["available"].length-1){
                                res.json("unverified");
                                break;
                            }
                            /*
                            if(airline["available"][i]["from"] == req.body.from && airline["available"][i]["to"] == req.body.to && airline["available"][i]["date"] == req.body.date){
                                var final_ticket = {
                                    "airId" : airline["airId"],
                                    "airline" : lookup[airline["airId"]],
                                    "from" : req.body.from,
                                    "to" : req.body.to,
                                    "confirmation" : "12" + req.body.from[0].toLowerCase() + req.body.to[0].toLowerCase() + lookup[airline["airId"]][0].toLowerCase(),
                                    "date" : req.body.date
                                }
                                Users.findOneAndUpdate({userId : req.body.userId}, {$set : {ticket : final_ticket}},function(err,result){
                                    console.log("updated");
                                    console.log(result);
                                })
                                
                                Airlines.findOneAndUpdate({airId : req.body.destAirId}, {$pull : {customerReq : {from:req.body.from, to:req.body.to, userId: req.body.userId}}},function(err,success){
                                    if(err){
                                        console.log(err);
                                    }
                                });

                                Airlines.findOneAndUpdate({airId : req.body.airId}, {$pull : {flightReq : {from:req.body.from, to:req.body.to, userId: req.body.userId}}},function(err,success){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                                break;
                            }
                            if(i==airline["available"].length-1){
                                res.json("unverified");
                                break;
                            }*/ 
                        }
                    })
                }else{
                    res.json("unverified");
                }
            })
        })


    }else if(req.body.identify == "confirmfinal"){
        console.log(req.body);
        Airlines.findOne({airId : req.body.airId}, function(err,airline){
            for(let i = 0; i<airline["available"].length; i++){

                
                if(airline["available"][i]["from"] == req.body.from && airline["available"][i]["to"] == req.body.to && airline["available"][i]["date"] == req.body.date){
                    var final_ticket = {
                        "airId" : airline["airId"],
                        "airline" : lookup[airline["airId"]],
                        "from" : req.body.from,
                        "to" : req.body.to,
                        "confirmation" : "12" + req.body.from[0].toLowerCase() + req.body.to[0].toLowerCase() + lookup[airline["airId"]][0].toLowerCase(),
                        "date" : req.body.date
                    }
                    Users.findOneAndUpdate({userId : req.body.userId}, {$set : {ticket : final_ticket}},function(err,result){
                        console.log("updated");
                        console.log(result);
                    })
                    
                    Airlines.findOneAndUpdate({airId : req.body.destAirId}, {$pull : {customerReq : {from:req.body.from, to:req.body.to, userId: req.body.userId}}},function(err,success){
                        if(err){
                            console.log(err);
                        }
                    });

                    
                    break;
                }
                 
            }
        })


    }else if(req.body.identify == "settlefinal"){
        console.log(req.body);
        Airlines.findOneAndUpdate({airId : req.body.airId}, {$pull : {flightReq : {from:req.body.from, to:req.body.to, userId: req.body.userId}}},function(err,success){
            if(err){
                console.log(err);
            }
            web3.eth.sendTransaction({from : dict[req.body.destAirId], to : dict[req.body.airId], value: "1000000000000000000"}).then(function(err,res){
                console.log("res");
            });
        });


    }else{
        console.log(req.body.address);
        if(req.body.identify == "registerUser"){

            Instance.methods.registerUser(req.body.address,confirmlookup[req.body.confirmation]).estimateGas().then(function(estimate){
                console.log("Estimated:", estimate);
                Instance.methods.registerUser(req.body.address,confirmlookup[req.body.confirmation]).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                    console.log("transaction tx : " ,tx);
                    
                });
            
            });

            
        }else if(req.body.identify == "unregisterUser"){
            Instance.methods.unregisterUser(req.body.address).estimateGas().then(function(estimate){
                console.log("Estimated:", estimate);
                Instance.methods.unregisterUser(req.body.address).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                    console.log("transaction tx : " ,tx);
                    
                });
            
            });
        }else if(req.body.identify == "registerAirline"){
            console.log("flight add " + confirmlookup[req.body.confirmation] );
            Instance.methods.registerAirline(req.body.address, confirmlookup[req.body.confirmation]).estimateGas().then(function(estimate){
                console.log("EstimatedAilrine:", estimate);
                Instance.methods.registerAirline(req.body.address, confirmlookup[req.body.confirmation]).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                    console.log("transaction tx : " ,tx);
                    
                });
            
            });

        }else{
            Instance.methods.unregisterAirline(req.body.address).estimateGas().then(function(estimate){
                console.log("Estimatedairline:", estimate);
                Instance.methods.unregisterAirline(req.body.address).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                    console.log("transaction tx : " ,tx);
                    
                });
            
            });
        }
    }


    
});


app.listen(3000);
console.log("Server is listening");

/*

for query string:

define following in user service : 
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams().set("logInId",id.logInId); 
    return this.http.get(this.heroesUrl,{headers:headers, params:params});
& get it using req.query.logInId


var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./users");
var Airlines = require("./airlines");

/////////////////////////////////////////////////////////////
var fs = require("fs");
var Web3 = require("web3");
var solc = require("solc");
var path = require("path");
var lookup = {
    "12sw" : "Southwest Airlines",
    "12dt" : "Delta Airlines",
    "12aa" : "American Airlines"
  }
var Instance;
var Accounts;
//var MarketPlace = require(path.join(__dirname,'build/contracts/MarketPlace.json'));

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

//var MarketPlaceContract = contract(MarketPlace);
var CONTRACT_FILE = "MarketPlace.sol";
var content = fs.readFileSync('./contracts/MarketPlace.sol',"utf8").toString();
var input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_FILE]: {
      content: content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
} 

var compiled = solc.compile(JSON.stringify(input));
var output = JSON.parse(compiled);
var abi = output.contracts[CONTRACT_FILE]['MarketPlace'].abi
var bytecode = '0x' + output.contracts[CONTRACT_FILE]['MarketPlace'].evm.bytecode.object


var mkPlace = new web3.eth.Contract(JSON.parse(JSON.stringify(abi)), null, { data: bytecode } );
var gasPrice;
var gass;



web3.eth.getGasPrice().then((averageGasPrice) => {
    console.log("Average gas price: " + averageGasPrice);
    gasPrice = averageGasPrice;
}).catch(console.error);

mkPlace.deploy().estimateGas().then((estimatedGas) => {
    console.log("Estimated gas: " + estimatedGas);
    gass = estimatedGas;
}).catch(console.error);

address = "0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b";

mkPlace.deploy().send({ from: address , gasPrice : gasPrice, gas: 1000000} ).then( function( instance ) {
    console.log( "Contract mined at " + instance.options.address );
    Instance = instance;
    

});


mongoose.connect("mongodb://localhost/test");

//var marketPlaceAbi = require("./marketPlaceAbi.js");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", function(){

    console.log("connected to database");
})


//console.log(user);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

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

*/






/*
    instance.methods.hello().call().then(function(value){
        console.log("current value:",value);
    });

    instance.methods.mint("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",5000).estimateGas().then(function(estimate){
        console.log("Estimated:", estimate);
        instance.methods.mint("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b",5000).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
            console.log("transaction tx : " ,tx);
        });
        instance.methods.display("0x13a97cB5a8014be0A14616d8dc1DF2C6abDaED6b").call().then(function(value){
            console.log("minter balance : ",value);
        });
    })
    */

