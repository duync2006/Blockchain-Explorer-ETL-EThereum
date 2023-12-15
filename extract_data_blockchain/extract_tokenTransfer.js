const csvtojson = require('csvtojson');
const TokenTransferModel = require('../model/tokenTransfer')
const db = require('../config/db')


function extractTokenTransfers () {
const csvFilePath_tokenTransfer = "./csv/token_transfers.csv";

csvtojson().fromFile(csvFilePath_tokenTransfer).then(source => {
  TokenTransferModel.insertMany(source)
  .then((result) => {
    console.log("Import CSV_tokenTransfer into database successfully.");
  })
  .catch((err) => {
    if (err.code == 11000) {
      console.log("Import CSV_tokenTransfer into database successfully.");
    } else {
      console.err(err);
    }
  });
  })
}

module.exports = {extractTokenTransfers}