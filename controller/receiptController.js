const ReceiptModel = require("../model/receipt.js");

const ReceiptController = {
  getReceipt: async (req, res) => {
    const txHash = req.params.txHash;
    // console.log(txHash)
    try {
      const receipt = await ReceiptModel.find({ transaction_hash: txHash });

      res.status(200).send(receipt);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteAll: async (req, res) => {
    try {
      await ReceiptModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = ReceiptController;
