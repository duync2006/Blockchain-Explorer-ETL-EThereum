const mongoose = require("mongoose");

const block = new mongoose.Schema({
  number: Number,
  hash: {type: String, unique: true, require: true},
  parent_hash: String,
  nonce: String,
  sha3_uncles: String,
  logs_bloom: String,
  transactions_root: String,
  state_root: String,
  receipts_root: String,
  miner: String,
  difficulty: String,
  total_difficulty: String,
  size: String,
  extra_data: String,
  gas_limit: Number,
  gas_used: Number,
  timestamp: Date,
  transaction_count: Number,
  "base_fee_per_gas": String,
  "withdrawals_root": String,
  "withdrawals": String
});
// block.index({hash: 1},{unique: true})
let BlockModel = mongoose.model("Block", block);

module.exports = BlockModel;
