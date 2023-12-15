const mongoose = require("mongoose");

const token = new mongoose.Schema({
  address: {type: String, unique: true},
  symbol: String,
  name: String,
  decimals: Number,
  total_supply: Number,
  block_number: Number,
});

let TokenModel = mongoose.model("Token", token);

module.exports = TokenModel;