const csvtojson = require('csvtojson');
const ContractModel = require('../model/contract')

function extractContracts () {
const csvFilePath_contract = "./csv/contracts.csv";

csvtojson().fromFile(csvFilePath_contract).then(source => {
  ContractModel.insertMany(source)
  .then((result) => {
    console.log("Import CSV_Contract into database successfully.");
  })
  .catch((err) => {
    if (err.code == 11000) {
      console.log("Import CSV_Contract into database successfully.");
    } else {
      console.error(err)
    }
  });
  })
}

module.exports = {extractContracts}