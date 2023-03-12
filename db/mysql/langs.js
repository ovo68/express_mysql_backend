const query = require('./query')

function isEmpty(obj) {
    return obj === null || obj === "" || obj === undefined;
}

/**
 * 增加语言
 * @param lang {langName,langDesc}
 */
function addLang(lang) {
    let sqlStr = "INSERT INTO `langs` ( `key`, `zh-CN`, `notice`, `en-US`, `vi-VN`, `th-TH`, `en-IN` ) VALUES(?, ?, ?, ?, ?, ?, ? );"
    return query(sqlStr, lang)
}

/**
 * 修改语言
 * @param lang # {langId,langName,langDesc}
 */
function updateLang(lang) {
    let sqlStr = "UPDATE `langs` SET `key` = ?, `zh-CN`= ?, `notice`= ?, `en-US`= ?, `vi-VN`= ?, `th-TH`= ?, `en-IN`= ? WHERE `id` = ?"
    return query(sqlStr, lang)
}


/**
 * 删除语言
 * @param params # {id}
 */
function deleteLang(params) {
    let sqlStr = "delete from langs where id = ?"
    return query(sqlStr, params);
}

/**
 * 删除全部语言
 * @param params # {id}
 */
function deleteLangALl(params) {
    let sqlStr = "delete from langs"
    return query(sqlStr, params);
}

/**
 * 分页查询语言
 * @param params # {key,pageNo,pageSize}
 */
function queryLangsWithPage(params) {
    if (!isEmpty(params.key)) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from langs where `key` like ? or `zh-CN` like ? or notice like ? limit ? ,?"
        let p = {k1: params.key, k2: params.key, k3: params.key, pageNo: params.pageNo, pageSize: params.pageSize}
        return query(sqlStr, p)
    }
    params.pageNo = (params.pageNo - 1) * params.pageSize
    let sqlStr = "select * from langs limit ? ,?"
    return query(sqlStr, params)
}

function totalLangCount(params) {
    // console.log(params.key)
    if (!isEmpty(params.key)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countLang` from langs where `key` like ? or `zh-CN` like ? or notice like ?"
        let p = {k1: params.key, k2: params.key, k3: params.key}
        return query(sqlStr, p)
    }
    let sqlStr = "select count(1) as `countLang` from langs"
    return query(sqlStr, params)
}

function queryLangByKey(params) {
    // console.log(params)
    if (!isEmpty(params.key)) {
        let sqlStr = "select * from langs where `key` = ?"
        console.log(params)
        return query(sqlStr, params)
    }
    let sqlStr = "select * from langs"
    return query(sqlStr, params)
}

function queryLangByLikeKey(params) {
    console.log(params)
    if (!isEmpty(params.key)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from langs where `key` like ?"
        console.log(params)
        return query(sqlStr, params)
    }
    let sqlStr = "select * from langs"
    return query(sqlStr, params)
}

function deleteAllLangs(params) {
    let sqlStr = "delete from langs"
    return query(sqlStr, params)
}


module.exports = {queryLangsWithPage, totalLangCount, queryLangByKey, addLang, deleteLang, updateLang,deleteAllLangs}



