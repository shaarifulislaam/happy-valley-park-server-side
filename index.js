const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ip6hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//run function
async function run() {
  try {
    await client.connect();
    console.log("connected with the server");
  } finally {
    // await client.close();
  }
}
//function call
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server running successfully!!");
});

app.listen(port, () => {
  console.log(`Happy Valley Park server listening at http://localhost:${port}`);
});
