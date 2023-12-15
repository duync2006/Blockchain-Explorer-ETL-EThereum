const express = require("express");
const router = express.Router();
const TokenTransferController = require("../controller/tokenTransferController.js");
const TokenTransferModel = require("../model/tokenTransfer.js");

// router.post("/", BlockController.savePost);

// router.get("/save", TokenTransferController.saveTokenTransfer);

router.delete("/", TokenTransferController.deleteAll);

router.get("/:txHash", TokenTransferController.getTokenTransfer);

// router.get("/lastest", BlockController.getLatestBlocks)

// router.get("/blockNumber/:number", BlockController.getBlockNumber)

// router.get("/blockHash/:blockHash", BlockController.getBlockHash)
module.exports = router;
