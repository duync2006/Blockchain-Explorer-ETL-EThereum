const express = require("express");
const router = express.Router();

const AbiController = require("../controller/abiController")

router.post("/", AbiController.addAbi)

router.delete("/:topic", AbiController.removeAbi)

router.put("/update", AbiController.updateAbi)

module.exports = router
