'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

	async Init(stub) {
			let ret = stub.getFunctionAndParameters();
			console.info(ret);
			console.info('=========== Instantiated Vetro01 Chaincode ===========');
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
	
	async initAsset(stub, args, thisClass){
		/*
			Objective: Inserts a new asset in the database
			Params:
					- owner
					- currentOwner
					- assetName
					- assetValue
		*/
		if(args.length != 4){
			throw new Error('Incorrect number of arguments. Expecting 2');
		}

		// ==== Input sanitation ====
		console.info('--- start init asset ---')
		
		if (args[0].length <= 0) {
			throw new Error('1st argument must be a non-empty string');
		}
		if (args[1].length <= 0) {
			throw new Error('2nd argument must be a non-empty string');
		}
		if(args[2].length <= 0) {
			throw new Error('3rd argument must be a non-empty string');
		}
		if(args[3].length <= 0) {
			throw new Error('4th argument must be a non-empty string');
		}

		let owner = args[0];
		let currentOwner = args[1];
		let assetName = args[2];
		let assetValue = args[3];
	
		let asset = {};
		asset.owner = owner;
		asset.currentOwner = currentOwner;
		asset.assetName = assetName;
		asset.assetValue = assetValue;
		await stub.putState(assetName, Buffer.from(JSON.stringify(asset)));
		console.log("end")
	}

	async readAsset(stub, args, thisClass) {
		/*
			Objective: returns an existing asset info in the database
			Params:
					- assetName
		*/
		if (args.length != 1) {
			throw new Error('Incorrect number of arguments. Expecting asset name in query');
		}

		let assetName = args[0];
		if (!assetName) {
			throw new Error(' asset name must not be empty');
		}
		let assetAsbytes = await stub.getState(assetName); //get the marble from chaincode state
		if (!assetAsbytes.toString()) {
			let jsonResp = {};
			jsonResp.Error = 'asset does not exist: ' + assetName;
			throw new Error(JSON.stringify(jsonResp));
		}
		console.info('=======================================');
		console.log(assetAsbytes.toString());
		console.info('=======================================');
		return assetAsbytes;
	}

	async readAssetByCurrentOwner(stub, args, thisClass) {
		/*
			Objective : Returns currently held by a particular organization
			Params:
					- currentOwner
		*/
		if (args.length < 1) {
			throw new Error('Incorrect number of arguments. Expecting owner name.');
		}

		let currentOwner = args[0]
		if (!currentOwner) {
			throw new Error(' owner name must not be empty');
		}
		let queryString = {};
		queryString.selector = {};
		queryString.selector.currentOwner = currentOwner;
		let method = thisClass['getQueryResultForQueryString'];
		let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
		return queryResults;
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

	async getHistoryForAsset(stub, args, thisClass) {
		/*
				Objective: returns history of an existing asset in the database
				Params:
						- assetName
		*/

		if (args.length < 1) {
			throw new Error('Incorrect number of arguments. Expecting 1')
		}
		let assetName = args[0];
		if (!assetName) {
			throw new Error(' asset name must not be empty');
		}
		console.info('- start getHistoryForAsset: %s\n', assetName);

		let resultsIterator = await stub.getHistoryForKey(assetName);
		let method = thisClass['getAllResults'];
		let results = await method(resultsIterator, true);

		return Buffer.from(JSON.stringify(results));
	}

	async deleteAsset(stub, args, thisClass) {
		/*
				Objective: deletes the asset from the database
				Params:
						- assetName
		*/
		if (args.length < 1) {
			throw new Error('Incorrect number of arguments. Expecting 1')
		}

		let assetName = args[0];
		if (!assetName) {
			throw new Error(' asset name must not be empty');
		}
		console.info("- Deleting the asset: %s\n", assetName);
		await deleteState(assetName);
	}
	
	async transferAsset(stub, args, thisClass) {
		/*
				Objective: transfers asset between users 
				Params: 
						- currentOwner
						- newOwner
						- assetName
		*/
		if (args.length < 3) {
			throw new Error('Incorrect number of arguments. Expecting 3.');
		}

		if (args[0].length <= 0) {
			throw new Error('1st argument must be a non-empty string');
		}
		if (args[1].length <= 0) {
			throw new Error('2nd argument must be a non-empty string');
		}
		if(args[2].length <= 0) {
			throw new Error('3rd argument must be a non-empty string');
		}
		
		let currentOwner = args[0];
		let newOwner = args[1];
		let assetName = args[2];

		let assetAsbytes = await stub.getState(assetName);
		if (!assetAsbytes.toString()) {
			let jsonResp = {};
			jsonResp.Error = 'Asset does not exist: ' + assetName;
			throw new Error(JSON.stringify(jsonResp));
		}

		let assetJSON = JSON.parse(assetAsbytes.toString()); 
		if(assetJSON.currentOwner == currentOwner){
			assetJSON.currentOwner = newOwner;
			await stub.putState(assetName, Buffer.from(JSON.stringify(assetJSON)));
		}else{
			let jsonResp = {};
            jsonResp.Error = 'WARNING: cannnot transfer asset because specified current owner doesnt hold that asset: ' + assetName;
            throw new Error(JSON.stringify(jsonResp));
		}
	
	}

	async redeem(stub, args, thisClass) {
		/*
				Objective: transfers asset to the original owner 
				Params: 
						- redeemingOwner
						- assetName
		*/
		if (args.length < 2) {
			throw new Error('Incorrect number of arguments. Expecting 2.');
		}
		if (args[0].length <= 0) {
			throw new Error('1st argument must be a non-empty string');
		}
		if (args[1].length <= 0) {
			throw new Error('2nd argument must be a non-empty string');
		}

		let redeemingOwner = args[0]
		let assetName = args[1]

		let assetAsbytes = await stub.getState(assetName);
		if (!assetAsbytes.toString()) {
			let jsonResp = {};
			jsonResp.Error = 'Asset does not exist: ' + assetName;
			throw new Error(JSON.stringify(jsonResp));
		}

		let assetJSON = JSON.parse(assetAsbytes.toString());

		if(assetJSON.currentOwner == redeemingOwner){
			let jsonResp = {};
			jsonResp.Error = 'Redeeming owner already holds the asset: ' + assetName;
			throw new Error(JSON.stringify(jsonResp));
		}
		
		if(assetJSON.owner == redeemingOwner){
			assetJSON.currentOwner = redeemingOwner;
			await stub.putState(assetName, Buffer.from(JSON.stringify(assetJSON)));
		}else{
			let jsonResp = {};
            jsonResp.Error = 'WARNING: cannnot transfer asset because sepcified redeeming owner is not the original owner of the asset : ' + assetName;
            throw new Error(JSON.stringify(jsonResp));
		} 
	}
}

shim.start(new Chaincode());