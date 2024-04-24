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
const StatisticRoute = require('./router/StatisticRoute')
const web3 = require('./web3')

var WebSocketServer = require('ws').Server

// const wss = new WebSocketServer({ port: 8080 });
// wss.on('connection', async function(ws) {
//     // console.log("helloworld")
//     var subscription = web3.eth.subscribe('pendingTransactions',function(error, result){
//       if (!error)
//       console.log(result);
//     })
//     .on("data", async function(transaction){
//       console.log(transaction)
//       // res.status(200).send(await )
//       // ws.send(await web3.eth.getTransaction(transaction));
//       let pendingData = await web3.eth.getTransaction(transaction)
//       ws.send(JSON.stringify(pendingData))
//     });

//     ws.on('message', async function(message) {
//       messageData = JSON.parse(message)
//       console.log('received: %s', messageData);
//       console.log(messageData.hash)
//       if (messageData.hash) {
//         subscription.unsubscribe(function(error, success){
//           if(success)
//               console.log('Successfully unsubscribed!');
//         });
//         ws.send(JSON.stringify(await web3.eth.getTransaction(messageData.hash)))
//       }
      
//   });
// })

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
app.use("/statistic",StatisticRoute )

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})