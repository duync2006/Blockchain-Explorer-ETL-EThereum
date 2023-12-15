const csvtojson = require("csvtojson");
const BlockModel = require("../model/block");
const TransactionModel = require("../model/transaction");
const GeneralSelectors = require('../abi/generalSelectors')
const web3 = require('../config/web3')
function extractBlocks_and_Transactions() {
  const csvFilePath_block = "./csv/blocks.csv";
  const csvFilePath_transaction = "./csv/transactions.csv";
  csvtojson()
    .fromFile(csvFilePath_block)
    .then((source) => {
      BlockModel.insertMany(source, { ordered: false })
        .then((result) => {
          console.log("Import CSV_Block into database successfully.");
        })
        .catch((err) => {
          if (err.code == 11000) {
            console.log("Import CSV_Block into database successfully.");
          } else {
            console.err(err);
          }
        });
    });
  csvtojson()
    .fromFile(csvFilePath_transaction)
    .then((source) => {
      source.map((tran) => {
      if (tran.input) {
       selector = tran.input.slice(0,10);
       const found = GeneralSelectors.selectors.find((ele)=> ele == selector) 
       if (found) {
        // console.log("found: ", found)
        try{
          const decodeInput = web3.eth.abi.decodeParameters(GeneralSelectors.params[found.slice(2)], tran.input.slice(10))
          // console.log("decodeInput:", decodeInput)
          tran.decodeInput = decodeInput
          tran.decodeInput.name = GeneralSelectors.name[found.slice(2)]
        } catch (err) {
          console.log(err)
        }
       }
      }
      })
      TransactionModel.insertMany(source, { ordered: false })
        .then((result) => {
          console.log("Import CSV_Transaction into database successfully.");
        })
        .catch((err) => {
          if (err.code == 11000) {
          } else {
            console.err(err);
          }
        });
        console.log("Import CSV_Transaction into database successfully.");
    });
}
module.exports = { extractBlocks_and_Transactions };
