const AbiModel = require("../model/abi")
const AbiController = {
  addAbi: async(req, res) => {
    try {
      console.log(req.body)
      AbiModel.insertMany(req.body).then();
      res.status(200).send("success")
    } catch (err) {
      console.err(err)
      res.status(500).send("Error")
    }
  },

  removeAbi: async(req, res) => {

  },
  
  updateAbi: async(req, res) => {

  },
}

module.exports = AbiController