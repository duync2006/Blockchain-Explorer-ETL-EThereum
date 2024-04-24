const {web3_node_1, web3_node_2, web3_node_3} = require('../Service/web3Config')
const contractAddress = require('../Service/contract_address.json')
const abi = require('../Service/abi.json')
const connectDB = require('../Service/dbConfig')
var amqp = require('amqplib');
var queue = 'logs_queue_lazy_db';

async function decodeLogWorker(nodetype = 1, messageLimit = 50) {
  const client = await connectDB();
  const web3 = nodetype == 1 ? web3_node_1 : nodetype == 2 ? web3_node_2: web3_node_3
  const contract = new web3.eth.Contract(abi, contractAddress.address)
  // const connection = await amqp.connect('amqp://user:password@localhost:5672')
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel();
  channel.assertQueue(queue, {
    durable: true,
    queueMode: 'lazy'
  })
channel.prefetch(1);
channel.qos(messageLimit)
channel.consume(queue, async function(msg) {
  if (msg) {
    const obj = JSON.parse(msg.content.toString());
    const logs = (Object.values(obj))
    console.log(logs)

    let values = "";

    // ---------------DECODE AND BATCH DATA----------------------------
   await Promise.all(logs[0].map(async (element) => {
      // console.log("LOG: ", element)
      // const topicArr = element.topics
      const topic0 = element.topic0
      const keyEventAbi = web3.utils.soliditySha3('EventABI' + topic0);
      // ERC20 vs 721
      // Divide RPC
      const eventABIString = await contract.methods.getStringValue(keyEventAbi).call()
      if (eventABIString) {
      const event_abi = JSON.parse(eventABIString);
      console.log(event_abi)
        // decode log 
        const specialTopics = ['0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
        if (specialTopics.includes(topic0)
        && element.topic3) {
              event_abi[2].indexed = true;
              console.log("event_abi: ", event_abi)
            }
        try {
          const decodeLog = await web3.eth.abi.decodeLog(event_abi, element.data, [element.topic1, element.topic2, element.topic3])
          const decodeData = {};
          event_abi.map((ele) => {
            decodeData[ele.name] = decodeLog[ele.name]
          })
          values += `('${JSON.stringify(decodeData)}'::json, true, false, ${element.log_index}, '${element.transaction_hash}'),`
        } catch (error) {
          console.error(error)
          const query = `UPDATE logs SET decode_failed = true, is_decoded = true WHERE log_index = ${element.log_index} AND transaction_hash = '${element.transaction_hash}'::text`
          await client.query(query)
          console.error(`Decode FAILED with log_index = ${element.log_index} and hash = ${element.transaction_hash}`)
        }
      } else {
        const query = `UPDATE logs SET decode_failed = true, is_decoded = true WHERE log_index = ${element.log_index} AND transaction_hash = '${element.transaction_hash}'::text`
        await client.query(query)
        console.error(`Event ABI Not Found with log_index = ${element.log_index} and hash = ${element.transaction_hash} and EventABI = ${eventABIString}`)
      }
    }))
    // ---------------BULK UPDATE-------------------
    try {
      if (values) {
        values = values.substring(0, values.length - 1)
        const query = `
          UPDATE logs
          SET
            decode = myvalues.decode,
            is_decoded = myvalues.is_decoded,
            decode_failed = myvalues.decode_failed
          FROM (VALUES ${values}) AS myvalues (decode, is_decoded, decode_failed, log_index, transaction_hash)
          WHERE logs.log_index = myvalues.log_index AND logs.transaction_hash = myvalues.transaction_hash
          `
        // console.log(query)
        await client.query(query)
        console.log("Update decode Values: ", values)
        channel.ack(msg)
      }}
    catch (error) {
      console.error(error)
    }
  }
},
{
  noAck: false
}); 
}

decodeLogWorker(1, 50)

module.exports = decodeLogWorker;










// console.log('values: ', values)
// console.log("decode data:", decodeData)

// save into db
// const query = `INSERT INTO logs (log_index, transaction_hash, decode, is_decode)\
//              VALUES (${element.log_index}, '${element.transaction_hash}'::text,'${JSON.stringify(decodeData)}'::json,${true})\
//              ON CONFLICT (log_index, transaction_hash) DO UPDATE SET decode = EXCLUDED.decode, is_decode = EXCLUDED.is_decode`



// const query = `UPDATE logs SET decode = '${JSON.stringify(decodeData)}'::json, is_decoded = true\
//                WHERE log_index = ${element.log_index} AND transaction_hash = '${element.transaction_hash}'::text`


// await client.query(query)
// console.log(`Decode log susscess with log_index = ${element.log_index} and hash = ${element.transaction_hash}`)