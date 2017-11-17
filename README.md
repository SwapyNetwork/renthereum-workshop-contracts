<img src="https://github.com/swapynetwork/renthereum-workshop-contracts/blob/master/renthereum128.png">

# Ethereum Workshop: Renthereum.
Example of an application to rent items.

[![Build Status](https://travis-ci.org/SwapyNetwork/renthereum-workshop-contracts.svg?branch=master)](ttps://travis-ci.org/SwapyNetwork/renthereum-workshop-contracts)


#### NOTE: Swapy Network together with Ethereum BH Meetup Group is going to host a Ethereum workshop in Belo Horizonte, Brazil. This repository was created for educational purposes only.

## Table of Contents

* [Contracts](#contracts)
* [Setup](#setup)
  * [Install dependencies](#install-dependencies)
  * [Environment](#environment)
  * [Compile](#compile)
  * [Deploy](#deploy)
  * [Run tests](#run-tests)
  * [Interact with Renthereum](#interact-with-renthereum)

# Contracts

### [Renthereum.sol](https://github.com/swapynetwork/renthereum-workshop-contracts/blob/master/contracts/Renthereum.sol)
Provide methods to include items to rent and hire ordered items.

# Setup

## Install Dependencies
Install [Node v8.9.1](https://nodejs.org/en/download/releases/)

[Truffle](http://truffleframework.com/) is used for deployment. We run the version installed from our dependencies using npm scripts, but if you prefer to install it globally you can do:
```
$ npm install -g truffle
```
Install project dependencies:
```
$ npm install
```
## Environment

For set up your wallet, an environment file is necessary. We provide a `sample.env` file. We recommend that you set up your own variables and rename the file to `.env`.

sample.env
```bash
# To get the twelve words, you need to set up
# your account on the MetaMask extension.

export WALLET_MNEMONIC="twelve words mnemonic ... potato bread coconut pencil"
```

After that, make available your environment file inside the bash context:
```
$ source .env
```

## Compile

Compile the contract with truffle:
```
$ npm run compile
```
## Start local network

Start [testrpc](https://github.com/ethereumjs/testrpc) connection:
```
$ npm start
```
For a better understanding of a local blockchain connection, this lecture may be useful: [Connecting to the network](https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network)

## Deploy
Run our migrations:
```
$ npm run migrate
```
We're running the application in a local network defined in [truffle.js](https://github.com/swapynetwork/renthereum-workshop-contracts/blob/master/truffle.js).

After the transaction mining, the Rethereum is disponible for usage.

## Run tests
We're using Truffle's test support. The script scripts/test.sh creates a local network and calls the unit tests.

Type
```
$ npm test
```
and run the Renthereum tests.

## Interact with Renthereum

[Truffle console](https://truffle.readthedocs.io/en/beta/getting_started/console/) can be used to interact with Renthereum. For example:
```
$ npm run console
```
```
truffle(test)> Renthereum.deployed().itemsCount.call(); // 0
```
