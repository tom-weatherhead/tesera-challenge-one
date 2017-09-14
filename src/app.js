#!/usr/bin/env node

'use strict';

const engine = require('..');

if (process.argv.length <= 2) {
	console.error('Insufficient number of arguments.');
	process.exit(-1);
}

const operation = process.argv[2];
const operationArgs = process.argv.slice(3);

try {
	engine(operation, operationArgs);
} catch (error) {
	console.error('Error:', error);
}
