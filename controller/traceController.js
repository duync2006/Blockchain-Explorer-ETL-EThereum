const TraceModel = require("../model/traces.js");

const TraceController = {
  getTracesByBlockNumber: async (req, res) => {
    blockNumber = req.params.number;
    try {
      const query = await TraceModel.where({ block_number: blockNumber });
      res.status(200).send(query);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteAll: async (req, res) => {
    try {
      await TraceModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = TraceController;
