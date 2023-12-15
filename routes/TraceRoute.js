const express = require("express");
const router = express.Router();
const TraceController = require("../controller/traceController");

// router.post("/", BlockController.savePost);

// router.get("/save", TraceController.saveTrace);

router.delete("/", TraceController.deleteAll);

// router.get("/", BlockController.getAll)

// router.get("/lastest", BlockController.getLatestBlocks)

router.get("/blockNumber/:number", TraceController.getTracesByBlockNumber);

// router.get("/blockHash/:blockHash", BlockController.getBlockHash)
module.exports = router;
