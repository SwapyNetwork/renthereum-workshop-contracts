# Ethereum Workshop: Renthereum.
Example of an application to rent items.

## Table of Contents

* [Objective](#objective)
* [Contracts](#contracts)
* [Setup](#setup)

## Objective
In construction...

## Contracts

In construction...

## Setup

# Install Dependencies
Install [Node v6.11.2](https://nodejs.org/en/download/releases/)

[Truffle](http://truffleframework.com/) is used for deployment. We run the version installed from our dependencies using npm scripts, but if you prefer to install it globally you can do:
```
$ npm install -g truffle
```

Install project dependencies:
```
$ npm install
```
For setup your wallet configuration, addresses and a custom blockchain node provider to deploy, an environment file is necessary. We provide a `sample.env` file. We recommend that you set up your own variables and rename the file to `.env`.

sample.env
```
export NETWORK_ID=...
export PROVIDER_URL=...
export WALLET_MNEMONIC="twelve words mnemonic ... potato bread coconut pencil"
```

After that, make available your environment file inside the bash context:
```
$ source .env
```

For a better understanding of a local blockchain connection, this lecture may be useful: [Connecting to the network](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network)

Compile the contracts with truffle:
```
$ npm run compile
```
Run our migrations:
```
$ npm run migrate
```
We're running the contracts in a local network defined in  [truffle.js](https://github.com/swapynetwork/renthereum-workshop-contracts/blob/master/truffle.js).

After the transaction mining, the Rethereum is disponible for usage.

We're using Truffle's test support. The script scripts/test.sh creates a local network and calls the unit tests.

Type 
```
$ npm test
```
and run our tests.

[Truffle console](https://truffle.readthedocs.io/en/beta/getting_started/console/) can be used to interact with Renthereum. For example:
```
$ truffle console --network test
```
```
truffle(test)> Renthereum.deployed().itemsCount.call(); // 0 
```
