const express = require("express");
const router = express.Router();
const LogController = require("../controller/logController.js");

router.get("/:txHash", LogController.getLog);

module.exports = router;
