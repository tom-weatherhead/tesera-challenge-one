// tesera-challenge-one/src/engine.js

'use strict';

const fs = require('fs');
const path = require('path');

const dataFilePath = './data/store.json';
const dataFileDir = path.dirname(dataFilePath);

function throwError (errorCode, error, message, promise) {
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

function guaranteeExistenceOfDataDir () {

	if (!fs.existsSync(dataFileDir)) {
		fs.mkdirSync(dataFileDir);
	}
}

function readStore (callback, promise) {
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

function writeStore (data, promise, resultOfResolve) {
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
		writeStore(storeData, promise);
	},
	list: (operationArgs, storeData, promise) => {

		if (operationArgs.length !== 0) {
			throwError('badNumArgs', null, 'store list: Expected 0 parameters, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		for (var key in storeData) {
			console.log('Key', key, 'is associated with value', storeData[key]);
		}

		if (promise) {
			promise.resolve(storeData);
		}
	},
	get: (operationArgs, storeData, promise) => {

		if (operationArgs.length !== 1) {
			throwError('badNumArgs', null, 'store get: Expected 1 parameter, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		let [key] = operationArgs;

		console.log('Key', key, 'is associated with value', storeData[key]);

		if (promise) {
			promise.resolve(storeData[key] || null);
		}
	},
	remove: (operationArgs, storeData, promise) => {

		if (operationArgs.length !== 1) {
			throwError('badNumArgs', null, 'store remove: Expected 1 parameter, not ' + operationArgs.length + ' parameter(s).', promise);
		}

		let [key] = operationArgs;

		delete storeData[key];
		writeStore(storeData, promise);
	}
};


const keys = Object.keys(operations).filter(x => operations.hasOwnProperty(x));

function executeStoreCommand (operation, operationArgs, promiseFactory) {
	let promise;

	if (promiseFactory) {
		promise = promiseFactory();
	}

	if (keys.includes(operation)) {
		readStore(storeData => {
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
