const BlockModel = require("../model/block");
const BlockController = {
  savePost: async (req, res) => {
    const block = new BlockModel(req.body);
    try {
      await block.save();
      res.status(200).send(block);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // saveBlockAutomation: async (req, res) => {
  //   try {
  //     await BlockModel.insertMany(ETL.blockArray, { ordered: false });
  //     console.log("-------Save Blocks Finished --------");
  //   } catch (err) {
  //     if (err.code == 11000) {
  //       // res.status(200).send("Save Blocks Success")
  //     }
  //     // res.status(500).send(err)
  //   }
  //   // res.status(200).send("Save success")
  // },

  deleteAll: async (req, res) => {
    try {
      await BlockModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const blocks = await BlockModel.find();
      res.status(200).send(blocks);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getBlockNumber: async (req, res) => {
    console.log(req.params);
    console.log(typeof req.params.number);
    // const query = await BlockModel.where({number: req.params.number })
    // const block = await query.findOne();
    // const query = await BlockModel.findOne({number: req.params.number })
    // console.log(query)
    try {
      const query = await BlockModel.where({ number: req.params.number });
      // const block = await query.findOne();
      res.status(200).send(query);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getBlockHash: async (req, res) => {
    try {
      const query = await BlockModel.where({ hash: req.params.blockHash });
      // const block = await query.findOne();
      res.status(200).send(query);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getLatestBlocks: async (req, res) => {
    try {
      const blocks = await BlockModel.find().sort({ $natural: -1 }).limit(20);
      res.status(200).send(blocks);
    } catch (err) {
      res.status(500).send(err);
      console.log(err);
    }
  },
};

module.exports = BlockController;
