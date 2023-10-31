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



const app = express();
app.use(express.static('public'))
app.use(express.json());

const urlSignpost = process.env.urlSignpost;//'http://127.0.0.1:8080/' ;
const projectId = process.env.SignpostGoogleProjectId;//'athena-396606';


const userID = 'alexszhang@gmail.com' ;
const port = parseInt(process.env.FalconServerPort);




//
//  Client facing request routing
// 
app.get('/json', servePortal);

//app.get('/json', userFetchCollections);
//app.get('/article', userFetchArticle) ;
//app.get('/notes/:userID/:documentID', userFetchArticleNotes) ;
//app.get('/tags', userFetchTags) ;

//app.post('/notes/upload',userUploadArticleNote) ;
app.post('/', servePostPing);
//app.post('/removeArtciles', userRemoveArticles) ;
//app.get('/crawl',userRequestCrawl) ;
//app.get('/readeren',userRequestRender) ;
//app.get('/saveItLater', userRequestSaveItLater) ;

//app.post('/admin/registerPlugin', adminRegisterPlugin) ;
//app.post('/admin/UnregisterPlugin', adminUnregisterPlugin) ;

//app.get('/admin/console', adminConsole) ;

/*
app.get('/fruit/:userID/:documentID', function(req, res) {
  console.log(req.params.userID, req.params.documentID) ;
  let jsonResp = {
    "one":"good",
    "two":"man"
  };
  res.json(jsonResp) ;

});
*/

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});



async function servePortal(req, res){
    console.log('servePortal') ;
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
}

async function servePostPing(req, res){
  const name = process.env.NAME || 'World';
  console.log(req.body) ;
  let jsonResp = {
    "name":"alexszhang",
    "email":"alexszhang@gmail.com"
  } ;
  res.json(jsonResp);
}

