const mongoose = require("mongoose");

const tokenTransfer = new mongoose.Schema({
  token_address: String,
  from_address: String,
  to_address: String,
  value: String,
  transaction_hash:  {type: String, require: true},
  log_index:  {type: String, require: true},
  block_number: Number,
});
tokenTransfer.index({transaction_hash: 1, log_index: 1}, {unique:true})
let TokenTransferModel = mongoose.model("TokenTransfer", tokenTransfer);

module.exports = TokenTransferModel;
