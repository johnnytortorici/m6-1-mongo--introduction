const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res, dbName) => {
  // create client
  const client = await MongoClient(MONGO_URI, options);

  // connect to client
  await client.connect();

  // create db server
  const db = client.db(dbName);
  console.log("Connected!");

  // create user from json body
  const { name } = req.body;
  await db.collection("users").insertOne({ name: name });
  const newUser = await db.collection("users").findOne({ name: name });
  newUser !== undefined
    ? res.status(201).json({ status: 201, data: newUser })
    : res
        .status(400)
        .json({ status: 400, error: "Your request was not successful." });

  // close connection
  client.close();
  console.log("Disconnected!");
};

module.exports = { addUser };
