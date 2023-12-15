const csvtojson = require("csvtojson");
const LogModel = require("../model/log");
const ReceiptModel = require("../model/receipt");
const web3 = require('../config/web3')
const GeneralAbi = require("../abi/generalTopics")
const AbiModel = require("../model/abi")

// const Web3 = require("web3");
// // const provider_VB = "https://vibi.vbchain.vn/";
// const provider_infura =
//   "https://sepolia.infura.io/v3/185ca6c54cdb438b977b428d45017f05";
// // const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023";
// var web3 = new Web3(provider_infura);

const decodeLog = (data, topics, abi) => {
  const decodeLogsData = web3.eth.abi.decodeLog(abi, data, topics);
  // console.log("Log Object Decode: ", typeof(decodeLogsData))
  return decodeLogsData;
};

async function extractLogs() {
  const csvFilePath_log = "./csv/logs.csv";
  const csvFilePath_receipt = "./csv/receipts.csv";
  //   let command_receipts_logs = `ethereumetl export_receipts_and_logs --transaction-hashes ./csv/transaction_hashes.txt --provider-uri ${provider_VB} --receipts-output ./csv/receipts.csv --logs-output ./csv/logs.csv`;
  csvtojson()
    .fromFile(csvFilePath_log)
    .then((source) => {
    const mappings = source.map(async(log) => {
        if (log.topics) {
          const topicsArray = log.topics.split(',')
          // console.log(typeof(topicsArray[0]))
          if (topicsArray.length >= 1) {
            // const found = GeneralAbi.generalTopics.find((ele) => ele == topicsArray[0])
            const abi = await AbiModel.findOne({topic: topicsArray[0]})
            // if (abi) console.log(abi.name)
            topicsArray.shift()
            if (abi) {
              // console.log("decode this")
              // console.log(topicsArray.length)
              // console.log(found)
              try {
                if(abi.topic == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && topicsArray.length == 3){
                  // console.log(GeneralAbi.abi.transfer)
                  const decode = decodeLog(log.data, topicsArray, abi.abi)
                  // console.log(decode)
                  log.decode = decode
                  log.decode.name = abi.name
                } else {
                  // console.log(GeneralAbi.abi[found.slice(2)])
                  const decode = decodeLog(log.data, topicsArray, abi.abi)
                  log.decode = decode
                  log.decode.name = abi.name
                }                  
              } catch (err) {
                // console.log(log)
                // console.error(err)
              }
              
            }
          }
        }
      })
      return Promise.all(mappings).then(()=>{
        console.log(mappings)
        LogModel.insertMany(mappings)
        .then((result) => {
          console.log("Import CSV_Log into database successfully.");
        })
        .catch((err) => {
          if (err.code == 11000) {
          console.log("Import CSV_Log into database.");
          } else {
            console.error(err);
          }
        });
      })
      // console.log("Import CSV_Log into database successfully.");
  });

  csvtojson()
    .fromFile(csvFilePath_receipt)
    .then((source) => {
      ReceiptModel.insertMany(source)
        .then((result) => {
          console.log("Import CSV_Receipt into database successfully.");
        })
        .catch((err) => {
          if (err.code == 11000) {
          } else {
            console.err(err);
          }
        });
      // console.log("Import CSV_Receipt into database successfully.");
    });
}

module.exports = { extractLogs };
