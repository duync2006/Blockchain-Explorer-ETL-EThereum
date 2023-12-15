const express = require("express");
const router = express.Router();
const ContractController = require('../controller/contractController')

router.get('/', ContractController.getAll)

module.exports = router