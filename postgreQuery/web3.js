const Web3 = require("web3");
const provider_infura ="https://sepolia.infura.io/v3/7409a09023ba4a9ebd10e0875f9ff079";
const provider_VB = "wss://vibi.vbchain.vn/ws";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"
const provider_BSC = "https://bsc-mainnet.nodereal.io/v1/ff851b38f08c4cd9a06052692cd45eb3"

var web3 = new Web3(provider_infura);

web3.eth.extend({
  property: 'txpool',
  methods: [{
    name: 'content',
    call: 'txpool_content'
  },{
    name: 'inspect',
    call: 'txpool_inspect'
  },{
    name: 'status',
    call: 'txpool_status'
  }]
})

module.exports = web3