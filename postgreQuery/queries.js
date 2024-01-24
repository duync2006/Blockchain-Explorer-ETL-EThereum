// const { Transaction } = require('mongodb')
// const { exec } = require('child_process');
// require('dotenv').config()

// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'ETL_Ethereum',
//   password: 'billboss123',
//   port: 5432,
// })

// const extractManual = async(request, response) => {
//   startBlock = request.body.startBlockNumber;
//   endBlock = request.body.endBlockNumber;
//   provider = request.body.provider;
//   exec(`ethereumetl export_all -s ${startBlock} -e ${endBlock} -o output.txt -p ${provider}`, (err, stdout, stderr) => {
//     if(err) {
//       response.status(500).send(err)
//     }
//     console.log(stdout)
//     console.log(stderr)
//   })
//   response.status(200).send("Extract Success")
// } 

// const extractAutomatic = async(request, response) => {
//   startBlock = request.body.startBlockNumber
//   provider = request.body.provider
//   database = process.env.DATABASE_URL_FOR_EXTRACT
//   exec(`ethereumetl stream --start-block ${startBlock} \
//    --provider-uri ${provider} \
//    --output ${database}`, (err, stdout, stderr) => {
//     if(err) {
//       console.log(err)
//       // response.status(500).send(err)
//     }
//     console.log(stdout)
//     console.log(stderr)
//   })
//   response.status(200).send("Extract Success")
// }

// const getTransactionHash = async(request, response) => {
//   const hash = request.params.hash
//   const trans = await pool.query('SELECT * FROM transactions WHERE hash = $1',[hash])
//   const logs = await pool.query('SELECT * FROM logs WHERE transaction_hash = $1', [hash])
//   // const 
//   result = trans.rows[0]
//   result.logs = logs.rows
//   const tokens = await pool.query('SELECT * FROM tokens WHERE address = $1 OR address = $2', [result.to_address, result.receipt_contract_address])
//   // console.log(tokens)
//   result.tokens = tokens.rows
//   response.status(200).json(result)
// }

// const getBlockByNumber = async(request, response) => {
//   const number = request.params.number
//   const block = await pool.query('SELECT * FROM blocks WHERE number = $1', [number])
//   response.status(200).json(block.rows)
// }

// const getAccountTransaction = async (request, response) => {
//   const address = request.params.address.toLowerCase()
//   const txs = await pool.query('SELECT hash,from_address,to_address,value,receipt_status FROM transactions WHERE from_address = $1 OR to_address = $1', [address])
//   response.status(200).json(txs.rows)
// }

// module.exports = {
//   getTransactionHash,
//   getBlockByNumber,
//   getAccountTransaction,
//   extractManual,
//   extractAutomatic
// }