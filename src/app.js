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

const path = require('path');

const engine = require('..');

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

try {
	engine(operation, operationArgs);
} catch (error) {
	console.error('Error:', error);
}
