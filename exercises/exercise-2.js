const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("exercise_1");
    console.log("Connected!");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);

    // on success
    res.status(200).json("ok");
  } catch (err) {
    // on failure
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  // close connection
  client.close();
  console.log("Disconnected!");
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;

  // create client
  const client = await MongoClient(MONGO_URI, options);

  // connect to client
  await client.connect();

  // connect to db server
  const db = client.db("exercise_1");
  console.log("Connected!");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
    console.log("Disconnected!");
  });
};

const getGreetings = async (req, res) => {
  const start = req.query.start;
  const limit = req.query.limit;

  // create client
  const client = await MongoClient(MONGO_URI, options);

  // connect to client
  await client.connect();

  // connect to db server
  const db = client.db("exercise_1");
  console.log("Connected!");

  const data = await db.collection("greetings").find().toArray();
  if (data[0] !== undefined) {
    let limitData = [];

    if (start && limit) {
      limitData = data.slice(start, Number(start) + Number(limit));
    } else if (start) {
      limitData = data.slice(start, Number(start) + 25);
    } else if (limit) {
      limitData = data.slice(0, limit);
    } else {
      limitData = data.slice(0, 25);
    }
    res.status(200).json({ data: limitData });
  } else {
    res.status(404).json({ error: "No greetings found." });
  }

  client.close();
  console.log("Disconnected!");
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;

  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("exercise_1");
    console.log("Connected!");

    const r = await db.collection("greetings").deleteOne({ _id: _id });
    assert.equal(1, r.deletedCount);

    // on success
    res.status(204).json("ok");
  } catch (err) {
    // on failure
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  // close connection
  client.close();
  console.log("Disconnected!");
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;

  // create client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to client
    await client.connect();

    // connect to db server
    const db = client.db("exercise_1");
    console.log("Connected!");

    const query = { _id };
    const hello = req.body.hello;
    let newValues = {};

    if (hello) {
      newValues = { $set: { ...{ hello: hello } } };
      const r = await db.collection("greetings").updateOne(query, newValues);
      assert.equal(1, r.matchedCount);
      assert.equal(1, r.modifiedCount);
      // on success
      res.status(200).json({ status: 200, _id, ...{ hello: hello } });
    } else {
      res.status(500).json({ status: 500, error: "Missing the hello key." });
    }
  } catch (err) {
    // on failure
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  // close connection
  client.close();
  console.log("Disconnected!");
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
