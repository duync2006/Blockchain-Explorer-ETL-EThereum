const LogModel = require("../model/log.js");

const LogController = {
  getLog: async (req, res) => {
    const txHash = req.params.txHash;
    try {
      const logs = await LogModel.find({ transaction_hash: txHash });
      console.log(logs[0])
      res.status(200).send(logs);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteAll: async (req, res) => {
    try {
      await LogModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = LogController;
