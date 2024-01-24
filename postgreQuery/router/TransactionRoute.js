const express = require("express");
const router = express.Router();
// const BlockController = require('../controller/blockController.js')
const TransactionController = require("../controller/transactionController");
const { Transaction } = require("mongodb");

// router.post("/", TransactionController.saveTransaction);

router.get("/blockNumber/:blockNumber", TransactionController.getTransactionsByBlockNumber);

// router.get("/blockNumber/:number", BlockController.getBlockNumber)

// router.delete("/", TransactionController.deleteAll);

router.get("/:hash", TransactionController.getTransactionHash);

// router.get("/", TransactionController.getAll);

// router.get("/latest", TransactionController.getLatestTransactions);

router.get("/", TransactionController.getLatestTransaction);

// router.get("/pending", TransactionController.getPendingTransactions);

router.get("/address/:address", TransactionController.getTransactionsByAddress);

module.exports = router;
