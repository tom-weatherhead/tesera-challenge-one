// tesera-challenge-one/engine.js

'use strict';

const fs = require('fs');
const path = require('path');

const dataFilePath = './data/store.json';
const dataFileDir = path.dirname(dataFilePath);

function guaranteeExistenceOfDataDir() {
	console.log('fs.existsSync(dataFileDir) : ', fs.existsSync(dataFileDir));

	if (!fs.existsSync(dataFileDir)) {
		fs.mkdirSync(dataFileDir);
	}
}

function readStore(callback) {
	if (!fs.existsSync(dataFilePath)) {
		callback({});
	} else {
		fs.readFile(dataFilePath, 'utf8', (errorReadFile, data) => {
			
			if (errorReadFile) {
				return console.error(errorReadFile);
			} else {
				callback(JSON.parse(data));
			}
		});
	}
}

function writeStore(data) {
	guaranteeExistenceOfDataDir();
	fs.writeFile(dataFilePath, JSON.stringify(data), 'utf8', function (errorWriteFile) {

		if (errorWriteFile) {
			return console.error(errorWriteFile);
		}

		console.log('The data store file was saved.');
	}); 
}

// const errorMessages = {
	// badNumArgs: ''
// };

function throwError(errorCode, message) {
	console.error(message);

	let error = new Error(message);

	error.errorCode = errorCode;
	throw error;
}

const operations = {
	add: (operationArgs, storeData) => {
		// console.log('fooAdd: operationArgs is:', operationArgs);

		if (operationArgs.length !== 2) {
			const message = 
			// console.log('fooAdd: Expected two parameters to \'store add\', not', operationArgs.length);
			// return null;
			throwError('badNumArgs', 'store add: Expected 2 parameters, not ' + operationArgs.length + ' parameter(s).');
		}

		let [key, value] = operationArgs;

		// console.log('key:', key);
		// console.log('value:', value);
		storeData[key] = value;
		return storeData;
	},
	list: (operationArgs, storeData) => {
		console.log('fooList: operationArgs is:', operationArgs);

		if (operationArgs.length !== 0) {
			console.log('fooAdd: Expected zero parameters to \'store list\', not', operationArgs.length);
			return null;
		}
		
		for (var key in storeData) {
			console.log('key:', key,'; value:', storeData[key]);
		}

		return null;
	},
	get: (operationArgs, storeData) => {
		console.log('fooGet: operationArgs is:', operationArgs);

		if (operationArgs.length !== 1) {
			console.log('fooAdd: Expected one parameter to \'store get\', not', operationArgs.length);
			return null;
		}

		let [key] = operationArgs;

		console.log('key:', key);
		console.log('The stored value for the key is:', storeData[key]);
		return null;
	},
	remove: (operationArgs, storeData) => {
		console.log('fooRemove: operationArgs is:', operationArgs);

		if (operationArgs.length !== 1) {
			console.log('fooAdd: Expected one parameter to \'store remove\', not', operationArgs.length);
			return null;
		}

		let [key] = operationArgs;

		console.log('key:', key);
		delete storeData[key];
		return storeData;
	}
};


const keys = Object.keys(operations).filter(x => operations.hasOwnProperty(x));

// console.log('keys:', keys);

function executeStoreCommand(operation, operationArgs) {

	if (keys.includes(operation)) {
		readStore(storeData => {
			console.log('readStore: storeData:', storeData);
			console.log('Executing the lambda for', operation, '...');
			const newStoreData = operations[operation](operationArgs, storeData);
			
			if (newStoreData) {
				console.log('newStoreData:', newStoreData);
				writeStore(newStoreData);
			}
			
			console.log('Finito. Benvenuti.');
		});
	} else {
		console.error('Unrecognized operation', operation);
		throwError('unrecognizedOp', 'Unrecognized operation: \'' + operation + '\'.');
	}
}

module.exports = executeStoreCommand;
