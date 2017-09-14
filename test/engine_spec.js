// tesera-challenge-one/test/engine_spec.js

'use strict';

const fs = require('fs');

// npm package q : Promises for JavaScript.
// See https://www.npmjs.com/package/q and https://github.com/kriskowal/q
const Q = require('q');

const chai = require('chai');
const expect = chai.expect;

const engine = require('..');

function promiseFactory () {
	return Q.defer();
}

describe('App', function () {
	beforeEach(function (done) {								// eslint-disable-line no-undef
		const dataFilePath = './data/store.json';

		if (fs.existsSync(dataFilePath)) {
			fs.unlinkSync(dataFilePath);
		}

		done();
	});

	describe('store add a and b', function () {
		it('Rocks!', function (done) {
			// Arrange
			// Act
			engine('add', ['a', '7'], promiseFactory)
				.then(result => {
					expect(result).to.be.deep.equal(
						{ a: '7' }
					);

					return engine('add', ['b', '21'], promiseFactory);
				})
				.then(result => {
					// Assert
					expect(result).to.be.deep.equal(
						{ a: '7', b: '21' }
					);
					done();
				});
		});
	});

	describe('store list', function () {
		it('Rocks!', function (done) {
			// Arrange
			engine('add', ['a', '7'], promiseFactory)
				.then(() => { return engine('add', ['b', '13'], promiseFactory); })
				.then(() => { return engine('add', ['c', '91'], promiseFactory); })
				// Act
				.then(() => { return engine('list', [], promiseFactory); })
				.then(result => {
					// Assert
					expect(result).to.be.deep.equal(
						{ a: '7', b: '13', c: '91' }
					);
					done();
				});
		});
	});

	describe('store get existent', function () {
		it('Rocks!', function (done) {
			// Arrange
			engine('add', ['a', '7'], promiseFactory)
				// Act
				.then(() => { return engine('get', ['a'], promiseFactory); })
				.then(result => {
					// Assert
					expect(result).to.equal('7');
					done();
				});
		});
	});

	describe('store get non-existent', function () {
		it('Rocks!', function (done) {
			// Arrange
			engine('add', ['a', '7'], promiseFactory)
				// Act
				.then(() => { return engine('get', ['z'], promiseFactory); })
				.then(result => {
					// Assert
					expect(result).to.be.null;		// eslint-disable-line no-unused-expressions
					done();
				});
		});
	});

	describe('store remove b', function () {
		it('Rocks!', function (done) {
			// Arrange
			engine('add', ['a', '7'], promiseFactory)
				.then(() => { return engine('add', ['b', '13'], promiseFactory); })
				.then(() => { return engine('add', ['c', '91'], promiseFactory); })
				// Act
				.then(() => { return engine('remove', ['b'], promiseFactory); })
				.then(result => {
					// Assert
					expect(result).to.be.deep.equal(
						{ a: '7', c: '91' }
					);
					done();
				});
		});
	});
});
