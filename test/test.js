var assert = require('chai').assert;
var supertest = require('supertest');


// refers to port where programm is running
var server = supertest("http://localhost:3000/api");

// test begins


describe("UNIT Test", function(){

	it("should get 200 when access api/questions", function(done){
		server.get('/questions')
		.set('Accept', 'application/json')
		.expect(200,done)
	});
		

});

