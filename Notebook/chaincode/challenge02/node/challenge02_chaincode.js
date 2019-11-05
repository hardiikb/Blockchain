'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

    async Init(stub) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
        console.info('=========== Instantiated Identity Chaincode ===========');
        return shim.success();
    }

    async Invoke(stub) {
        console.info('Transaction ID: ' + stub.getTxID());
        console.info(util.format('Args: %j', stub.getArgs()));
    
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
    
        let method = this[ret.fcn];
        if (!method) {
          console.log('no function of name:' + ret.fcn + ' found');
          throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
          let payload = await method(stub, ret.params, this);
          return shim.success(payload);
        } catch (err) {
          console.log(err);
          return shim.error(err);
        }
    }

    async initIdentity(stub, args, thisClass){
        if(args.length != 9){
            throw new Error('Incorrect number of arguments. Expecting 4');
        }

        // ==== Input sanitation ====
        console.info('--- start init idenitity ---')
        console.log(stub.getTxID())
        if (args[0].length <= 0) {
            throw new Error('1st argument must be a non-empty string');
        }
        if (args[1].length <= 0) {
            throw new Error('2nd argument must be a non-empty string');
        }
        if (args[2].length <= 0) {
            throw new Error('3rd argument must be a non-empty string');
        }
        if (args[3].length <= 0) {
            throw new Error('4th argument must be a non-empty string');
        }
        if (args[4].length <= 0) {
            throw new Error('5th argument must be a non-empty string');
        }
        if (args[5].length <= 0) {
            throw new Error('6th argument must be a non-empty string');
        }
        if (args[6].length <= 0) {
            throw new Error('7th argument must be a non-empty string');
        }
        if (args[7].length <= 0) {
            throw new Error('8th argument must be a non-empty string');
        }
        if (args[8].length <= 0) {
            throw new Error('9th argument must be a non-empty string');
        }
        let passportNo = args[0];
        let bioMetrics = args[1];
        let givenName = args[2];
        let lastName = args[3];
        let countryCode = args[4];
        let type = args[5];
        let birthDate = args[6];
        let issueDate = args[7];
        let expiryDate = args[8];


        // ==== Check if idenitity already exists ====
        let identityState = await stub.getState(passportNo);

        /* Query Method
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'passport';
        queryString.selector.passportNo = passportNo;
        let method = thisClass['getQueryResultForQueryString'];
        let queryResults = await method(stub, JSON.stringify(queryString), thisClass);  // returns array
        */
       let jsonResp = {};
        // if exists, check the biometrics whether it matches or not
        if(identityState.toString()){
            console.log("if")
            let identityJSON = JSON.parse(identityState.toString());
            if(identityJSON.bioMetrics == bioMetrics){
                jsonResp.message = "SNAP: Looks like the identity is already registered";
                console.log(jsonResp.message);
                return Buffer.from(JSON.stringify(jsonResp));
            }else{
                jsonResp.message = 'WARNING: Idenitity already exist with different biometrics: ' + passportNo;
                return Buffer.from(JSON.stringify(jsonResp));
            }
        }else{
            // New entry: write into the databse
            console.log("else")
            let idenitity = {};
            idenitity.docType = "passport";
            idenitity.passportNo = passportNo;
            idenitity.bioMetrics = bioMetrics;
            idenitity.givenName = givenName;
            idenitity.lastName = lastName;
            idenitity.countryCode = countryCode;
            idenitity.type = type;
            idenitity.birthDate = birthDate;
            idenitity.issueDate = issueDate;
            idenitity.expiryDate = expiryDate;
            let transaction = await stub.putState(passportNo, Buffer.from(JSON.stringify(idenitity)));
            console.log(transaction.toString());
            jsonResp.message = "Hurray!! Your Identity Has Been Registered";
            return Buffer.from(JSON.stringify(jsonResp));
        }
    }

    async updateIdentity(stub, args, thisClass){
        if(args.length != 1){
            throw new Error('Incorrect number of arguments. Expecting 1');
        }
        console.log("update identity")
        console.log(stub.getTxID())
        // ==== Input sanitation ====
        if (args[0].length <= 0) {
            throw new Error('1st argument must be a non-empty string');
        }

        let inputString = args[0];
        let updateJSON = JSON.parse(inputString);
        let passportNo = updateJSON.passportNo;
        let bioMetrics = updateJSON.bioMetrics;

        // Retrieve the identity from the database for checking
        let identityAsbytes = await stub.getState(passportNo);

        // add a scenario for a case where the given identity doesn't exist.
        if (!identityAsbytes.toString()) {
            let jsonResp = {};
            jsonResp.message = 'Identity does not exist: ' + passportNo;
            return Buffer.from(JSON.stringify(jsonResp));
        }
        let identityJSON = JSON.parse(identityAsbytes.toString()); 

        let jsonResp = {};
        // Check for the biometric matching
        if(identityJSON.bioMetrics == bioMetrics){
            // Authentic user 
            if("newPassportNo" in updateJSON){
                identityJSON.passportNo = updateJSON.newPassportNo;
                await stub.deleteState(passportNo);
            }
            if("givenName" in updateJSON){
                identityJSON.givenName = updateJSON.givenName;
            }
            if("lastName" in updateJSON){
                identityJSON.lastName = updateJSON.lastName;
            }
            if("birthDate" in updateJSON){
                identityJSON.birthDate = updateJSON.birthDate;
            }
            
            let transaction = await stub.putState(identityJSON.passportNo, Buffer.from(JSON.stringify(identityJSON)));
            console.log(transaction.toString());
            jsonResp.message = "Hurray!! Your Identity Has Been Updated";
            return Buffer.from(JSON.stringify(jsonResp));
        }else{
            // Fraud alert
            jsonResp.message = 'WARNING: cannnot update idenitity because its biometrics are not matching: ' + passportNo;
            return Buffer.from(JSON.stringify(jsonResp));
        }
    }

    async readIdentity(stub, args, thisClass) {
        if (args.length != 1) {
          throw new Error('Incorrect number of arguments. Expecting passport no in query');
        }
        console.log("read identity")
        console.log(stub.getTxID())
        let passportNo = args[0];
        if (!passportNo) {
          throw new Error('Passport No must not be empty');
        }
        let identityAsbytes = await stub.getState(passportNo); //get the marble from chaincode state
        if (!identityAsbytes.toString()) {
          let jsonResp = {};
          jsonResp.message = 'Identity does not exist: ' + passportNo;
          return Buffer.from(JSON.stringify(jsonResp));
        }
        console.info('=======================================');
        console.log(identityAsbytes.toString());
        console.info('=======================================');
        return identityAsbytes;
    }

    async queryIdentityByBioMetrics(stub, args, thisClass){
        if (args.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }

        let bioMetrics = args[0];
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'passport';
        queryString.selector.bioMetrics = bioMetrics;
        let method = thisClass['getQueryResultForQueryString'];
        let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
        return queryResults; //shim.success(queryResults);
    }

    async getQueryResultForQueryString(stub, queryString, thisClass) {

        console.info('- getQueryResultForQueryString queryString:\n' + queryString)
        let resultsIterator = await stub.getQueryResult(queryString);
        let method = thisClass['getAllResults'];
    
        let results = await method(resultsIterator, false);
    
        return Buffer.from(JSON.stringify(results));
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
    
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              jsonRes.IsDelete = res.value.is_delete.toString();
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
          }
        }
    }

    async getHistoryForIdentity(stub, args, thisClass) {

        if (args.length < 1) {
          throw new Error('Incorrect number of arguments. Expecting 1')
        }
        let passportNo = args[0];
        console.info('- start getHistoryForIdentity: %s\n', passportNo);
    
        let resultsIterator = await stub.getHistoryForKey(passportNo);
        let method = thisClass['getAllResults'];
        let results = await method(resultsIterator, true);
    
        return Buffer.from(JSON.stringify(results));
    }


}

shim.start(new Chaincode());