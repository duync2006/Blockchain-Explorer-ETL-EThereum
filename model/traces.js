const mongoose = require("mongoose");

// const trace = new mongoose.Schema({
//     "block_number":Number,
//     "transaction_hash": String,
//     "transaction_index": String,
//     "from_address": String,
//     "to_address": String,
//     "value": Number,
//     "input": String,
//     "output": String,
//     "trace_type": String,
//     "call_type": String,
//     "difficulty": String,
//     "reward_type": String,
//     "gas": String,
//     "gas_used": String,
//     "subtraces": Number,
//     "trace_address": Number,
//     "error": Date,
//     "status": Number,
//     "trace_id": String,
//     "withdrawals_root": String,
//     "withdrawals": String
// })

const trace = new mongoose.Schema({
  block_number: Number,
  transaction_traces: Object,
});
let TraceModel = mongoose.model("Trace", trace);

module.exports = TraceModel;
