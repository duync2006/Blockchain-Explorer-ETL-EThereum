const express = require("express");
const router = express.Router();
const StatisticController = require("../controller/statisticController");
const { route } = require("./TransactionRoute");

router.get("/dashboard/", StatisticController.dashboardStatistic);

router.get("/filter/", StatisticController.filterNumberTrans)

// router.get("filterTransactions", )

module.exports = router;