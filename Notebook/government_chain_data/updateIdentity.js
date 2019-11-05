'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const channelId = "mychannel";

async function update_identity(req,res){

    try{
        let obj = JSON.stringify(req.body);
        const ccpPath = path.resolve(__dirname, '..', 'first-network', 'connection-org2.json');
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

        let response = await contract.submitTransaction('updateIdentity', obj);
        let resObj = JSON.parse(response.toString());
        await gateway.disconnect();
        res.json(resObj.message);
        
    }catch(error){
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = update_identity;