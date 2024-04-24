
var amqp = require('amqplib');
const connectDB = require('../Service/dbConfig')
const web3 = require('../Service/web3Config')

async function produceLog(startBlockNumber, endBlockNumber, options = 0) {
  try {
    startBlockNumber = startBlockNumber ? startBlockNumber : 0;
    endBlockNumber = endBlockNumber ? endBlockNumber : await web3.eth.getBlockNumber();

    const client = await connectDB();
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel();
    channel.assertQueue("logs_queue_lazy_db", {
      durable: true,
      queueMode: 'lazy'
    })
    let log_data;
    if(options==0) {
      log_data = await client.query(`SELECT log_index, transaction_hash, address, data, topic0, topic1, topic2, topic3,block_number FROM logs\
                                        where block_number >= ${startBlockNumber} AND block_number <= ${endBlockNumber} AND is_decoded = false AND decode_failed = false`);
    } else if (options == 1) {
      log_data = await client.query(`SELECT log_index, transaction_hash, address, data, topic0, topic1, topic2, topic3,block_number FROM logs\
                                        where block_number >= ${startBlockNumber} AND block_number <= ${endBlockNumber} AND decode_failed = true`);
    } else if (options == 2) {
      log_data = await client.query(`SELECT log_index, transaction_hash, address, data, topic0, topic1, topic2, topic3,block_number FROM logs\
                                        where block_number >= ${startBlockNumber} AND block_number <= ${endBlockNumber}`);
    }
    let groupedObject = log_data.rows.reduce((acc, obj) => {
      const key = obj.transaction_hash;
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc;
    }, {})

    let temp = {};
    for (let logs in groupedObject) {
      temp[logs] = groupedObject[logs];
      console.log('buffer: ', Buffer.from(JSON.stringify(temp)))
      // for (let i = 0; i <= 30; i++)
      channel.sendToQueue('logs_queue_lazy_db', Buffer.from(JSON.stringify(temp)), {persistent: true})
      temp = {};
      console.log(" [x] Sent '%s'", logs);
    }
    console.log('Number logs: ', log_data.rows.length)
    } catch (error) {
      console.error(error)
    }
}
produceLog(0, 9000000, 0)
  // produceLog(7001350, 7009000, 1)
// setTimeout(() => {
//   produceLog(0, 7009000)
// }, 10000)

module.exports = produceLog;