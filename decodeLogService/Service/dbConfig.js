const { Client } = require('pg');



async function connect() {
  const client = new Client({
    // user: 'postgres',
    // password: 'etl777',
    // host: '172.17.0.2',
    // port: '5432',
    // database: 'etl_ethereum',
    connectionString: 'postgresql://postgres:etl777@localhost:5432/etl_ethereum'
  });
  try {
    await client.connect()
    console.log("Connected to PostgreSQL database")
    return client
  } catch (error) {
    console.error(error)
    console.error("Connected to PostgreSQL database Failed")
  }
}

module.exports = connect;