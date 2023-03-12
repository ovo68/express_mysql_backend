// const mongoose = require('mongoose');
// mongoose.connect('mongodb://121.5.69.157/expressdbs', {useNewUrlParser: true, useUnifiedTopology: true});
//
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('db ok')
// });

// 1. 导入 mysql 模块
const mysql = require('mysql')
// 2. 建立与 MySQL 数据库的连接关系
const db = mysql.createPool({
  host: '127.0.0.1', // 数据库的 IP 地址
  port:3306,
  user: 'root', // 登录数据库的账号
  password: 'rooter', // 登录数据库的密码
  database: 'expressdbs', // 指定要操作哪个数据库
})

// 测试 mysql 模块能否正常工作
// db.query('select 1', (err, results) => {
//   // mysql 模块工作期间报错了，就进入这个if判断语句，打印这个错误信息
//   if(err) return console.log(err.message)
//   // 只要能打印出 [ RowDataPacket { '1' : 1} ]的结果，就证明数据库连接正常
//   console.log(results)
// })

module.exports = db
