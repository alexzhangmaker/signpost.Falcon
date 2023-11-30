
const winston = require('winston');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: './public/log/error.log', level: 'error' }),
      new winston.transports.File({ filename: './public/log/combined.log' }),
    ],
  });
  
  function _log(title,cMessage){
    let cDate = new Date() ;
    let cLogMessage=`${cDate.toLocaleString()}:${cMessage}` ;
    logger.info(title, { message: cLogMessage });
  }

  exports.log = _log;
