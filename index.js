const express = require("express");
const connectDB = require("./config/db.js")
const BlockRoute = require("./routes/BlockRoute.js")
const ETL = require("./extract_data_blockchain/ETL.js")
const TransactionRoute = require('./routes/TransactionRoute.js');
const TokenTransferRoute = require("./routes/TokenTransferRoute.js");
const LogRoute = require("./routes/LogRoute.js");
const ReceiptRoute = require("./routes/ReceiptRoute.js");
const TraceRoute = require("./routes/TraceRoute.js");
const ContractRoute = require("./routes/ContractRoute.js")
const AbiRoute = require("./routes/AbiRoute.js")

require('dotenv').config();
const web3 = require('./config/web3.js')

const connect = async () => {
  await connectDB.db()
  console.log(" ---------------Started -------------")
}


const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/blocks", BlockRoute);
app.use("/transactions", TransactionRoute)
app.use("/tokenTransfers", TokenTransferRoute)
app.use("/logs", LogRoute)
app.use("/receipts", ReceiptRoute)
app.use("/traces", TraceRoute)
app.use("/contracts", ContractRoute)
app.use("/abi", AbiRoute)
app.get("/", (request, response) => {
  response.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, async () => {
  await connect();
  console.log(`Server running at http://localhost:${PORT}`);
  
  ETL.ETL()
});


