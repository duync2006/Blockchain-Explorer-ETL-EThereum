const prisma = require('../config')
const web3 = require('../web3')
const toObject = (data) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
                            typeof value === 'bigint'
                                ? value.toString()
                                : value // return everything else unchanged
  ))
}
const ContractController = {
  getAll: async(req,res) => {
    try{
      const contracts = await prisma.contracts.findMany()
      res.status(200).send(toObject(contracts))
    } catch (err) {
      res.status(500).send(err)
    }
  }, 

  getContract:  async(req,res) => {
    try{
      const address = req.params.address.toLowerCase()
      // console.log(address)
      const contract = await prisma.contracts.findUnique({
        where: {
          address: address
        }
      })
      let token = await prisma.tokens.findUnique({
        where: {
          address: address
        }
      })
      if (token) 
      {
        token = toObject(token)
        contract.token = token
      }
      res.status(200).send(toObject(contract))
    } catch (err) {
      console.log(err)
      res.status(500).send(err.code)
    }
  }, 

  setContractName: async(req,res) => {
    try{

    } catch (err) {
      res.status(500).send(err)
    }
  }, 

  deleteAll:  async(req,res) => {
    try{

    } catch (err) {
      res.status(500).send(err)
    }
  }, 

  getByteCode: async(req, res) => {
    try {
      address = req.params.address.toLowerCase()
      contract_bytecode = await prisma.contracts.findUnique({
        where: {
          address: address
        }, 
        select: {
          address: true,
          bytecode: true
        }
      })
      res.status(200).send(contract_bytecode)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

module.exports = ContractController;