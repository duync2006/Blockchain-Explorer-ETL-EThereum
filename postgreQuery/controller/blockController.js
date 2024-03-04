const prisma = require('../config')
const web3 = require('../web3')
const toObject = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
                            typeof value === 'bigint'
                                ? value.toString()
                                : value // return everything else unchanged
  ))
}
const BlockController = {
  getBlockNumber: async(req, res) => {
    try {
      const number = req.params.number
      const block = await prisma.blocks.findUnique({
        where: {
          number: number
        }
      })
      res.status(200).send(toObject(block))
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
      const perPage = parseInt(req.query.limit || 20)
      const page = parseInt(req.query.page || 1)

      const blocks = await prisma.blocks.findMany({
        orderBy: { number : 'desc'},
        skip: (page - 1) * perPage,
        take: perPage
      })

      // const blocks = await prisma.blocks.findMany()


      res.status(200).json(toObject(blocks))
    } catch (error) {
      
      res.status(500).send(err)
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
  }
}

module.exports = BlockController;