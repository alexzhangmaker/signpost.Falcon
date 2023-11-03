const express = require('express');

const fs = require('fs');
var path = require('path');

/*
const ejs = require('ejs');
const fetch = require('node-fetch') ;
const fse = require('fs-extra')

const cookieParser = require('cookie-parser')
const session = require('express-session') ;
const passport = require('passport');
const logger = require('morgan') ;

const { fork } = require('node:child_process');
const urlTool=require('url');
const download = require('download');
*/
require('dotenv').config() ;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://alexszhang:ChinaNO0001.@athenacluster0.ls5vshu.mongodb.net/?retryWrites=true&w=majority";


const app = express();
app.use(express.static('public'))
app.use(express.json());

const urlSignpost = process.env.urlSignpost;//'http://127.0.0.1:8080/' ;
const projectId = process.env.SignpostGoogleProjectId;//'athena-396606';

const userID = 'alexszhang@gmail.com' ;
const port = parseInt(process.env.FalconServerPort);


//http://127.0.0.1:8080/json?mm=10
app.get('/json', serveIncomeStream);
app.get('/dryRun', _dryRun);


app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});



async function serveIncomeStream(req, res){
  let cMonth = req.query.mm ;
  console.log('serveIncomeStream') ;
  let jsonGlobalIncome={
    "date":"2023/10/31",
    "incomes":[
        {
            "date":"2023/10/01",
            "income":200.00,
            "currency":"THB",
            "source":"Arise Condo",
            "class":"Rental",
            "status":"collected"
          },{
            "date":"2023/10/01",
            "income":200.00,
            "currency":"USD",
            "source":"PGX",
            "class":"Devidend",
            "status":"scheduled"
          }
    ]
  } ;

  let jsonIncome = {
    "date":"2023/10/31",
    "incomes":await runQueryIncome(cMonth)
  };
  
  console.log(JSON.stringify(jsonIncome,null,3)) ;

  res.json(jsonIncome);
}







async function _dryRun(req, res){
  res.send('dryRun request receieved') ;
  console.log('_dryRun') ;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

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


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runQueryIncome(cMonth) {
  let incomeStream={} ;
  try {
      await client.connect();
      // Get the database and collection on which to run the operation
      const database = client.db("falcon");
      const incomeStatement = database.collection("incomeStatement");
      // Query for movies that have a runtime less than 15 minutes
      const query = { 
          year: "2023",
          month:cMonth 
      };
      
      const cursor = incomeStatement.find(query/*, options*/);
      // Print a message if no documents were found
      if ((await incomeStatement.countDocuments(query)) === 0) {
          console.log("No documents found!");
      }
      // Print returned documents
      for await (const incomeDoc of cursor) {
          //console.dir(incomeDoc.incomeStream);
          incomeStream = incomeDoc.incomeStream ;
      }
  } finally {
      await client.close();
      return incomeStream ;
  }
}