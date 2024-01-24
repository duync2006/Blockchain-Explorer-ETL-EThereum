const express = require("express");
const router = express.Router();
const ContractController = require('../controller/contractController')

router.get('/', ContractController.getAll)

router.get('/:address', ContractController.getContract)

router.post('/addContractName', ContractController.setContractName);

router.delete("/", ContractController.deleteAll);


module.exports = router