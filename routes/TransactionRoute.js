const express = require("express");
const router = express.Router();
// const BlockController = require('../controller/blockController.js')
const TransactionController = require("../controller/transactionController");

router.post("/", TransactionController.saveTransaction);

router.get("/blockNumber/:blockNumber", TransactionController.getTransactionsByBlockNumber);

// router.get("/blockNumber/:number", BlockController.getBlockNumber)
router.delete("/", TransactionController.deleteAll);

router.get("/txHash/:txHash", TransactionController.getTransactionHash);

router.get("/", TransactionController.getAll);

router.get("/latest", TransactionController.getLatestTransactions);

router.get("/address/:address", TransactionController.getTransactionsByAddress);
module.exports = router;
