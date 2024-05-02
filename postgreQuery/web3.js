require('dotenv').config()
const Web3 = require("web3");
var web3 = new Web3(process.env.PROVIDER);

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