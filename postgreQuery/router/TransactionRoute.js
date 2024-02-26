const express = require("express");
const router = express.Router();
const TransactionController = require("../controller/transactionController");

router.get("/blockNumber/:blockNumber", TransactionController.getTransactionsByBlockNumber);

router.get("/txHash/:hash", TransactionController.getTransactionHash);

router.get("/latest", TransactionController.getLatestTransaction);

router.get("/address/:address", TransactionController.getTransactionsByAddress);

router.get("/total", TransactionController.getTotalNumberTrans);

router.get("/", TransactionController.getAllTransaction);

module.exports = router;
