const query = require('../db/mysql/query')

function getCounter(counter_name) {
  return new Promise(function (resolve, reject) {
    let sqlStr = "select seq+1 as seq from counters where counter_name=?"
    query(sqlStr, {counter_name}).then(res => {
      // console.log(res[0].nextSeq)
      sqlStr = "update counters set seq=? where counter_name=?"
      let seq = res[0].seq
      query(sqlStr, {seq, counter_name}).then(res2 => {
        resolve(res[0].seq)
      })
    })


    // Counter.findByIdAndUpdate(
    //   { _id: name },
    //   { $inc: { seq: 1 } },
    //   { new: true, upsert: true },
    //   function (error, counter) {
    //     if (error) {
    //       reject(error)
    //     } else {
    //       console.log('counter.seq', counter.seq)
    //       resolve(counter.seq)
    //     }
    //   }
    // )
  })
}

// getCounter('permit').then(res => {
//   console.log(res)
// })

module.exports = {getCounter}
