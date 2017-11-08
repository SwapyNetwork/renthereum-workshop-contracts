const should = require('chai')
    .use(require('chai-as-promised'))
    .should()
const expect = require('chai').expect;


// --- Artifacts
const Renthereum = artifacts.require("./Renthereum.sol");

// --- Test variables 
let owner = null;
let customer = null;
let renthereum = null;

contract('Renthereum', accounts => {

    before( done => {
        owner = accounts[0];
        customer = accounts[1];
        Renthereum.new().then(contract => {
            renthereum = contract;
            done();
        })
    })
    
    it("should rent an item", done => {
        renthereum.createOrder('123456789','bike','a great bike', 23, 1, 30).then(transaction => {
            should.exist(transaction.tx);
            renthereum.Ordered( { _id : '123456789' }).watch((err, log) => {
                const event = log.args;
                expect(event).to.include.all.keys([
                    '_id',
                    '_owner',
                    '_name',
                    '_value'
                ]);
                assert.equal(event._owner, owner, "The user must be the owner of the rent order");
                done();        
            })
        })
    })

})