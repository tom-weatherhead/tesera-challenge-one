// tesera-challenge-one/src/engine.js

'use strict';

const fs = require('fs');
const path = require('path');

const dataFilePath = './data/store.json';
const dataFileDir = path.dirname(dataFilePath);

function throwError(errorCode, error, message, promise) {
	console.error(message);

	if (!error) {
		error = new Error(message);
	}

	error.errorCode = errorCode;
			
	if (promise) {
		promise.reject(error);
	} else {
		throw error;
	}
}

function guaranteeExistenceOfDataDir() {
	// console.log('fs.existsSync(dataFileDir) : ', fs.existsSync(dataFileDir));

	if (!fs.existsSync(dataFileDir)) {
		fs.mkdirSync(dataFileDir);
	}
}

function readStore(callback, promise) {
	if (!fs.existsSync(dataFilePath)) {
		callback({});
	} else {
		fs.readFile(dataFilePath, 'utf8', (errorReadFile, data) => {
			
			if (errorReadFile) {
				throwError('readStoreError', errorReadFile, null, promise);
			} else {
				callback(JSON.parse(data));
			}
		});
	}
}

function writeStore(data, promise, resultOfResolve) {
	guaranteeExistenceOfDataDir();
	fs.writeFile(dataFilePath, JSON.stringify(data), 'utf8', function (errorWriteFile) {

		if (errorWriteFile) {
			throwError('writeStoreError', errorWriteFile, null, promise);
		} else if (promise) {
			promise.resolve(resultOfResolve || data);
		}
	}); 
}

const operations = {
	add: (operationArgs, storeData, promise) => {

		if (operationArgs.length !== 2) {
			throwError('badNumArgs', null, 'store add: Expected 2 parameters, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		let [key, value] = operationArgs;

		storeData[key] = value;
		writeStore(storeData, promise, storeData);
	},
	list: (operationArgs, storeData, promise) => {
		// console.log('fooList: operationArgs is:', operationArgs);

		if (operationArgs.length !== 0) {
			// console.log('fooAdd: Expected zero parameters to \'store list\', not', operationArgs.length);
			// return null;
			throwError('badNumArgs', null, 'store list: Expected 0 parameters, not ' + operationArgs.length + ' parameter(s).', promise);
		}
		
		for (var key in storeData) {
			console.log('key:', key,'; value:', storeData[key]);
		}

		if (promise) {
			promise.resolve(null);
		}
	},
	get: (operationArgs, storeData, promise) => {
		// console.log('fooGet: operationArgs is:', operationArgs);

		if (operationArgs.length !== 1) {
			// console.log('fooAdd: Expected one parameter to \'store get\', not', operationArgs.length);
			// return null;
			throwError('badNumArgs', null, 'store get: Expected 1 parameter, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		let [key] = operationArgs;

		console.log('key:', key);
		console.log('The stored value for the key is:', storeData[key]);
		
		if (promise) {
			promise.resolve(storeData[key]);
		}
	},
	remove: (operationArgs, storeData, promise) => {
		// console.log('fooRemove: operationArgs is:', operationArgs);

		if (operationArgs.length !== 1) {
			// console.log('fooAdd: Expected one parameter to \'store remove\', not', operationArgs.length);
			// return null;
			throwError('badNumArgs', null, 'store remove: Expected 1 parameter, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		let [key] = operationArgs;

		// console.log('key:', key);
		delete storeData[key];
		writeStore(storeData, promise, storeData);
	}
};


const keys = Object.keys(operations).filter(x => operations.hasOwnProperty(x));

function executeStoreCommand(operation, operationArgs, promise) {
	// console.log('executeStoreCommand:', operation, operationArgs);

	if (keys.includes(operation)) {
		readStore(storeData => {
			// console.log('readStore: storeData:', storeData);
			// console.log('Executing the lambda for', operation, '...');
			operations[operation](operationArgs, storeData, promise);
		}, promise);
	} else {
		const message = 'Unrecognized operation: \'' + operation + '\'.';
		console.error(message);
			
		if (promise) {
			promise.reject(message);
		} else {
			throwError('unrecognizedOp', null, message, promise);
		}
	}
	
	if (promise) {
		return promise.promise;
	}
	
	return null;
}

module.exports = executeStoreCommand;
