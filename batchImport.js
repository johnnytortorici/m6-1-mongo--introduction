const { MongoClient } = require("mongodb");
const assert = require("assert");
const fs = require("file-system");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  console.log(greetings);

  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("exercise_1");
    console.log("Connected!");

    const r = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, r.insertedCount);

    // on success
    console.log("ok");
  } catch (err) {
    // on failure
    console.log(err.message);
    console.log(err.stack);
  }

  // close connection
  client.close();
  console.log("Disconnected!");
};

batchImport();
