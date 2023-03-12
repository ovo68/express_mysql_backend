const query = require('./query')


/**
 * 增加商品类型
 * @param goodstype # {name}
 */
function addGoodstype(goodstype) {
    let sqlStr = "insert into goodstypes(name,createTime) values(?,?)"
    return query(sqlStr, goodstype)
}

/**
 * 修改商品类型
 * @param goodstype # {name,id}
 */
function updateGoodstype(goodstype) {
    let sqlStr = "update goodstypes set name = ? where id = ?"
    return query(sqlStr, goodstype)
}

/**
 * 删除商品类型
 * @param params # { id }
 */
function deleteGoodstype(params) {
    let sqlStr = "delete from goodstypes where id = ?"
    return query(sqlStr, params);
}

/**
 * 分页查询商品类型
 * @param params # {typeId,key,pageNo,pageSize}
 */
function queryGoodTypesWithPage(params) {
    // console.log(params)
    if (!isEmpty(params.key)) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from goodstypes where name like ? limit ? ,?"
        return query(sqlStr, params)
    }
    params.pageNo = (params.pageNo - 1) * params.pageSize
    let sqlStr = "select * from goodstypes limit ? ,?"
    return query(sqlStr, params)
}

function queryGoodtypeById(params) {
    let sqlStr = "select * from goodstypes where id = ?"
    return query(sqlStr, params)
}

function queryAllGoodtype(params) {
    let sqlStr = "select * from goodstypes"
    return query(sqlStr, params)
}

function isEmpty(obj) {
    return obj === null || obj === "" || obj === undefined;
}

function totalGoodstypesCount(params) {
    // console.log(params.key)
    if (!isEmpty(params.key)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countGoodstype` from goodstypes where name like ?"
        // console.log(params.key)
        return query(sqlStr, params)
    }
    let sqlStr = "select count(1) as `countGoodstype` from goodstypes"
    return query(sqlStr, params)

}

function queryGoodstypeByName(params) {
    let sqlStr = "select * from goodstypes where name = ?"
    // console.log(params.key)
    return query(sqlStr, params)
    
}


module.exports = {
    queryGoodtypeById,
    queryAllGoodtype,
    queryGoodTypesWithPage,
    totalGoodstypesCount,
    deleteGoodstype,
    addGoodstype,
    updateGoodstype,
    queryGoodstypeByName
}



