const mongoose = require("mongoose")

const db = async function connectDB() {
  const url = "mongodb+srv://duynguyen206k20:billboss123@cluster0.gjrzlea.mongodb.net/";
 
  try {
    await mongoose.connect(url)
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });
 
  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}

module.exports = {db};