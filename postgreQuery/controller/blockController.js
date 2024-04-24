const prisma = require('../config')
const web3 = require('../web3')
const toObject = require('../helpers/toObject')

const BlockController = {
  getBlockNumber: async(req, res) => {
    try {
      const number = Number(req.params.number)
      const block = toObject(await prisma.blocks.findUnique({
        where: {
          number: number
        }
      }))
      const query = Number((await prisma.$queryRaw`SELECT\
      COUNT (transaction_hash) FROM traces where block_number = ${number}`)[0].count)
      block.numberInternalTxns = query - Number(block.transaction_count)
      res.status(200).send((block))
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
    
  },  
  getBlockHash: async(req, res) => {
    try {
      const hash = req.params.blockHash
      const block = await prisma.blocks.findUnique({
        where: {
          hash: hash
        }
      })
      res.status(200).send(toObject(block))
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  },
  getLatestBlocks: async(req, res) => {
    try {
      const blocks = await prisma.blocks.findMany(
        {
          orderBy: [{number: 'desc'}],
          take: 20
        }
      )
      res.status(200).send(toObject(blocks))
    } catch (err) {
      res.status(500).send(err)
    }
  },
  deleteAll: async(req, res) => {
    try {
      const deleteBlocks = await prisma.blocks.deleteMany({})
      res.status(200).send("Delete Sucess")
    } catch (err) {
      res.status(500).send(err)
    }
  },
  getTotalBlocks: async(req, res) => {
    try {
      const blocksWithCount = await prisma.blocks.count()
      console.log(blocksWithCount)
      res.status(200).send({ totalBlocks: blocksWithCount })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }, 
  getAllBlocks: async(req, res) => {
    try {
      const perPage = Number(req.query.limit || 20)
      const page = Number(req.query.page || 1)
      const latestBlockNumber = Number((await prisma.$queryRaw`SELECT number from blocks order by timestamp DESC LIMIT 1`)[0].number)
      const blocks = await prisma.$queryRaw`SELECT * from blocks where number <= ${latestBlockNumber - (page - 1)*perPage} and number >= ${latestBlockNumber - (page)*perPage}`
      console.log(blocks)
      const promises = blocks.map(async(block) => {
        const query = Number((await prisma.$queryRaw`SELECT\
        COUNT (transaction_hash) FROM traces where block_number = ${block.number}`)[0].count)
        console.log(query)
        block.numberInternalTxns = query - Number(block.transaction_count)
      })
      await Promise.all(promises)
      res.status(200).json(toObject(blocks))
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  },
  getDetailLatestBlock: async(req,res) => {
    try {
      const lastestBlockNumber = await web3.eth.getBlockNumber()
      const lastestBlock = await web3.eth.getBlock(lastestBlockNumber)
      res.json(lastestBlock)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  getBlockInternalTxns: async(req, res) => {
    try {
      const number = Number(req.params.number)
      const transactions = await prisma.$queryRaw`Select hash from transactions where block_number = ${number}`
      const promises = transactions.map(async(ele) => {
        const query = toObject((await prisma.$queryRaw`SELECT\
        transaction_hash AS parent_hash, call_type, from_address, to_address, value FROM traces
        where transaction_hash = ${ele.hash} `))
        return query
      })
      const result = await Promise.all(promises)
      const data = {}
      data.block_number = number;
      data.block_timestamp = (await prisma.$queryRaw`SELECT timestamp from blocks where number = ${number}`)[0].timestamp
      data.internalTxns = result.flat()
      res.status(200).send(data)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

module.exports = BlockController;