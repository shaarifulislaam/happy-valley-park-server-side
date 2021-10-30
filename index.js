const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ip6hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//async function
async function run() {
  try {
    await client.connect();
    const ServicesCollection = client
      .db("happyValleyPark")
      .collection("services");
    const BookingCollection = client
      .db("happyValleyPark")
      .collection("booking");

    //*GET API or GET all services
    app.get("/services", async (req, res) => {
      const cursor = ServicesCollection.find({});
      const services = await cursor.toArray();

      res.send(services);
    });

    //*GET API for single services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await ServicesCollection.findOne(query);

      res.json(service);
    });

    //*ADD Services
    app.post("/services", async (req, res) => {
      const result = await ServicesCollection.insertOne(req.body);

      res.json(result);
    });

    //* add place order
    app.post("/placeBooking", async (req, res) => {
      console.log(req.body);
      const result = await BookingCollection.insertOne(req.body);
      res.send(result);
    });

    //* get all booking
    app.get("/placeBooking", async (req, res) => {
      const result = await BookingCollection.find({}).toArray();
      res.send(result);
    });

    //*filter email
    app.get("/placeBooking/:email", async (req, res) => {
      const email = req.params.email;
      const query = await BookingCollection.find({ email });
      const result = await query.toArray();
      res.send(result);
    });
    //*DELETE API
    app.delete("/placeBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await BookingCollection.deleteOne(query);
      res.send(result);
    });

    //*UPDATE API
    app.put("/placeBooking/:id", async (req, res) => {
      const id = req.params.id;
      const updateDetails = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateDetails.status,
        },
      };
      const result = await BookingCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
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
