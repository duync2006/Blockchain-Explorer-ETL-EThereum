const prisma = require('../config')
const web3 = require('../web3')
const toObject = require('../helpers/toObject')


const TransactionController = {
  getTransactionHash: async(request, response) => {
    const hash = request.params.hash

    let result;
    try {
      const transaction = await prisma.transactions.findUnique({
        where: {
          hash: hash
        }
      })
    result = toObject(transaction)
    const logs = await prisma.logs.findMany({
      where: {
        transaction_hash: transaction.hash
      }
    })
    const tokensTransfer = await prisma.token_transfers.findMany({
      where: {
        transaction_hash: transaction.hash
      }
    });
  
    let token_address = []
    // console.log(tokensTransfer)
    if (tokensTransfer.length >= 0) {
      for (const token of tokensTransfer) {
        // console.log(token)
        token_address.push(token.token_address)
      }
    }
    if (transaction.receipt_contract_address) token_address.push(transaction.receipt_contract_address)
  
    if (token_address) {
      const token = await prisma.tokens.findMany({
        where:
            {address: { in: token_address}},
      })
      result.token = toObject(token)
    }
    // console.log(logs)
    result.logs = toObject(logs)
    result.tokensTransfer = toObject(tokensTransfer)
    
    response.status(200).send(result)
    } catch (err) {
      response.status(500).send(err)
    }
  },

  getTransactionsByBlockNumber: async(req, res) => {
    try {
      const block_number = req.params.blockNumber
      const transactions = await prisma.transactions.findMany({
      where: {
        block_number: block_number
      }
      })
      res.status(200).send(toObject(transactions))
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },

  getTransactionsByAddress: async(req, res) => {
    try {
      const address = req.params.address.toLowerCase()
      const transactions = await prisma.transactions.findMany({
      where: {
        OR: [
          {
            from_address: address
          },
          {
            to_address: address
          }
        ]
      }
      })
      res.status(200).send(toObject(transactions))
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },

  getLatestTransaction: async(req, res) => { 
    try {
      const transactions = await prisma.transactions.findMany({
        orderBy: [{block_timestamp: 'desc'}],
        take: 20
      })
      res.status(200).send(toObject(transactions))
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },

  getTotalNumberTrans: async(req, res) => {
    try {
      const transWithCount = await prisma.transactions.count()
      console.log(transWithCount)
      res.status(200).send({ totalTransactions: transWithCount })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  getAllTransaction: async(req, res) => {
    try {
      const perPage = parseInt(req.query.limit || 20)
      const page = parseInt(req.query.page || 1)

      const trans = await prisma.transactions.findMany({
        orderBy: { block_timestamp : 'desc'},
        skip: (page - 1) * perPage,
        take: perPage
      })

      res.status(200).send(toObject(trans))
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

module.exports = TransactionController
