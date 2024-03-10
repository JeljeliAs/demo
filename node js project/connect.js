
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = "mongodb+srv://asma6:123456asma!!@cluster0.awarx0s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  console.log('runniing.....')
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("auditapp").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    return client
  } catch(err) {
      console.log('error while connecting to DB', err)
  }
}

exports.run = run
