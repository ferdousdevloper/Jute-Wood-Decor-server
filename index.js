const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://assignment-10-143ad.web.app"]
}));
app.use(express.json());


//juteWoodDecor
//pass: inPINFkvKLOTu3sZ



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dizfzlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect(); //for deploy

    const decorCollection = client.db('decorDB').collection('decor')
    const userCollection = client.db('decorDB').collection('user');
    const categoryCollection = client.db('decorDB').collection('categoryCollection');


    app.get('/decor', async(req, res) =>{
        const cursor = decorCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    

    app.get('/decor/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const decor = await decorCollection.findOne(query);
        res.send(decor);
    })


    app.post('/decor', async(req, res)=>{
        const newCraftItem = req.body;
        console.log(newCraftItem);
        const result = await decorCollection.insertOne(newCraftItem);
        res.send(result);
    })
    app.put('/decor/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedCraftItem = req.body;
      const craftItem = {
        $set:{
          name: updatedCraftItem.name, 
          category: updatedCraftItem.category, 
          price: updatedCraftItem.price, 
          customization: updatedCraftItem.customization, processingTime: updatedCraftItem.processingTime, 
          stockStatus: updatedCraftItem.stockStatus, 
          image: updatedCraftItem.image, 
          rating: updatedCraftItem.rating, 
          description: updatedCraftItem.description
        }
      }
      const result = await decorCollection.updateOne(filter, craftItem, options)
      res.send(result)
    })

    app.delete('/decor/:id', async(req, res)=>{
      const id = req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await decorCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/myCraftList/:email', async(req, res)=>{
        console.log(req.params.email);
        const result = await decorCollection.find({email:req.params.email}).toArray();
        res.send(result)
    })

    app.get('/category/:category',async(req, res)=>{
      console.log(req.params.category);
      const result = await categoryCollection.find({category:req.params.category}).toArray();
      res.send(result)
    })

    app.get('/decor/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await decorCollection.findOne(query)
      res.send(result);
    })

    //user related apis

    app.get('/user', async(req, res) =>{
        const cursor = userCollection.find();
        const user = await cursor.toArray();
        res.send(user)
    })

    app.post('/user', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user)
        res.send(result);
    })

    //category related apis

    app.get('/category', async(req, res)=>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection

    //await client.db("admin").command({ ping: 1 }); //for deploy

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) =>{
    res.send('wood server is running')
})

app.listen(port, () =>{
    console.log(`wood server is running on port: ${port}` );
})