const express = require("express");
const router = express.Router();
const BlockController = require('../controller/blockController')

router.get("/blockNumber/:number", BlockController.getBlockNumber)

router.get("/blockHash/:blockHash", BlockController.getBlockHash)

router.get("/lastest", BlockController.getLatestBlocks)

router.get("/total", BlockController.getTotalBlocks)

router.delete("/", BlockController.deleteAll)

module.exports = router
