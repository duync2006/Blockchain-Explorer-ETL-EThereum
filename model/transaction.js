const mongoose = require("mongoose");

const transaction = {
  hash: { type: String, unique: true, required: true },
  nonce: Number,
  block_hash: String,
  block_number: Number,
  transaction_index: Number,
  from_address: String,
  to_address: String,
  bytecode: String,
  value: String,
  gas: Number,
  gas_price: String,
  input: String,
  decodeInput: Object,
  block_timestamp: Date,
  max_fee_per_gas: Number,
  max_priority_fee_per_gas: Number,
  transaction_type: Number,
};

let TransactionModel = mongoose.model("Transaction", transaction);

module.exports = TransactionModel;
