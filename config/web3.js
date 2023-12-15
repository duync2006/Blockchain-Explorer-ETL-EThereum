const Web3 = require("web3");
const provider_infura ="https://sepolia.infura.io/v3/185ca6c54cdb438b977b428d45017f05";
const provider_VB = "https://vibi.vbchain.vn/";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"

var web3 = new Web3(provider_infura);

module.exports = web3