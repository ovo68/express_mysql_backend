const query = require('./query')


/**
 * 增加角色
 */
function addRole(role) {
    let sqlStr = "insert into roles(roleName,roleDesc) values(?,?)"
    return query(sqlStr, role)
}

/**
 * 修改角色
 * @param role # {roleId,roleName,roleDesc}
 */
function updateRole(role) {
    let sqlStr = "update roles set roleName = ?,roleDesc = ? where id = ?"
    return query(sqlStr, role)
}

/**
 * 角色权限分配
 * @param params # {roleId,permitIds}
 */
function updateRolePermit(params) {

    let sqlStr = "update roles set authIds=? where id = ?"
    return query(sqlStr, params)
}

/**
 * 删除角色
 * @param params # {roleId}
 */
function deleteRole(params) {
    let sqlStr = "delete from roles where id = ?"
    return query(sqlStr, params);
}

/**
 * 分页查询角色
 * @param params # {key,pageNo,pageSize}
 */
function queryRolesWithPage(params) {
    if (params.key !== null && params.key !== '' && params.key !== undefined) {
        params.pageNo = (params.pageNo - 1) * params.pageSize
        params.key = "%" + params.key + "%"
        let sqlStr = "select * from roles where roleName like ? limit ? ,?"
        return query(sqlStr, params)
    }
    if (params.key === null || params.key === '' || params.key === undefined){
        delete params.key
    }
    params.pageNo = (params.pageNo - 1) * params.pageSize
    // console.log(typeof params.pageNo)
    // console.log(params.pageSize)
    let sqlStr = "select * from roles limit ? ,?"
    return query(sqlStr, params)
}

// queryRolesWithPage({key:'', pageNo:1, pageSize:5}).then(res=>{
//   console.log(res)
// }).catch(err=>{
//   console.log(err)
// })

/**
 * 根据用户id查询角色
 * @param params
 * @returns {Promise<unknown>}
 */
function queryRoleByUserId(params) {
    let sqlStr = "select * from roles where id = ?"
    return query(sqlStr, params)
}


/**
 * 根据角色名字查询角色
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function queryRoleByName(params) {
    let sqlStr = "select * from roles where roleName = ?"
    return query(sqlStr, params)
}


/**
 * 查询数据总个数
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function totalRoleCount(params) {
    // console.log(params.key)
    if (params.key !== null && params.key !== '' && params.key !== undefined) {
        params.key = "%" + params.key + "%"
        let sqlStr = "select count(1) as `countRole` from roles where roleName like ?"
        // console.log(params.key)
        return query(sqlStr, params)
    }
    let sqlStr = "select count(1) as `countRole` from roles"
    return query(sqlStr, params)

}

// totalRoleCount({key:"测试"}).then(res=>{
//   console.log(res)
// })

module.exports = {
    queryRoleByUserId,
    queryRolesWithPage,
    totalRoleCount,
    queryRoleByName,
    addRole,
    deleteRole,
    updateRole,
    updateRolePermit
}



