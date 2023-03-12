const query = require('./query')


/**
 * 增加权限
 * @param permit # {name, fid,id, path, level, mark, sort}
 */
function addPermit(permit) {
  let sqlStr = "insert into permits(name, fid, path, level, mark, sort) values(?,?,?,?,?,?)"
  return query(sqlStr, permit)
}

/**
 * 修改权限
 * @param permit # { name, fid, path, level, mark, sort, id }
 */
function updatePermit(permit) {
  let sqlStr = "update permits set name = ?,fid = ?,path = ?,level = ?,mark = ? ,sort = ? where id = ?"
  return query(sqlStr, permit)
}

/**
 * 删除权限
 * @param params # {permitId}
 */
function deletePermit(params) {
  let sqlStr = "delete from permits where id = ?"
  return query(sqlStr, params);
}

/**
 * 分页查询权限
 * @param params{pageNo,pageSize}
 */
function queryUsersWithPage(params) {
  params.pageNo = (params.pageNo - 1) * params.pageSize
  let sqlStr = "select * from permits limit ? ,?"
  return query(sqlStr, params)

}

/**
 * 权限列表，用于分配权限的列表，父级需要包含子级 TODO 在路由中进行处理
 */
function permitList() {
  return query("select * from permits", {})
}


function queryPermitByName(params) {
  let sqlStr = "select * from permits where name = ?"
  return query(sqlStr, params)

}


module.exports = {permitList,updatePermit,queryPermitByName,addPermit,deletePermit}






