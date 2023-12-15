const csvtojson = require('csvtojson');
const TokenModel = require('../model/token')

function extractTokens () {
const csvFilePath_contract = "./csv/tokens.csv";

csvtojson().fromFile(csvFilePath_contract).then(source => {
  TokenModel.insertMany(source)
  .then((result) => {
    console.log("Import CSV_Tokens into database successfully.");
  })
  .catch((err) => {
    if (err.code == 11000) {
      console.log("Import CSV_Tokens into database successfully.");
    } else {
      console.error(err)
    }
  });
  })
}

module.exports = {extractTokens}