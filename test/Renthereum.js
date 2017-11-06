const should = require('chai')
    .use(require('chai-as-promised'))
    .should()
const expect = require('chai').expect;


// --- Artifacts
const Renthereum = artifacts.require("./Renthereum.sol");

contract('Renthereum', accounts => {} )