/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the landing page if the url is correct', function(done){
		http.get('http://localhost:1100/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should return the login page', function(done){
		http.get('http://localhost:1100/login', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should login', function(done) {
		request.post(
			    'http://localhost:1100/loginUser',
			    { form: { username: 'gaurav51289',password:'gc12345' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('should return search result', function(done) {
		request.post(
			    'http://localhost:1100/search',
			    { form: { searchString: 'cmpe273'} },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('should render the profile page', function(done) {
		request.get(
			    'http://localhost:1100/gaurav51289',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('should logout', function(done){
		http.get('http://localhost:1100/logout', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
});