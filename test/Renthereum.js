const should = require('chai')
    .use(require('chai-as-promised'))
    .should()
const expect = require('chai').expect;

// --- Artifacts
const Renthereum = artifacts.require("./Renthereum.sol");
//
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

// --- Useful function
const assertNewRentOrder = async (contract, item, account) => {
    await contract.createOrder(
        item.id,
        item.name,
        item.description,
        item.dailyValue,
        item.minPeriod,
        item.maxPeriod,
        { from: account }
    ).then(transaction => {
        should.exist(transaction.tx);
        return contract.Ordered().get((err, logs) => {
            const event = logs[0].args;
            expect(event).to.include.all.keys([
                '_index',
                '_id',
                '_owner',
                '_name',
                '_value'
            ]);
            assert.equal(event._owner, account, "The current account must be the owner of the rent order");
            itemsToRent.push(event);
        })
    })
}

contract('Renthereum', accounts => {

    before( async () => {
        owner = accounts[0];
        customer = accounts[1];
        renthereum = await Renthereum.new();
        const promises = [
            renthereum.Ordered().watch(()=>{}),
            renthereum.Canceled().watch(()=>{}),
            renthereum.Rented().watch(()=>{}),
        ]
        await Promise.all(promises);  
    })
    
    it("should create a rent order", async () => {
        let item = itemsToOrder[0];
        await assertNewRentOrder(renthereum, item, owner);
    })

    it("should cancel a rent order", async () => {
        const item = itemsToRent[0];
        const transaction = await renthereum.cancelOrder(item._index, {from: owner});
        should.exist(transaction.tx);
        await renthereum.Canceled().get();
        async (err, logs) => {
            const event = logs[0].args;
            expect(event).to.include.all.keys([
                '_id',
                '_owner',
                '_name',
                '_value'
            ]);
            assert.equal(event._owner, owner, "The user must be the owner of the rent order");
        }
    })

    it("should order a second item", async () => {
        let item = itemsToOrder[1];
        await assertNewRentOrder(renthereum, item, owner);
    })

    it("should rent an item", async () => {
        const item = itemsToRent[1];
        const rentPeriod = 30;
        const value = item._value * rentPeriod;
        const transaction = await renthereum.rent(item._index, rentPeriod, { from: customer, value });
        should.exist(transaction.tx);
        await renthereum.Rented().get( async (err, logs) => {
            const event = logs[0].args;
            expect(event).to.include.all.keys([
                '_owner',
                '_customer',
                '_period',
                '_value'
            ]);
            assert.equal(event._customer, customer, "The user must be the customer of the rented item");
        })
    })

    after( async () => {
        const promises = [
            renthereum.Ordered().stopWatching(),
            renthereum.Canceled().stopWatching(),
            renthereum.Rented().stopWatching(),
        ]
        await Promise.all(promises)
    })
})