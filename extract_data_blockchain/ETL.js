const { exec } = require("child_process");
// const provider_VB = "https://vibi.vbchain.vn/";
const provider_VB = "https://sepolia.infura.io/v3/185ca6c54cdb438b977b428d45017f05";
// const provider_VB = "https://mbctest.vbchain.vn/VBCinternship2023";
const block_and_transaction = require('./extract_blocks_transactions.js')
const log_and_receipt = require('./extract_log_receipt.js')
const tokenTransfer = require('./extract_tokenTransfer.js')
const contract = require('./extract_contracts.js')
const token = require('./extract_tokens.js')
const trace = require('./extract_traces.js');
const web3 = require("../config/web3.js");


function executeCommand(command, extract) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (stderr) {
        console.error(stderr);
      }
      resolve(extract);
    });
  });
}

async function ETL() {
  let startBlock = 	4863390;
  let endBlock = 	4863390;
  let i = 0;
  let command_receipts_logs = `ethereumetl export_receipts_and_logs --transaction-hashes ./csv/transaction_hashes.txt --provider-uri ${provider_VB} --receipts-output ./csv/receipts.csv --logs-output ./csv/logs.csv`;
  let command_blocks_transactions = `ethereumetl export_blocks_and_transactions --start-block ${startBlock} --end-block ${endBlock} --blocks-output ./csv/blocks.csv --transactions-output ./csv/transactions.csv --provider-uri ${provider_VB}`;
  let command_tokenTransfer = `ethereumetl extract_token_transfers --logs ./csv/logs.csv --output ./csv/token_transfers.csv`;
  let command_extract_TxHash = `ethereumetl extract_csv_column --input ./csv/transactions.csv --column hash --output ./csv/transaction_hashes.txt`;
  let command_extract_Trace = `ethereumetl export_geth_traces --start-block ${startBlock} --end-block ${endBlock} --provider-uri  ${provider_VB} --batch-size 10 --output ./csv/traces.csv`;
  let command_extract_contractAddress = `ethereumetl extract_csv_column --input ./csv/receipts.csv --column contract_address --output ./csv/contract_addresses.txt`
  let command_extract_contract = `ethereumetl export_contracts --contract-addresses ./csv/contract_addresses.txt --provider-uri ${provider_VB} --output ./csv/contracts.csv`
  let command_token_address = `ethereumetl filter_items -i ./csv/contracts.csv -p "item['is_erc20'] or item['is_erc721']" | ethereumetl extract_field -f address -o ./csv/token_addresses.txt`
  let command_extract_token = `ethereumetl export_tokens --token-addresses ./csv/token_addresses.txt --provider-uri ${provider_VB} --output ./csv/tokens.csv`
  
  // setInterval(async() => {  
  // console.log("StartBlock:", startBlock)
  // console.log("EndBlock:", endBlock)
  if (endBlock >= startBlock) {
    executeCommand(command_blocks_transactions, block_and_transaction.extractBlocks_and_Transactions)
    .then((result) => {
      console.log("-----------------------------------1------------------------------------")
      result()
      executeCommand(command_extract_TxHash, executeCommand)
      .then((result) => {
        console.log("-----------------------------------2------------------------------------")
        result(command_receipts_logs, log_and_receipt.extractLogs)
        .then((result) => {
          console.log("-----------------------------------3------------------------------------")
          result()
          executeCommand(command_extract_contractAddress, executeCommand)
          .then((result) => {
            console.log("-----------------------------------4------------------------------------")
            result(command_extract_contract, contract.extractContracts)
            .then((result) => {
              result()
              executeCommand(command_token_address, executeCommand)
              .then((result) => {
                result(command_extract_token, token.extractTokens)
                .then((result) => {
                  result()
                })
              })
            })
          })
          executeCommand(command_tokenTransfer, tokenTransfer.extractTokenTransfers)
          .then((result) => {
            console.log("-----------------------------------4------------------------------------")
            result()
          })
        })
      })
})
    // executeCommand(command_extract_Trace, trace.extractTraces)
    // .then((result) =>
    // {
    //   result()
    // })
  } 
//   startBlock = endBlock
//   endBlock = await web3.eth.getBlockNumber()
// },15000)
  
}
module.exports = {
  ETL
};
