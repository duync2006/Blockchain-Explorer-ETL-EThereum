const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3005
const produceLog = require('../rabbitmq/producer')
const decodeWorkerWithDB = require('../rabbitmq/workerWithDB')
const decodeWorkerWithETL = require('../rabbitmq/worker')
const { web3_node_1, web3_node_2, web3_node_3 } = require('../Service/web3Config')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/produceLog', async(requese, response) => {
  try {
    const startBlockNumber = requese.body.startBlockNumber;
    const endBlockNumber = requese.body.endBlockNumber;
    const options = requese.body.options;
    // CREATE WORKER 
    // const worker1 = await decodeWorker();
    // const worker2 = await decodeWorker();
    // const worker3 = await decodeWorker();
    // const worker4 = await decodeWorker();
    
    // CREATE PRODUCER
    const producer = await produceLog(startBlockNumber, endBlockNumber, options)
    response.status(200).send('OK')
  } catch (error) {
    console.log(error)
    response.status(500).send('Failed')
  }
  
})
app.get('/createWorkerWithDB', async(req, res) => {
  try {
    const node = Number(req.query.node)
    const limitMessage = Number(req.query.limitMessage)
    console.log(node)
    console.log(limitMessage)
    const worker1 = await decodeWorkerWithDB(node, limitMessage);
    res.status(200).send("OKE")    
  } catch (error) {
    console.error(error)
    res.status(500).send('FAILED')
  }
})


app.get('/createWorkerWithETL', async(req, res) => {
  try {
    const node = Number(req.query.node)
    const limitMessage = Number(req.query.limitMessage)
    console.log(node)
    console.log(limitMessage)
    const worker1 = await decodeWorkerWithETL(node, limitMessage);
    res.status(200).send("OKE")    
  } catch (error) {
    console.error(error)
    res.status(500).send('FAILED')
  }
})



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
  decodeWorkerWithETL(web3_node_1, 50)
  decodeWorkerWithETL(web3_node_2, 50)
  decodeWorkerWithETL(web3_node_3, 50)
})