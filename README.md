# tesera-challenge-one

[![build status](https://secure.travis-ci.org/tom-weatherhead/tesera-challenge-one.svg)](http://travis-ci.org/tom-weatherhead/tesera-challenge-one)

tesera-challenge-one

Simple Node developer challenge.

### Store API

$ store add mykey myvalue

$ store list

$ store get mykey

$ store remove mykey

Git installation instructions: Minimal:

	$ git clone https://github.com/tom-weatherhead/tesera-challenge-one.git
	$ cd tesera-challenge-one
	$ npm link

Additional instructions for running security, lint, and unit tests:

	$ npm install -g grunt
	$ npm install
	$ grunt

Example usage:

	$ store add a 2
	$ store add b 3
	$ store add c 5
	$ store list
	$ store get b
	$ store remove b
	$ store list
