const query = require('./query')

function isEmpty(obj) {
    return obj === null || obj === "" || obj === undefined;
}

function queryUserByUsPs(params) {
    let sqlStr = "select * from users where us = ? and ps = ?"
    return query(sqlStr, params)
}

// queryUserByUsPs({us:"ceshi@ceshi.com",ps:"ceshi"}).then(r=>{
//   console.log(r)
// })

/**
 * 注册
 * @param params # {us,ps,time}
 */
function register(params) {
    let sqlStr = "insert into users(us,ps,time) values(?,?,?)"
    return query(sqlStr, params)
}


/**
 * 添加用户
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function addUser(params) {
    console.log(params)
    let sqlStr = "insert into users(us, ps, `time`,age, state, sex) values(?,?,?,?,?,?)"
    return query(sqlStr, params)
}

// 根据id删除用户


/**
 * 更新用户
 * @param user
 */
function updateUser(user) {
    let sqlStr = "update users set us=?, age=?, state=?, sex=? where id = ?"
    return query(sqlStr, user)
}

/**
 * 更新用户状态
 * @param params {state,id}
 */
function updateUserState(params) {
    let sqlStr = "update users set state = ? where id = ?"
    return query(sqlStr, params)
}

/**
 * 更新密码
 * @param params #{ps,us}
 */
function updatePS(params) {
    let sqlStr = "update users set ps = ? where us = ?"
    return query(sqlStr, params)
}

/**
 * 为用户分配角色
 * @param params
 */
function updateUserRole(params) {
    let sqlStr = "update users set roleId=? where id = ?"
    return query(sqlStr, params)
}

/**
 * 根据用户账号（名）查询用户
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function queryUserByName(params) {
    params.us = "%" + params.us + "%"
    let sqlStr = "select * from users where us like ?"
    return query(sqlStr, params)
}

/**
 * 删除用户
 * @param params {id}
 */
function deleteUser(params) {
    let sqlStr = "delete from users where id = ?"
    return query(sqlStr, params);
}

/**
 * 分页查询用户
 * @param params # {pageNo,pageSize}
 */
function queryUsersWithPage(params) {
    params.pageNo = (params.pageNo - 1) * params.pageSize
    if (!isEmpty(params.key)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from users where us like ? limit ? ,?"
        return query(sqlStr, params)
    }
    let sqlStr = "select * from users limit ? ,?"
    return query(sqlStr, params)
}

function totalUserCount(params) {
    if (!isEmpty(params.key)) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countUser` from users where us like ?"
        // console.log(params.key)
        return query(sqlStr, params)
    }
    let sqlStr = "select count(1) as `countUser` from users"
    return query(sqlStr, params)

}


module.exports = {
    queryUserByUsPs,
    totalUserCount,
    queryUsersWithPage,
    queryUserByName,
    addUser,
    deleteUser,
    updateUserRole,
    updateUserState,
    register,
    updatePS
}




