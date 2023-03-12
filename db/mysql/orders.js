const query = require('./query')


function getOrderNextId(params) {
    let sqlStr = "SELECT IFNULL(MAX(id),0)+1 as nextId FROM orders"

    return query(sqlStr, params)
}


function addOrder(params) {
    let sqlStr = "insert into orders(id,us,amount) values(?,?,?)"
    return query(sqlStr, params)
}

function totalOrderCount(params) {
    let sqlStr = "select count(1) as `countOrder` from orders"
    return query(sqlStr, params)
}

function queryOrderWithPage(params) {
    params.pageNo = (params.pageNo - 1) * params.pageSize
    let sqlStr = "select * from orders limit ? ,?"
    return query(sqlStr, params)
}


module.exports = {getOrderNextId, addOrder, totalOrderCount, queryOrderWithPage}