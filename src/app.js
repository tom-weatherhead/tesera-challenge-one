#!/usr/bin/env node

// tesera-challenge-one/src/app.js

// ### Goal
// Clone this repo and build a simple key/value store CLI using only the core Node API. Once you have finished the challenge zip and email your solution to the email provided.

// ### Store API

// `$ store add mykey myvalue`

// `$ store list`

// `$ store get mykey`

// `$ store remove mykey`

'use strict';

const fs = require('fs');
const path = require('path');

// npm i -g grunt
// npm i --save-dev babel-cli babel-preset-env chai grunt grunt-cli grunt-eslint grunt-mocha-test grunt-nsp mocha

// X : babel-preset-env 

// npm i --save-dev babel-cli chai grunt grunt-cli grunt-eslint grunt-mocha-test grunt-nsp mocha

// From https://code-maven.com/argv-raw-command-line-arguments-in-nodejs :

console.log('process.argv:', process.argv);

if (process.argv.length <= 2) {
	console.log('Usage:', __filename, 'SOME_PARAM');
	process.exit(-1);
}

const cmd = process.argv[1];
const cmdFile = path.basename(cmd);
const operation = process.argv[2];
const operationArgs = process.argv.slice(3);

console.log('cmd:', cmd);
console.log('cmdFile:', cmdFile);
console.log('operation:', operation);
console.log('operationArgs:', operationArgs);

// TODO: Factor out everything but the CLI into src/engine.js so that it can be unit-tested.

const dataFilePath = './data/store.json';
const dataFileDir = path.dirname(dataFilePath);

function guaranteeExistenceOfDataDir() {
	// console.log('fs.existsSync(\'./data\') : ', fs.existsSync('./data'));

	// if (!fs.existsSync('./data')) {
		// fs.mkdirSync('./data');
	// }
	console.log('fs.existsSync(dataFileDir) : ', fs.existsSync(dataFileDir));

	if (!fs.existsSync(dataFileDir)) {
		fs.mkdirSync(dataFileDir);
	}
}

function readStore(callback) {
	// fs.readFile('/etc/passwd', (err, data) => {
		// if (err) throw err;
		// console.log(data);
	// });
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

// readStore(storeData => {
	// console.log('readStore: storeData:', storeData);
// });

const operations = {
	add: (operationArgs, storeData) => {
		console.log('fooAdd: operationArgs is:', operationArgs);

		if (operationArgs.length !== 2) {
			console.log('fooAdd: Expected two parameters to \'store add\', not', operationArgs.length);
			return null;
		}

		let [key, value] = operationArgs;

		console.log('key:', key);
		console.log('value:', value);
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

console.log('keys:', keys);

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
}
