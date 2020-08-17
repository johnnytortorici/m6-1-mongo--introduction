const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();

  // connect to the databse
  const db = client.db(dbName);
  console.log("Connected!");

  // create sample user
  await db.collection("users").insertOne({ name: "Buck Rogers" });

  // close the connection to the database server
  client.close();
  console.log("Disconnected!");
};

dbFunction("exercise_1");
