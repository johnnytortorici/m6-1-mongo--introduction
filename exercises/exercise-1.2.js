const { MongoClient, Db } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async (dbName) => {
  // create a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();

  // connect to the database
  const db = client.db(dbName);
  console.log("Connected!");

  const data = await db.collection("users").find().toArray();
  console.log(data);

  // disconnect
  client.close();
  console.log("Disconnected!");
};

getCollection("exercise_1");
