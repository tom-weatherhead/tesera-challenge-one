// tesera-challenge-one/test/engine_spec.js

'use strict';

const Q = require('q');	// Promises for JavaScript. See https://www.npmjs.com/package/q and https://github.com/kriskowal/q

const chai = require('chai');
const expect = chai.expect;

const engine = require('..');

describe('App', function () {
	describe('store get a', function () {
		it('Rocks!', function (done) {
			let deferred = Q.defer();

			// try {
				// Arrange
				// Act
				engine('get', ['a'], deferred)
					.then(result => {
						// Assert
						console.log('Test: store get a: result is: ', result);
						expect(result).to.be.not.null;		// eslint-disable-line no-unused-expressions
						// expect(result).to.equal(7);
						expect(result).to.equal('7');
						done();
					})
					.fail(error => {
						console.error('Test: store get a: error:\n\n', error, '\n');
						expect(null).to.be.not.null;		// eslint-disable-line no-unused-expressions
						done();
					})
					// .done()
					;
			// } catch (error) {
				// expect(testDescriptor.errorHandlingFunction).to.be.not.null;	// eslint-disable-line no-unused-expressions
				// testDescriptor.errorHandlingFunction(engine, expect, error.message);
				// done();
			// }
		});
	});
});
