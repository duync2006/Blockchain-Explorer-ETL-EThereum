const express = require("express");
const router = express.Router();
const ExtractController = require('../controller/ExtractController')


router.post('/manual', ExtractController.extractManual)
router.post('/automatic', ExtractController.extractAutomatic)
router.get('/stop/:pid', ExtractController.stopAutomateExtract)
module.exports = router