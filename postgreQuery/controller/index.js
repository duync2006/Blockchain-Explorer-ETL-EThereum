const prisma = require('../config')

require('dotenv').config()



const getTransactionHash = async(request, response) => {
  const hash = request.params.hash
  // const trans = await pool.query('SELECT * FROM transactions WHERE hash = $1',[hash])
  // const logs = await pool.query('SELECT * FROM logs WHERE transaction_hash = $1', [hash])
  // const 
  // result = trans.rows[0]
  // result.logs = logs.rows
  // const tokens = await pool.query('SELECT * FROM tokens WHERE address = $1 OR address = $2', [result.to_address, result.receipt_contract_address])
  // // console.log(tokens)
  // result.tokens = tokens.rows
  let result;
  const transaction = await prisma.transactions.findUnique({
    where: {
      hash: hash
    }
  })
  result = transaction
  const logs = await prisma.logs.findMany({
    where: {
      transaction_hash: transaction.hash
    }
  })
  result.logs = logs

  response.status(200).json(result)
}

module.exports = {
  getTransactionHash,
  extractAutomatic,
  extractManual
}
