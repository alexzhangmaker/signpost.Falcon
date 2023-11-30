var fs = require('fs');
const Queue = require('bee-queue');
const cron = require('node-cron');
const logger=require('./log.js') ;
const scrapeDB=require('./portfolioDataMan.js') ;

  

  //logger.info('hello', { message: 'world' });
  //logger.log('error', 'hello', { message: 'world' });
  //_log('index.js','server started') ;

logger.log(`batchDBJobs','process started`) ;


//https://www.warp.dev/terminus/how-to-run-cron-every-hour
//cron.schedule('0 * * * *', batch_UpdateHolding);
cron.schedule('*/5 * * * *', batch_UpdateHolding);
//run every hour

//scrapeDB.dbUpdateSingleHolding() ;


const upateHoldingQueue = new Queue('dbUpdateSingleHolding');

function batch_UpdateHolding(){
  let cPortfolioFile='./public/json/portfolio.json' ;
  let cPortfolioData = fs.readFileSync(cPortfolioFile) ;
  let jsonPortfolio = JSON.parse(cPortfolioData) ;
  let tcikers=[] ;
  for(let i=0;i<jsonPortfolio.accounts.length;i++){
    for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
      if(tcikers.includes(jsonPortfolio.accounts[i].holdings[j].ticker)!=true){
        tcikers.push(jsonPortfolio.accounts[i].holdings[j].ticker) ;
      }
    }      
  }

  for(i=0;i<tcikers.length;i++){
    let cTime = new Date() ;
    let jsonJobData = {
      ticker:tcikers[i],
      cDate:cTime.toLocaleTimeString()
    } ;
    const job = upateHoldingQueue.createJob(jsonJobData);
    job.timeout(10000)
        .retries(3)
        .save()
        .then((job) => {
        // job enqueued, job.id populated
        console.log(`job queued:${job.id}, ${JSON.stringify(job.data.ticker)}`) ;
    });

    job.on('progress', (progress) => {
        console.log(
          `Job ${job.id} reported progress: page ${progress.page} / ${progress.totalPages}`
        );
    });

    job.on('succeeded', (result) => {
      console.log(`Job ${job.id} succeeded with result: ${result}`);
    });

    job.on('failed', (err) => {
      console.log(`Job ${job.id} failed with error ${err.message}`);
    });
  }
}



/*
for(let i=0;i<10000;i++){
    let cTime = new Date() ;
    let jsonJobData = {
        x:i,
        y:i,
        cDate:cTime.toLocaleTimeString()
    } ;
    const job = addQueue.createJob(jsonJobData);
    job.timeout(3000)
        .retries(2)
        .save()
        .then((job) => {
        // job enqueued, job.id populated
        console.log(`job queued:${job.id}, ${JSON.stringify(job.data.cDate)}`) ;
    });

    job.on('progress', (progress) => {
        console.log(
          `Job ${job.id} reported progress: page ${progress.page} / ${progress.totalPages}`
        );
    });
}
*/
