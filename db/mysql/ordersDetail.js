const query = require('./query')


function addOrderDetail(params) {
    let sqlStr = 'insert into orders_detail(goodsName,goodsNumber,goodsPrice,totalPrice,orderId) values ?'
    return query(sqlStr, params)
}

function queryOrderDetail(params) {
    let sqlStr = "select * from orders_detail where orderId = ?"
    return query(sqlStr, params)
}


module.exports = {addOrderDetail,queryOrderDetail}