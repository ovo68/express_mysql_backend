const db = require('../connect')

module.exports = function query(sql, params) {
    // console.log(params instanceof Array, params)
    let paramsArr = null
    if (!(params instanceof Array)) {
        // console.log("不是数组...", params)
        paramsArr = Object.values(params).filter(value => !isEmpty(value))
    } else {
        paramsArr = params
    }
    return new Promise(function (resolve, reject) {
        db.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, paramsArr, function (err, rows, fields) {
                    //释放连接
                    conn.release();
                    //传递Promise回调对象
                    // console.log(rows)
                    // let permit = rows[0]
                    // console.log(typeof permit)
                    resolve(rows);
                });
            }
        });
    });
};

function isEmpty(obj) {
    return obj === null || obj === "" || obj === undefined;
}

// 可以用于增 删 改 查
// function query(sql, params) {
//   let data
//   let paramsArr = Object.values(params)
//   return new Promise((resolve, reject) => {
//     if (err) {
//       reject(err);
//     } else {
//       db.query(sql, paramsArr, (err, rows, fields) => {
//         db.release();
//         //传递Promise回调对象
//         resolve({
//           "err": err,
//           "rows": rows,
//           "fields": fields
//         });
//       })
//     }
//   });
//
// }
//
// // ['ceshi@ceshi.com','ceshi']
// // query(sqlStr, {us: 'ceshi@ceshi.com', ps: 'ceshi'})
// // console.log(db)
// module.exports = query
