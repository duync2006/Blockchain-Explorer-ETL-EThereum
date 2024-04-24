const express = require("express");
const router = express.Router();
const ContractController = require('../controller/contractController')

router.get('/', ContractController.getAll)

router.get('/:address', ContractController.getContract)

router.get('/contractInternalTxns/:address', ContractController.getContractInternalTxns)

router.post('/addContractName', ContractController.setContractName);

router.get('/bytecode/:address', ContractController.getByteCode)

router.delete("/", ContractController.deleteAll);

module.exports = router