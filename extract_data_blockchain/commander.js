const csvFilePath_block = "../csv/blocks.csv";
const csvFilePath_transaction = "./csv/transactions.csv";
const csvFIlePath_log = "../csv/logs.csv";
const csvFIlePath_receipt = "../csv/receipts.csv";
const csvFIlePath_tokenTransfer = "../csv/token_transfers.csv";
const csvFilePath_trace = "../csv/traces.csv";

const { stderr, stdout } = require("process");
const { promiseHooks } = require("v8");
const { resolve } = require("dns");
const { error } = require("console");

async function executeCommands(
  block_transactions,
  extractTxhash,
  log_receipt,
  tokenTransfer,
  trace
) {
  try {
    const result1 = await executeCommand(block_transactions);
    await transform_CSV(csvFilePath_block, blockArray, 0);
    console.log("Array Block Length:", blockArray.length);

    await transform_CSV(csvFilePath_transaction, transArray, 0);
    console.log("Array Transaction Length:", transArray.length);

    const result2 = await executeCommand(extractTxhash);
    // console.log("result2: ", result2)
    
    const result3 = await executeCommand(log_receipt);
    await transform_CSV(csvFIlePath_log, logArray, 1);
    console.log("Array Log Length:", logArray.length);

    await transform_CSV(csvFIlePath_receipt, receiptArray, 2);
    console.log("Array Receipt Array Length:", receiptArray.length);

    const result4 = await executeCommand(tokenTransfer);
    await transform_CSV(csvFIlePath_tokenTransfer, tokenTransferArray, 3);
    console.log("Array Token Transfer Length:", tokenTransferArray.length);

    const result5 = await executeCommand(trace);
    await transform_CSV(csvFilePath_trace, traceArray, 4);
    console.log("Array Trace Length:", traceArray.length);
    console.log("All Command Called");
  } catch (err) {
    console.error(err);
  }
}


function executeCommand(command) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (stderr) {
        console.error(stderr);
      }

      resolve(() => console.log("Success calling command:", command));
    });
  });
}
