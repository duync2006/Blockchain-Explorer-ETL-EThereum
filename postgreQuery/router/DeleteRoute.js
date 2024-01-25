const express = require("express");
const router = express.Router();
const DeleteController = require('../controller/deleteController')

router.delete("/transactions", DeleteController.deleteTransactions);

router.delete("/blocks", DeleteController.deleteBlocks)

router.delete('/logs', DeleteController.deleteLogs)

router.delete('/contracts', DeleteController.deleteContracts)

router.delete('/traces', DeleteController.deleteTraces)

router.delete('/tokens', DeleteController.deleteTokens)

router.delete('/tokenTransfers', DeleteController.deleteTokenTransfers)

router.delete('/all', DeleteController.deleteAll)
module.exports = router;