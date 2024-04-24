const express = require("express");
const router = express.Router();
const BlockController = require('../controller/blockController')

router.get("/blockNumber/:number", BlockController.getBlockNumber)

router.get("/blockHash/:blockHash", BlockController.getBlockHash)

router.get("/lastestBlocks", BlockController.getLatestBlocks)

router.get("/total", BlockController.getTotalBlocks)

router.get("/", BlockController.getAllBlocks)

router.get("/latest", BlockController.getDetailLatestBlock)

router.get("/getInternalTxns/:number", BlockController.getBlockInternalTxns)

router.delete("/", BlockController.deleteAll)

module.exports = router
