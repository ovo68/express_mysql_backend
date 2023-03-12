const query = require('./query')

function isEmpty(obj) {
    return obj === null || obj === "" || obj === undefined;
}

/**
 * 增加商品
 * @param goods #{ name, price, `desc`, typeId, img}
 */
function addGoods(goods) {
    // console.log(goods)
    let sqlStr = "insert into goods( name, price, `desc`, typeId, img) values(?,?,?,?,?)"
    return query(sqlStr, goods)
}

/**
 * 修改商品
 * @param good #{ name, price, `desc`, typeId, img,id }
 */
function updateGoods(good) {
    let sqlStr = "update goods set name=?, price=?, `desc`=?, typeId=?, img=? where id = ?"
    return query(sqlStr, good)
}


/**
 * 删除商品
 * @param params # {roleId}
 */
function deleteGoods(params) {
    let sqlStr = "delete from goods where id = ?"
    return query(sqlStr, params);
}

/**
 * 分页查询商品
 * @param params # {typeId,key,pageNo,pageSize}
 */
function queryGoodsWithPage(params) {
    // console.log(params)
    if (isEmpty(params.typeId) && isEmpty(params.key)) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        let sqlStr = "select * from goods limit ? ,?"
        return query(sqlStr, params)
    } else if (!isEmpty(params.typeId) && isEmpty(params.key)) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        let sqlStr = "select * from goods where typeId = ? limit ? ,?"
        return query(sqlStr, params)
    } else if (isEmpty(params.typeId) && !isEmpty(params.key)) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from goods where name like ? limit ? ,?"
        return query(sqlStr, params)
    } else { // 全都不为空
        params.pageNo = (params.pageNo - 1) * params.pageSize
        let sqlStr = "select * from goods where typeId = ? and name like ? limit ? ,?"
        return query(sqlStr, params)
    }
}

/**
 * 获取商品数量
 * @param params
 * @returns {Promise<unknown>}
 */
function totalGoodsCount(params) {
    // console.log(params.key)
    if (!isEmpty(params.key) && isEmpty(params.typeId)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countGoods` from goods where name like ? or `desc` like ?"
        // console.log(params.key)
        return query(sqlStr, {k1: params.key, k2: params.key})
    } else if (isEmpty(params.key) && !isEmpty(params.typeId)) {
        let sqlStr = "select count(1) as `countGoods` from goods where typeId= ?"
        // console.log(params.key)
        return query(sqlStr, params)
    } else if (!isEmpty(params.key) && !isEmpty(params.typeId)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countGoods` from goods where typeId = ? and (name like ? or `desc` like ?)"
        let p = {typeId: params.typeId, k1: params.key, k2: params.key}
        // console.log('p',p)
        return query(sqlStr, p)
    }
    let sqlStr = "select count(1) as `countGoods` from goods"
    return query(sqlStr, params)

}


/**
 * 根据商品名称查询
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function queryGoodsByName(params) {
    let sqlStr = "select * from goods where name = ?"
    return query(sqlStr, params)
}

function queryGoodsByTypeId(params) {
    let sqlStr = "select * from goods where typeId = ?"
    return query(sqlStr, params)
}


module.exports = {
    queryGoodsWithPage,
    totalGoodsCount,
    addGoods,
    queryGoodsByName,
    deleteGoods,
    updateGoods,
    queryGoodsByTypeId
}






