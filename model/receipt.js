const mongoose = require('mongoose')

const receipt = new mongoose.Schema({
  transaction_hash: {type: String, require: true},
  transaction_index:String,
  block_hash:String,
  block_number:String,
  cumulative_gas_used:String,
  gas_used:String,
  contract_address:String,
  root:String,
  status:String,
  effective_gas_price:String,
  l1_fee:String,
  l1_gas_used:String,
  l1_gas_price:String,
  l1_fee_scalar:String
})

receipt.index({transaction_hash: 1, transaction_index: 1}, {unique:true}, {require: true})

let ReceiptModel = mongoose.model("Receipt", receipt)

module.exports = ReceiptModel