const express = require('express');

const fs = require('fs');
var path = require('path');
const logger=require('./log.js') ;

require('dotenv').config() ;
const winston = require('winston');
//const path = require('node:path') ;

const assistantDB = require('better-sqlite3')('./public/SQLiteDB/assistantDB.db', { verbose: console.log });



// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })


fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
  //constraints: { host: 'example.com' } // optional: default {}
}) ;


const route = {
  method: 'POST',
  url: '/login',
  handler: () => {},
  schema: {},
}


// Declare a route
fastify.get('/', function handler (request, response) {
  response.send({ hello: 'world' }) ;
}) ;

fastify.get('/fetchTodos', function handler (request, response) {
  let jsonTodos= _fetchToDos() ;
  response.send(jsonTodos) ;
}) ;


//url: /markTodo/:id/:status
fastify.get('/markTodo/:id/:status', function handler (request, response) {
  const {id, status } = request.params;
  console.log(request.params) ;
  console.log(JSON.stringify(request.params,null,3)) ;


  console.log(`${id}    ${status}`) ;
  //let jsonTodos= _markToDo(idToDo,status) ;
  _markToDo(id.replace(':',''),status.replace(':','')) ;
  response.send({status:'200 ok'}) ;
}) ;

//   /markTodo/:userId/:secretToken
/*
fastify.route({
  method: 'GET',
  url: '/markTodo',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      id: { type: 'string' },
      status:{ type: 'string' }
    }
  },
  handler: async (request, reply) => {
   // here you will get request.query if your schema validate

  }
})
*/



fastify.post('/saveTodos', async function handler (request, response) {
  let jsonData = request.body ;
  console.log(jsonData) ;
  console.log(JSON.stringify(jsonData,null,3)) ;
  _newToDo(jsonData) ;
  response.send({ hello: 'world' }) ;

}) ;


// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}) ;


function _markToDo(pIdToDo,pStatus){

  //let cStmtIns = `UPDATE todos SET (status) VALUES (@status) WHERE  idToDo=@idToDo` ;
  //const stmtIns = assistantDB.prepare(cStmtIns);    
  //stmtIns.run({status:pStatus,idToDo:pIdToDo});

  const stmt = assistantDB.prepare('UPDATE todos SET status = ? WHERE idToDo = ?'); 
  const updates = stmt.run(pStatus, pIdToDo);
}

function _newToDo(jsonTodo){
  let cToDoID = _generateDynamicID() ;
  let objMoment = new Date() ;

  let jsonDBTodo={
    idToDo:_generateDynamicID(),
    timeStamp:jsonTodo.timeStamp,//objMoment.toLocaleTimeString(),
    title:jsonTodo.title,
    memo:jsonTodo.memo,
    status:'todo'
  } ;

  let cStmtIns = `
  INSERT INTO todos (idToDo,timeStamp,title,memo,status) VALUES ( @idToDo,@timeStamp,@title,@memo,@status)
  ` ;
  const stmtIns = assistantDB.prepare(cStmtIns);    
  stmtIns.run(jsonDBTodo);
}

function _fetchToDos(){
  const stmt = assistantDB.prepare('SELECT idToDo,timeStamp,title,memo,status FROM todos where status = ? order by timeStamp DESC');// order by timeStamp
  const entries = stmt.all("todo");


  let jsonTodos=[] ;
  let jsonBuckets=[] ;
  for(let i=0;i<entries.length;i++){
    let jsonTodo= entries[i] ;
    //let dateParts = entries[i].timeStamp.split('-') ;
    //jsonTodo.year=parseInt(dateParts[0]) ;
    //jsonTodo.month=parseInt(dateParts[1]) ;
    //jsonTodo.date=parseInt(dateParts[2]) ;
    //if(jsonBuckets.includes())
    /*
    if(entries[i].memo!='TBD'){
      jsonTodo.tags = JSON.parse(entries[i].memo) ;
    }
    */
    jsonTodos.push(jsonTodo/*entries[i]*/) ;
  }


  return jsonTodos ;
}


// some tool functions
function _hashCode(str, seed = 0){
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function _generateDynamicID(){
  let objMoment = new Date() ;
  //let cBookmarkID = `${objMoment.toLocaleTimeString()}` ;
  let cdynamicID = _hashCode(objMoment.toLocaleTimeString()) + Math.round(Math.random()*1000000);

  //console.log(cdynamicID) ;
  return cdynamicID.toString() ;
}