const TransactionModel = require("../model/transaction.js");

const TransactionController = {
  saveTransaction: async (req, res) => {
    const transaction = new TransactionModel(req.body);
    try {
      await transaction.save();
      res.status(200).send("Save Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getTransactionHash: async (req, res) => {
    hashParam = req.params.txHash;
    try {
      // console.log("HashParam:", req.params.txHash)
      // console.log(typeof hashParam);
      // const query = await TransactionModel.where({ hash: hashParam });
      const query = await TransactionModel.aggregate([
        { $match: { hash: hashParam } },
        {
          $lookup: {
            from: "logs",
            localField: "hash",
            foreignField: "transaction_hash",
            pipeline: [
              // { $match: { transaction_hash: hashParam } },
              
              // { $project: { _id: 1, data: 1, address: 1, topics: 1, decode: 1 } },
            ],
            as: "logs",
          },
        },
        {
          $lookup: {
            from: "receipts",
            localField: "hash",
            foreignField: "transaction_hash",
            pipeline: [
              // { $match: { transaction_hash: hashParam } },
              { $lookup: {
                from: "tokens",
                localField: "contract_address",
                foreignField: "address",
                pipeline: [
                  { $project: { address: 1, symbol: 1, name: 1 } }
                ],
                as: 'token',
              }},
              { $project: { gas_used: 1, contract_address: 1, status: 1, token: 1 } },
            ],
            as: "receipt",
          },
        },
        {
          $lookup: {
            from: "tokentransfers",
            localField: "hash",
            foreignField: "transaction_hash",
            pipeline: [
              // { $match: { transaction_hash: hashParam } },
              {$lookup: {
                from: "tokens",
                localField: "token_address",
                foreignField: "address",
                pipeline: [
                  { $project: { address: 1, symbol: 1, name: 1 } }
                ],
                as: 'token',
              }},
              { $project: {token_address: 1, from_address:1,to_address:1,value:1, token: 1} },
            ],
            as: "tokenTransfers",
          },
        },
      ]);
      // console.log("query: ",query)
      // const block = await query.findOne();
      res.status(200).send(query);
    } catch (err) {
      res.status(500).send(err);
      console.log(err);
    }
  },
  getAll: async (req, res) => {
    try {
      const trans = await TransactionModel.find();
      res.status(200).send(trans);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getLatestTransactions: async (req, res) => {
    try {
      const trans = await TransactionModel.aggregate([
        {$sort: { _id: -1 }},
        {$limit: 20},
        {$addFields: {
          method: "$decodeInput.name"
        }},
        {$project: {
          hash: 1,
          from_address: 1,
          to_address: 1,
          block_timestamp: 1,
          value: 1,
          gas: 1,
          input: 
          {
            $cond: {
                    if: {$gt:  [{ $strLenCP: "$input" }, 2]},
                    then: { $substrCP: ["$input", 0, 10] },
                    else: '$input'
                   }
          },
          method: 1
          
        }}
      ])
      res.status(200).send(trans);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getTransactionsByAddress: async (req, res) => {
    try {
      const trans = await TransactionModel.find({
        $or: [
          { to_address: req.params.address },
          { from_address: req.params.address },
        ],
      }).sort({ block_timestamp: "desc" });
      res.status(200).send(trans);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getTransactionsByBlockNumber: async(req, res) =>{
    blockNumber = req.params.blockNumber
    // console.log(blockNumber)
    try {
      const query = await TransactionModel.aggregate([
        {$match: {block_number: Number(blockNumber)}},
        {$addFields: {
          method: "$decodeInput.name"
        }},
        {$project: {
          hash: 1,
          from_address: 1,
          to_address: 1,
          block_timestamp: 1,
          value: 1,
          gas: 1,
          input: 
          {
            $cond: {
                    if: {$gt:  [{ $strLenCP: "$input" }, 2]},
                    then: { $substrCP: ["$input", 0, 10] },
                    else: '$input'
                   }
          },
          method: 1
          
        }},
        {$sort: {_id: -1}}
      ])
      // console.log(query)
      res.status(200).send(query)  
    } catch (error) {
      res.status(500).send(error)
    }
    
  },
  deleteAll: async (req, res) => {
    try {
      await TransactionModel.deleteMany();
      res.send("Delete Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = TransactionController;
