'use strict'

const that = { hello: 'world' }
const queue = require('fastq')(that, worker, 1)

queue.push(42, function (err, result) {
  if (err) { throw err }
  console.log(this)
  console.log('the result is', result)
}) ;

that.hello='cnx' ;
queue.push('very good', function (err, result) {
    if (err) { throw err }
    console.log(this)
    console.log('the result is', result)
  }) ;

function worker (arg, doneCallback) {
  //console.log(this) ;
  doneCallback(null, arg)
}