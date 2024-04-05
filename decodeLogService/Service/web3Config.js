const Web3 = require("web3");
const provider_infura ="https://sepolia.infura.io/v3/7409a09023ba4a9ebd10e0875f9ff079";
const provider_VB = "https://vibi-seed.vbchain.vn/";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"
const provider_BSC = "https://bsc-mainnet.nodereal.io/v1/ff851b38f08c4cd9a06052692cd45eb3"
const provider_AGD_1 = "https://agd-seed-1.vbchain.vn/"
const provider_AGD_2 = "https://agd-seed-2.vbchain.vn/"
const provider_AGD_3 = "https://agd-seed-3.vbchain.vn/"

var web3_node_1 = new Web3(provider_AGD_1);
var web3_node_2 = new Web3(provider_AGD_2);
var web3_node_3= new Web3(provider_AGD_3);

module.exports = {web3_node_1, web3_node_2, web3_node_3}