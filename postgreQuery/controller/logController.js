const prisma = require('../config')
const web3 = require('../web3')
const toObject = require('../helpers/toObject')



const LogController = {
  getLog: async(req, res) => {
    try {

      const hash = req.params.txHash
      console.log(hash)
      const logs = await prisma.logs.findMany({
        where: {
          transaction_hash: hash
        }
      })
      result = toObject(logs)
      const converted_item = result.map(log=>{
        return {
          ...log,
          decode: JSON.parse(log.decode)
        };
      })
      res.status(200).send(converted_item)
    } catch (err) {
      res.status(500).send(err)
    }
  }
}

module.exports = LogController;