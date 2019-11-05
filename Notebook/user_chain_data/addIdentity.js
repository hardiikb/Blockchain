'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const channelId = "mychannel";

async function add_identity(req,res){

    try{
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let passportNo = req.body.passportNo;
        let bioMetrics = req.body.bioMetrics;
        let dob = req.body.dob;
        let passportIssue = req.body.passportIssue;
        let passportExpiry = req.body.passportExpiry;
        let countryCode = req.body.countryCode;

        let type = req.body.type;

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

        let response = await contract.submitTransaction('initIdentity', passportNo, bioMetrics, firstName, lastName, countryCode, type, dob, passportIssue, passportExpiry);
        let resObj = JSON.parse(response.toString());
        await gateway.disconnect();
        res.json(resObj.message);
        
    }catch(error){
        res.json(`Failed to submit transaction: ${error}`);
    }
}

module.exports = add_identity;