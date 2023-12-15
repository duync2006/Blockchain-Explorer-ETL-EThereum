const mongoose = require("mongoose");

const log = new mongoose.Schema({
  log_index: {type: String, require: true},
  transaction_hash: {type: String, require: true},
  transaction_index: String,
  block_hash: String,
  block_number: String,
  address: String,
  data: String,
  topics: String,
  decode: Object,
});
log.index({log_index: 1, transaction_hash: 1}, {unique:true})
let LogModel = mongoose.model("Log", log);

module.exports = LogModel;
