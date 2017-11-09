const should = require('chai')
    .use(require('chai-as-promised'))
    .should()
const expect = require('chai').expect;

// --- Artifacts
const Renthereum = artifacts.require("./Renthereum.sol");

// --- Test constants 
const itemsToOrder = [{
    id: '123456789',
    name : 'bike',
    description: 'a great bike',
    dailyValue: 23,
    minPeriod: 1,
    maxPeriod: 30
}, {
    id: '1234567891',    
    name: 'car',
    description: 'beautiful SUV',
    dailyValue: 1200,
    minPeriod: 1,
    maxPeriod: 180
}]; 

// --- Test variables 
let owner = null;
let customer = null;
let renthereum = null;
let itemsToRent = [];

contract('Renthereum', accounts => {

    before( done => {
        owner = accounts[0];
        customer = accounts[1];
        Renthereum.new().then(contract => {
            renthereum = contract;
            const promises = [
                renthereum.Ordered().watch(()=>{}),
                renthereum.Canceled().watch(()=>{}),
                renthereum.Rented().watch(()=>{}),
            ]
            Promise.all(promises).then(() => {
                done();
            })            
        })
    })
    
    it("should order an item", done => {
        let item = itemsToOrder[0];
        renthereum.createOrder(item.id,item.name,item.description, item.dailyValue, item.minPeriod, item.maxPeriod, {from: owner}).then(transaction => {
            should.exist(transaction.tx);
            renthereum.Ordered().get(function(err, logs){
                const event = logs[0].args;
                expect(event).to.include.all.keys([
                    '_index',
                    '_id',
                    '_owner',
                    '_name',
                    '_value'
                ]);
                assert.equal(event._owner, owner, "The user must be the owner of the rent order");
                itemsToRent.push(event);
                done();       
            })
        })
    })

    it("should cancel a rent order", done => {
        let itemIndex = itemsToRent[0]._index;
        renthereum.cancelOrder(itemIndex, {from: owner}).then(transaction => {
            should.exist(transaction.tx);
            renthereum.Canceled().get(function(err, logs){
                const event = logs[0].args;
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

    it("should order an second item", done => {
        let item = itemsToOrder[1];
        renthereum.createOrder(item.id, item.name, item.description, item.dailyValue, item.minPeriod, item.maxPeriod, {from: owner}).then(transaction => {
            should.exist(transaction.tx);
            renthereum.Ordered().get(function(err, logs){
                const event = logs[0].args;
                itemsToRent.push(event);    
                done();        
            })
        })
    })

    it("should rent an item", done => {
        let itemIndex = itemsToRent[1]._index;
        renthereum.rent(itemIndex, 30, {from: customer, value: 1200 * 30}).then(transaction => {
            should.exist(transaction.tx);
            renthereum.Rented().get(function(err, logs){
                const event = logs[0].args;
                expect(event).to.include.all.keys([
                    '_owner',
                    '_customer',
                    '_period',
                    '_value'
                ]);
                assert.equal(event._customer, customer, "The user must be the customer of the order");
                done();              
            })
        })
    })

    after(done => {
        const promises = [
            renthereum.Ordered().stopWatching(),
            renthereum.Canceled().stopWatching(),
            renthereum.Rented().stopWatching(),
        ]
        Promise.all(promises).then(() => {
            done();
        })
    })

})