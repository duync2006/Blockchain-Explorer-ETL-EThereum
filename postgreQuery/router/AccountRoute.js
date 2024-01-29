const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountController");

router.get("/asset/:address", accountController.getAsset);

router.get("/ERC20TokenTransfers/:address", accountController.getTokenTransferERC20);

router.get("/NFTTokenTransfers/:address", accountController.getTokenTransferNFT);

router.get("/identify/:address", accountController.identify)

router.get("/overview/:address", accountController.getAccountOverview)

router.get("/overview/ERC20/:address", accountController.getAccountERC20Overview)

router.get("/overview/ERC721/:address", accountController.getAccountERC721Overview)

router.get("/SCA/tokenTransfer/:address", accountController.getERC20TokenTransfers_SCA)

module.exports = router;
