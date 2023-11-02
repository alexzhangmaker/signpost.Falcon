
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://alexszhang:ChinaNO0001.@athenacluster0.ls5vshu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runPing() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//runPing().catch(console.dir);


async function runQuery() {
    try {
        
        await client.connect();
        // Get the database and collection on which to run the operation
        const database = client.db("falcon");
        const incomeStatement = database.collection("incomeStatement");
        // Query for movies that have a runtime less than 15 minutes
        const query = { 
            year: "2023",
            month:"09" 
        };
        /*
        const options = {
        // Sort returned documents in ascending order by title (A->Z)
        sort: { title: 1 },
        // Include only the `title` and `imdb` fields in each returned document
        projection: { _id: 0, title: 1, imdb: 1 },
        };
        */
        // Execute query 
        const cursor = incomeStatement.find(query/*, options*/);
        // Print a message if no documents were found
        if ((await incomeStatement.countDocuments(query)) === 0) {
            console.log("No documents found!");
        }
        // Print returned documents
        for await (const incomeDoc of cursor) {
            console.dir(incomeDoc.incomeStream);
        }
    } finally {
        await client.close();
    }
}


//runQuery()/*.catch(console.dir)*/;


async function runInsert() {
  try {
        await client.connect();

        // Connect to the "insertDB" database and access its "haiku" collection
        const database = client.db("falcon");
        const incomeStatement = database.collection("incomeStatement");
        
        // Create a document to insert
        const jsonIncome = {
            year: "2023",
            month:"07",
            incomeStream:[
                {
                    "date":"2023/07/01",
                    "income":200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                },{
                    "date":"2023/07/21",
                    "income":1200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                },{
                    "date":"2023/07/01",
                    "income":200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                },{
                    "date":"2023/07/21",
                    "income":1200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                },{
                    "date":"2023/07/01",
                    "income":200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                },{
                    "date":"2023/07/21",
                    "income":1200.00,
                    "currency":"THB",
                    "source":"Arise Condo",
                    "class":"Rental",
                    "status":"collected"    
                }
            ]
        }
        // Insert the defined document into the "haiku" collection
        const result = await incomeStatement.insertOne(jsonIncome);

        // Print the ID of the inserted document
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
        // Close the MongoDB client connection
        await client.close();
  }
}
// Run the function and handle any errors
//runInsert().catch(console.dir);

