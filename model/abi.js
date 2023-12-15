const mongoose = require("mongoose");

const abi = new mongoose.Schema({
    topic: {type: String, unique: true},
    abi: Object,
    name: String,
});

let AbiModel = mongoose.model("Abi", abi);

module.exports = AbiModel;
