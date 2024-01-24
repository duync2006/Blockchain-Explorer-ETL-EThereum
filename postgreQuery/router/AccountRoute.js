const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountController");

router.get("/asset/:address", accountController.getAsset);

router.get("/ERC20TokenTransfers/:address", accountController.getTokenTransferERC20);

router.get("/NFTTokenTransfers/:address", accountController.getTokenTransferNFT);

router.get("/identify/:address", accountController.identify)


module.exports = router;
