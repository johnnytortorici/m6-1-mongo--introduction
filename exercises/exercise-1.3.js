const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  // create a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();

  // connect to the database
  const db = client.db(req);
  console.log("Connected!");

  const data = await db.collection("users").find().toArray();
  data[0] !== undefined
    ? res.status(200).json({ status: 200, users: data })
    : res.status(404).json({ status: 404, error: "No users found." });

  // disconnect
  client.close();
  console.log("Disconnected!");
};

module.exports = { getUsers };
