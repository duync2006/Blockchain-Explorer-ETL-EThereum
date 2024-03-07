const Web3 = require("web3");

const provider_VB = "https://vibi-seed.vbchain.vn/";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"
const provider_BSC = "https://bsc-mainnet.nodereal.io/v1/ff851b38f08c4cd9a06052692cd45eb3"
const provider_AGD = "https://agd-seed-1.vbchain.vn/"

var web3 = new Web3(provider_AGD);

module.exports = web3