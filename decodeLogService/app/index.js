const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const produceLog = require('../rabbitmq/producer')
const decodeWorker = require('../rabbitmq/worker')


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
app.get('/createWorker', async(req, res) => {
  try {
    console.log('hello')
    const worker1 = await decodeWorker();
    res.status(200).send("OKE")    
  } catch (error) {
    console.error(error)
    res.status(500).send('FAILED')
  }
  // const producer = await produceLog(startBlockNumber, endBlockNumber)
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})