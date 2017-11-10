module.exports = {
  networks: {
    test : {
      host: "localhost",
      network_id: "*",
      port: 8545,
      gasPrice: 0x01
    }    
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
