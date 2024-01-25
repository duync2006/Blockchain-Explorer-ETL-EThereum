const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
// const controller = require('./controller/index')
const TransactionRoute = require('./router/TransactionRoute')
const ExtractRoute = require('./router/ExtractRoute')
const AbiRoute = require('./router/AbiRoute')
const BlockRoute = require('./router/BlockRoute')
const ContractRoute = require('./router/ContractRoute')
const LogRoute = require('./router/LogRoute')
const AccountRoute = require('./router/AccountRoute')
const DeleteRoute = require('./router/DeleteRoute')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


app.use("/blocks", BlockRoute);
app.use("/transactions", TransactionRoute)
app.use("/extract", ExtractRoute)
app.use("/contracts", ContractRoute)
app.use("/abi", AbiRoute)
app.use("/logs", LogRoute)
app.use("/account", AccountRoute)
app.use("/delete", DeleteRoute)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})