var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index.js');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('LogIn', function(){
    it('should open login page', function(done){
        chai.request(server).get('/login').end(function(err, res){
            res.should.have.status(200);
            done();

        });
    })
    it('should open home page', function(done){
        chai.request(server).get('/').end(function(err, res){
            res.should.have.status(200);
            done();
        });
    })
    it('should open signup page', function(done){
        chai.request(server).get('/signup').end(function(err, res){
            res.should.have.status(200);
            done();
        });
    })

    it('should not allow a login and redirect', function(done){
        chai.request(server).post('/login').send({'username':'tester','password':24}).end(function(err, res){
            res.body.should.be.a('object');
            expect(res).to.redirect;
            res.should.have.status(200);
            done();
        });
    });
});