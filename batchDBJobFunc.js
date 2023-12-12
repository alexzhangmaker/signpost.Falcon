const Queue = require('bee-queue');
const redis = require('redis');
const logger=require('./log.js') ;
const portfolioDB=require('./portfolioDataMan.js') ;
const scraper=require('./scrapeYahoo.js') ;

scraper.initBrowser() ;

const upateHoldingQueue = new Queue('dbUpdateSingleHolding');


async function jobDBFunc(job){
    //console.log(`jobFunc:${job.id}, ${JSON.stringify(job)}`) ;
    //portfolioDB.dbUpdateSingleHolding(job.data.ticker) ;
    let jsonQuote = await scraper.fetchQuoteYahoo(job.data.ticker) ;

    console.log(JSON.stringify(jsonQuote,null,3)) ;
    if(jsonQuote.retCode == 200){
        portfolioDB.dbUpdateHoldingQuote(job.data.ticker,jsonQuote.Quote) ;
    }else{
        logger.log('jobDBFunc',`${job.data.ticker}:jsonQuote.retCode`) ;
    }

    /*
    // do some work
    job.reportProgress({page: 3, totalPages: 11});
    // do more work
    console.log(`Processing job ${job.id}:${job.data.x} ---${job.data.y}`);

    job.reportProgress({page: 9, totalPages: 11});
    // do the rest
    */
    return job.data.ticker;// + job.data.y;
}


upateHoldingQueue.process(jobDBFunc);

upateHoldingQueue.on('stalled', (jobId) => {
    console.log(`Job ${jobId} stalled and will be reprocessed`);
});

upateHoldingQueue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message}`);
});

upateHoldingQueue.on('retrying', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message} but is being retried!`);
});

upateHoldingQueue.on('succeeded', (job, result) => {
    console.log(`Job ${job.id} succeeded with result: ${result}`);
});

upateHoldingQueue.on('error', (err) => {
    console.log(`A queue error happened: ${err.message}`);
});

upateHoldingQueue.on('ready', () => {
    console.log('queue now ready to start doing things');
});