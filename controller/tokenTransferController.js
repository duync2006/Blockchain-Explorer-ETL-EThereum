const TokenTransferModel = require("../model/tokenTransfer");

const TokenTransferController = {
  getTokenTransfer: async (req, res) => {
    try {
      tokenTransfers = await TokenTransferModel.find({
        transaction_hash: req.params.txHash,
      });
      res.status(200).send(tokenTransfers);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  deleteAll: async (req, res) => {
    try {
      await TokenTransferModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = TokenTransferController;
