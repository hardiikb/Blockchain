var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./users");
var Items = require("./items");

/////////////////////////////////////////////////////////////
var fs = require("fs");
var Web3 = require("web3");
var solc = require("solc");
var path = require("path");
var Instance;
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

app.get("/:id", function(req,res){
	console.log("Client Connected");
    console.log(req.params.id);    
    
    Users.findOne({userId: req.params.id }, function(err,user){

        Items.findOne({userId: req.params.id }, function(err,items){
            
            Items.find({userId: { $not: { $eq : req.params.id } } }, function(err,itemsToBuy){
                console.log(itemsToBuy);
                res.json({
                    user:user,
                    items:items,
                    itemsToBuy:itemsToBuy
                });
            })
            
        })
    })
    


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

app.put("/",function(req,res){
    console.log("put req received");
    console.log(req.body);
    /*
    Items.update({userId : "1234"}, {$push: {onCart: {itemName:"doll",itemPrice : 50, itemId:"2345"}}},function(err,suceess){
        if(err){
            console.log(err);
        }
    });*/
    // push the item in the sale list
    Items.findOneAndUpdate({userId : req.body.userId}, {$push: {onSale: req.body.item}}, function(err,success){
        if(err){
            console.log(err);
        }
    });

    // pull out the item from cart:
    Items.findOneAndUpdate({userId : req.body.userId}, {$pull: {onCart: req.body.item}}, function(err,success){
        if(err){
            console.log(err);
        }
    });
    res.json("update success");
});

app.put("/:hello",function(req,res){
    console.log("hello put received");
    console.log(req.body);
    Items.findOneAndUpdate({userId : req.body.cartUserId}, {$push: {onCart: req.body.item}}, function(err,success){
        if(err){
            console.log(err);
        }
    });

    Items.findOne({userId : req.body.cartUserId},function(err,user){
        let final_cart =  user.balance - req.body.item.itemPrice;
        Items.findOneAndUpdate({userId : req.body.cartUserId}, {$set : {balance : final_cart}}, function(err,success){
            if(err){
                console.log(err);
            }
        });

    });
    /*
    Items.findOneAndUpdate({userId : req.body.cartUserId}, {$set : {balance : balance - req.body.item.itemPrice}}, function(err,success){
        if(err){
            console.log(err);
        }
    });
    */
    Items.findOneAndUpdate({userId : req.body.saleUserId}, {$pull: {onSale: req.body.item}}, function(err,success){
        if(err){
            console.log(err);
        }
    });

    Items.findOne({userId : req.body.saleUserId},function(err,user){
        let final_sale =  user.balance + req.body.item.itemPrice;
        Items.findOneAndUpdate({userId : req.body.saleUserId}, {$set : {balance : final_sale}}, function(err,success){
            if(err){
                console.log(err);
            }
        });
    });
    /*
    Items.findOneAndUpdate({userId : req.body.saleUserId}, {$set : {balance : balance + req.body.item.itemPrice}}, function(err,success){
        if(err){
            console.log(err);
        }
    });
    */
    Instance.methods.buy(req.body.seller,req.body.buyer,req.body.item.itemPrice).estimateGas().then(function(estimate){
        console.log("Estimated:", estimate);
        Instance.methods.buy(req.body.seller,req.body.buyer,req.body.item.itemPrice).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
            console.log("transaction tx : " ,tx);
            Instance.methods.display(req.body.seller).call().then(function(value){
                console.log("User balance : ",value);
            });
        });
        
    });

    res.json("transfer success");
});

app.get("/:refill/:addr/:method/:superuser",function(req,res){
    console.log("refill");
    console.log(req.params.refill);
    console.log(req.params.addr);
    console.log(req.params.method);
    console.log(req.params.superuser);
    if(req.params.method == "register"){
        console.log("regitser");
        Items.findOneAndUpdate({userId : req.params.refill}, {$set : {balance : 500}}, function(err,success){
                if(err){
                    console.log(err);
                }
        });

        Instance.methods.register(req.params.addr,500).estimateGas().then(function(estimate){
            console.log("Estimated:", estimate);
            Instance.methods.register(req.params.addr,500).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                console.log("transaction tx : " ,tx);
                Instance.methods.display(req.params.addr).call().then(function(value){
                    console.log("User balance : ",value);
                });
            });
        
        });
    }
    if(req.params.method == "unregister"){
        console.log("unregister");
        Items.findOneAndUpdate({userId : req.params.refill}, {$set : {balance : 0}}, function(err,success){
                if(err){
                    console.log(err);
                }
        });

        Instance.methods.unregister(req.params.addr).estimateGas().then(function(estimate){
            console.log("Estimated:", estimate);
            Instance.methods.register(req.params.addr,0).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                console.log("transaction tx : " ,tx);
                Instance.methods.display(req.params.addr).call().then(function(value){
                    console.log("User balance : ",value);
                });
            });
        
        });

    }

    if(req.params.method == "mint"){
        console.log(req.params.superuser);
        console.log("mint");
        Instance.methods.mint(req.params.superuser,5000).estimateGas().then(function(estimate){
            console.log("Estimated:", estimate);
            Instance.methods.mint(req.params.superuser,5000).send({from:address, gas :estimate+1, gasPrice : 1000000}).then(function(tx){
                console.log("transaction tx : " ,tx);
                Instance.methods.display(req.params.superuser).call().then(function(value){
                    console.log("User balance : ",value);
                });
            });
        
        });

    }  
    
    res.json("refill complete");
})
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
*/    
