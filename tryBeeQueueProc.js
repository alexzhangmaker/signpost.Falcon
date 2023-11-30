const Queue = require('bee-queue');
const redis = require('redis');


const addQueue = new Queue('addition');
/*
for(let i=0;i<10;i++){
    const job = addQueue.createJob({x: i, y: i});
    job.timeout(3000)
      .retries(2)
      .save()
      .then((job) => {
        // job enqueued, job.id populated
      });
}
*/



async function jobFunc(job){
    //console.log(`jobFunc:${job.id}, ${JSON.stringify(job)}`) ;

    // do some work
    job.reportProgress({page: 3, totalPages: 11});
    // do more work
    console.log(`Processing job ${job.id}:${job.data.x} ---${job.data.y}`);

    job.reportProgress({page: 9, totalPages: 11});
    // do the rest
    return job.data.x + job.data.y;
}


addQueue.process(jobFunc);

addQueue.on('stalled', (jobId) => {
    console.log(`Job ${jobId} stalled and will be reprocessed`);
});
addQueue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message}`);
});
addQueue.on('retrying', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message} but is being retried!`);
});

addQueue.on('succeeded', (job, result) => {
    console.log(`Job ${job.id} succeeded with result: ${result}`);
});

addQueue.on('error', (err) => {
    console.log(`A queue error happened: ${err.message}`);
});

addQueue.on('ready', () => {
    console.log('queue now ready to start doing things');
});