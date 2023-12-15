const express = require("express");
const router = express.Router();
const LogController = require("../controller/logController.js");

// router.post("/", BlockController.savePost);

// router.get("/save", LogController.saveLog);

router.get("/:txHash", LogController.getLog);

router.delete("/", LogController.deleteAll);

// router.get("/", BlockController.getAll)

// router.get("/lastest", BlockController.getLatestBlocks)F

// router.get("/blockNumber/:number", BlockController.getBlockNumber)

// router.get("/blockHash/:blockHash", BlockController.getBlockHash)
module.exports = router;
