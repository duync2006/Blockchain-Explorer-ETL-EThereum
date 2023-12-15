const ContractModel = require("../model/contract.js");

const ContractController = {
  
  getAll: async (req, res) => {
    try {
      const contracts = await ContractModel.find();
      res.status(200).send(contracts);
    } catch (err) {
      res.status(500).send(err);
    }
  }

};

module.exports = ContractController;
