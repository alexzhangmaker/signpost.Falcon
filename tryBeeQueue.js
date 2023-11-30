const Queue = require('bee-queue');
const redis = require('redis');
/*
// producer queues running on the web server
const sharedConfig = {
  getEvents: false,
  isWorker: false,
  redis: redis.createClient(process.env.REDIS_URL),
};

const emailQueue = new Queue('EMAIL_DELIVERY', sharedConfig);
const facebookUpdateQueue = new Queue('FACEBOOK_UPDATE', sharedConfig);

emailQueue.createJob({});
facebookUpdateQueue.createJob({});
*/

const addQueue = new Queue('addition');

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


/*
addQueue.process(jobFunc);

async function jobFunc(job){
    console.log(`Processing job ${job.id}:${job.data.x} ---${job.data.y}`);
    return job.data.x + job.data.y;
}
*/