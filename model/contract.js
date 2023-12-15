const mongoose = require("mongoose");

const contract = new mongoose.Schema({
  address: {type: String, unique: true, require: true},
  bytecode: String,
  function_sighashes: String,
  is_erc20: String,
  is_erc721: String,
  block_number: Number,
});

let ContractModel = mongoose.model("Contract", contract);

module.exports = ContractModel;