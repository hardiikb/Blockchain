'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const channelId = "mychannel";

async function read_identity(req, res){

    try{
        let passportNo = req.params.passportNo;
        let bioMetrics = req.params.bioMetrics;

        if(passportNo == "null"){
            passportNo = null;
        }
        if(bioMetrics == "null"){
            bioMetrics = null;
        }
        
        const ccpPath = path.resolve(__dirname, '..', 'first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Configure a wallet. This wallet must already be primed with an identity that
        // the application can use to interact with the peer node.
        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway, and connect to the gateway peer node(s). The identity
        // specified must already exist in the specified wallet.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        
        const network = await gateway.getNetwork(channelId);
        const contract = network.getContract('mycc');

        if(passportNo){
            var identity = await contract.evaluateTransaction('readIdentity', passportNo);
            await gateway.disconnect();
            res.json(identity.toString())
        }else{
            var identity = await contract.evaluateTransaction('queryIdentityByBioMetrics', bioMetrics);
            let resObj = JSON.parse(identity.toString())
            if(resObj[0] != undefined){
                await gateway.disconnect();
                res.json(JSON.stringify(resObj[0]["Record"]))
                return 
            }else{
                let jsonResp = {};
                jsonResp.message = 'Bio Metrics Are Not Matching ';
                res.json(JSON.stringify(jsonResp));
            }
        }
        //console.log("Fetched an identity");
        // let resObj = JSON.parse(identity.toString());
        // if("message" in resObj){
        //     res.json(resObj.message)
        // }else{
        //     res.json(identity.toString());
        // }      
    }catch(error){
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
module.exports = read_identity;