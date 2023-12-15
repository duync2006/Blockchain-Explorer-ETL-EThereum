const express = require("express");
const router = express.Router();
const ReceiptController = require("../controller/receiptController.js");

// router.post("/", BlockController.savePost);

// router.get("/save", ReceiptController.saveReceipt);

router.delete("/", ReceiptController.deleteAll);

router.get("/:txHash", ReceiptController.getReceipt);

// router.get("/lastest", BlockController.getLatestBlocks)

// router.get("/blockNumber/:number", BlockController.getBlockNumber)

// router.get("/blockHash/:blockHash", BlockController.getBlockHash)
module.exports = router;
