const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000 ;




// Middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evuna6q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



// Home Route 

app.get( '/' , (req, res) => {
    res.send('Welcome to Royal Espresso Server')
})


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('allCoffees');

    app.get('/coffees', async(req, res) => {
      const coffees = coffeeCollection.find();
      const result =  await coffees.toArray();
      res.send(result)
    })

    app.get('/coffee/:id', async(req, res) => {
      const iD = req.params.id;
      const query = {_id: new ObjectId(iD)};
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })


    app.post( '/addCoffee', async(req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)

    })

    app.put('/updateCoffee/:id', async(req, res) => {
      const iD = req.params.id;
      const updatedCoffee = req.body;
      const { name, quantity, supplier, taste, category, details, photo } = updatedCoffee;
      const filter = {_id : new ObjectId(iD)};
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          name,
          quantity,
          supplier,
          taste,
          category,
          details,
          photo

        },
      };

      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result)
      
    })

    app.delete('/coffees/:id', async(req, res) => {
      const iD = req.params.id;
      const query = {_id: new ObjectId(iD)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)

    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  
  finally {
    // Ensures that the client will close when you finish/error
   /*  await client.close(); */
  }
}
run().catch(console.dir);





// Must have 
app.listen( port , () => {
    console.log(`Our Coffee shop server is Running on the PORT: ${port}`);
})


