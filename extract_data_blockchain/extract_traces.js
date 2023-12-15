const csvtojson = require('csvtojson');
const TraceModel = require('../model/traces')

function extractTraces () {
const csvFilePath_trace = "./csv/traces.csv";

csvtojson().fromFile(csvFilePath_trace).then(source => {
  // console.log(source[0].block_number)
  // console.log(typeof(source[0].transaction_traces))
  TraceModel.insertMany(source)
  .then((result) => {
    console.log("Import CSV_Trace into database successfully.");
  })
  .catch((err) => {
    if (err.code == 11000) {
      console.log("Import CSV_Trace into database successfully.");
    } else {
      console.err(err);
    }
  });
  })
}

module.exports = {extractTraces}