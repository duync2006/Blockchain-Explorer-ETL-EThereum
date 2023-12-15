const express = require("express");
const router = express.Router();
const BlockController = require('../controller/blockController.js')

router.post("/", BlockController.savePost);

// router.get("/save", BlockController.saveBlockAutomation);

router.delete("/", BlockController.deleteAll)

router.get("/", BlockController.getAll)

router.get("/lastest", BlockController.getLatestBlocks)

router.get("/blockNumber/:number", BlockController.getBlockNumber)

router.get("/blockHash/:blockHash", BlockController.getBlockHash)
module.exports = router