module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },

  // Add this section to specify the compiler version
  compilers: {
    solc: {
      version: "0.5.1",    // Specify the Solidity compiler version here
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
