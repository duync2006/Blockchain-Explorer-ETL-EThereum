const express = require("express");
const router = express.Router();

const AbiController = require("../controller/abiController")

// router.post("/eventSignature", AbiController.addEventSignature)

router.post("/contractAbi", AbiController.addContractAbi)

// router.post("/addSelector", AbiController.addSelector)

// router.delete("/:topic", AbiController.removeAbi)

// router.put("/update", AbiController.updateAbi)

module.exports = router
