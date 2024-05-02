const { Client } = require('pg');
require('dotenv').config()
async function connect() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
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