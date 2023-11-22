const cron = require('node-cron');
var fs = require('fs');
const cronLogDB = require('better-sqlite3')('./public/SQLiteDB/demoDB.db', { verbose: console.log });

// Schedule tasks to be run on the server.

cron.schedule('*/2 * * * *', _cronTask_2);

cron.schedule('*/5 * * * *', _cronTask_5);

cron.schedule('1 6 * * *', _cronTask_At6);

//cron.schedule('*/30 * * * *', _cronTask_Hourly);


function _cronTask_5(){
  console.log('running a task every 5 minute');
  let cDate = new Date() ;
  let jsonLog = {
      "date":cDate.toLocaleTimeString(),
      "memo":'running a task every 5 minute'
  } ;

  //INSERT INTO cronLogs (cDate,cMemo) VALUES ("2023/11/22-1", "hello SQLite-1")
  const stmt = cronLogDB.prepare('INSERT INTO cronLogs (cDate, cMemo) VALUES (@date, @memo)');
  stmt.run({
    date: jsonLog.date,
    memo: jsonLog.memo
  });
  //console.log(row.firstName, row.lastName, row.email);

  /*
  let cJSONFileData = fs.readFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json') ;
  let jsonLogs = JSON.parse(cJSONFileData) ;
  jsonLogs.logs.push(jsonLog) ;
  console.log(JSON.stringify(jsonLog,null,3)) ;
  fs.writeFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json',JSON.stringify(jsonLogs,null,3)) ;
  */
}

function _cronTask_2(){
  console.log('running a task every 2 minute');
  let cDate = new Date() ;
  let jsonLog = {
      "log":cDate.toLocaleTimeString(),
      "memo":'running a task every 2 minute'
  } ;

  let cJSONFileData = fs.readFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json') ;
  let jsonLogs = JSON.parse(cJSONFileData) ;
  jsonLogs.logs.push(jsonLog) ;
  console.log(JSON.stringify(jsonLog,null,3)) ;
  fs.writeFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json',JSON.stringify(jsonLogs,null,3)) ;
}


function _cronTask_At6(){
  console.log('running a task every 2 minute');
  let cDate = new Date() ;
  let jsonLog = {
      "log":cDate.toLocaleTimeString(),
      "memo":'running a task at 6:01'
  } ;

  let cJSONFileData = fs.readFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json') ;
  let jsonLogs = JSON.parse(cJSONFileData) ;
  jsonLogs.logs.push(jsonLog) ;
  console.log(JSON.stringify(jsonLog,null,3)) ;
  fs.writeFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json',JSON.stringify(jsonLogs,null,3)) ;
}


function _cronTask_Hourly(){
  console.log('running a task every 2 minute');
  let cDate = new Date() ;
  let jsonLog = {
      "log":cDate.toLocaleTimeString(),
      "memo":'running a task every hour'
  } ;

  let cJSONFileData = fs.readFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json') ;
  let jsonLogs = JSON.parse(cJSONFileData) ;
  jsonLogs.logs.push(jsonLog) ;
  console.log(JSON.stringify(jsonLog,null,3)) ;
  fs.writeFileSync('/Users/zhangqing/meWork/githubPage/signpost.Falcon/cronLog.json',JSON.stringify(jsonLogs,null,3)) ;
}


//_cronTask_5() ;