const express = require("express");
const router = express.Router();
const {getTokenInfo} = require("../utils/token");
const {queryRoleByUserId} = require("../db/mysql/roles");
const {
    permitList,
    updatePermit,
    queryPermitByName,
    addPermit,
    deletePermit,
    queryChildPermit
} = require("../db/mysql/permits");

/**
 * @api {post} /permit/add 权限添加
 * @apiName 权限添加
 * @apiGroup Permit
 *
 * @apiParam {String} name 权限名
 * @apiParam {Number} fid 权限父级
 * @apiParam {String} path 权限路径
 * @apiParam {Number} sort 排序
 * @apiParam {Number} level 权限层级（ 0-一级菜单 1-二级菜单 2-操作 ）
 * @apiParam {String} mark 权限标识（描述）
 */
router.post("/add", (req, res) => {
    console.log("req.body", req.body);
    let {name, fid, path, level, mark, sort} = req.body;
    if (!name || !fid.toString() || !path || !level.toString())
        return res.send({code: 500, msg: "缺少参数"});
    queryPermitByName({name})
        .then((data) => {
            if (data.length === 0) {
                addPermit({name, fid, path, level, mark, sort})
                    .then(() => {
                        res.send({code: 200, msg: "创建成功"});
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send({code: 500, msg: "创建失败"});
                    });
            } else {
                res.send({code: 500, msg: "权限名已存在"});
            }
        })
});

/**
 * @api {post} /permit/update 权限修改
 * @apiName 权限修改
 * @apiGroup Permit
 *
 * @apiParam {String} id id
 * @apiParam {String} name 权限名
 * @apiParam {Number} fid 权限父级
 * @apiParam {String} path 权限路径
 * @apiParam {Number} sort 排序
 * @apiParam {Number} level 权限层级（ 0-一级菜单 1-二级菜单 2-操作 ）
 * @apiParam {String} mark 权限标识（描述）
 */
router.post("/update", (req, res) => {
    let {id, name, fid, path, level, mark, sort} = req.body;
    updatePermit({name, fid, path, level, mark, sort, id})
        .then(() => {
            res.send({code: 200, msg: "修改成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "修改失败"});
        });
});

/**
 * @api {post} /permit/del 权限删除
 * @apiName 权限删除
 * @apiGroup Permit
 *
 * @apiParam {Number} _id id
 */
router.post("/del", (req, res) => {
    const {id} = req.body
    queryChildPermit({id}).then(data => {
        if (data.length === 0) {
            deletePermit({id})
                .then((data) => {
                    res.send({code: 200, msg: "删除成功"});
                })
                .catch(() => {
                    res.send({code: 500, msg: "删除失败"});
                });
        } else {
            res.send({code: 500, msg: "存在子级权限，无法删除"});
        }
    })

});

/**
 * @api {post} /permit/page 权限列表
 * @apiName 权限列表
 * @apiGroup Permit
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.post("/page", (req, res) => {
    const pageNo = Number(req.body.pageNo) || 1;
    const pageSize = Number(req.body.pageSize) || 10;

    const {key} = req.body;


});

/**
 * @api {post} /permit/list 全部权限列表(用于分配权限的列表)
 * @apiName 全部权限列表(用于分配权限的列表)
 * @apiGroup Permit
 *
 */
router.post("/list", (req, res) => {
    permitList()
        .then((permissions) => {
            let rootPermissionsResult = [];
            // 处理一级菜单
            for (idx in permissions) {
                permission = permissions[idx];

                if (permission.level == 0) {
                    rootPermissionsResult[permission.id] = {
                        id: permission.id,
                        name: permission.name,
                        fid: permission.fid,
                        path: permission.path,
                        level: permission.level,
                        mark: permission.mark,
                        sort: permission.sort,
                        _showChildren: true,
                        children: [],
                    };
                }
            }

            // 处理二级菜单
            for (idx in permissions) {
                let permission = permissions[idx];
                if (permission.level === 1) {
                    let parentPermissionResult = rootPermissionsResult[permission.fid];
                    if (parentPermissionResult) {
                        parentPermissionResult.children.push({
                            id: permission.id,
                            name: permission.name,
                            fid: permission.fid,
                            path: permission.path,
                            level: permission.level,
                            mark: permission.mark,
                            sort: permission.sort,
                            _showChildren: true,
                            children: [],
                        });
                    }
                }
            }

            rootPermissionsResult = rootPermissionsResult.filter((item) => item);
            // 排序
            rootPermissionsResult.sort((a, b) => a.sort - b.sort);
            for (let i = 0; i < rootPermissionsResult.length; i++) {
                if (
                    rootPermissionsResult[i].children &&
                    rootPermissionsResult[i].children.length
                ) {
                    rootPermissionsResult[i].children.sort((a, b) => a.sort - b.sort);
                }
            }

            res.send({
                code: 200,
                data: rootPermissionsResult,
                msg: "权限列表获取成功",
            });
        })
        .catch((err) => {
            console.log(err);
            res.send({code: 500, msg: "权限列表获取失败"});
        });
});

/**
 * @api {post} /permit/menus 用户权限列表(用户拥有的权限列表)
 * @apiName 用户权限列表(用户拥有的权限列表)
 * @apiGroup Permit
 *
 */
router.post("/menus", (req, res) => {
    const {token} = req.headers;
    let authIds = "";
    getTokenInfo(token)
        .then((data) => {
            if (data.code === 200) {
                return queryRoleByUserId({roleId: data.data.roleId});
            } else {
                res.send({code: 500, msg: "权限列表获取失败"});
            }
        })
        .then((data) => {
            // console.log(data)
            authIds = data[0].authIds.split(",");
            // return Permit.find();
            return permitList();
        })
        .then((list) => {
            const permissions = [];
            list.map((item) => {
                if (authIds.includes(item.id.toString())) {
                    permissions.push(item);
                }
            });
            let rootPermissionsResult = [];
            // 处理一级菜单
            for (idx in permissions) {
                permission = permissions[idx];

                if (permission.level == 0) {
                    rootPermissionsResult[permission.id] = {
                        id: permission.id,
                        name: permission.name,
                        fid: permission.fid,
                        path: permission.path,
                        level: permission.level,
                        mark: permission.mark,
                        sort: permission.sort,
                        _showChildren: true,
                        children: [],
                    };
                }
            }

            // 处理二级菜单
            for (idx in permissions) {
                permission = permissions[idx];
                if (permission.level === 1) {
                    parentPermissionResult = rootPermissionsResult[permission.fid];
                    if (parentPermissionResult) {
                        parentPermissionResult.children.push({
                            id: permission.id,
                            name: permission.name,
                            fid: permission.fid,
                            path: permission.path,
                            level: permission.level,
                            mark: permission.mark,
                            sort: permission.sort,
                            _showChildren: true,
                            children: [],
                        });
                    }
                }
            }

            rootPermissionsResult = rootPermissionsResult.filter((item) => item);
            // 排序
            rootPermissionsResult.sort((a, b) => a.sort - b.sort);
            for (let i = 0; i < rootPermissionsResult.length; i++) {
                if (
                    rootPermissionsResult[i].children &&
                    rootPermissionsResult[i].children.length
                ) {
                    rootPermissionsResult[i].children.sort((a, b) => a.sort - b.sort);
                }
            }
            res.send({
                code: 200,
                data: rootPermissionsResult,
                msg: "权限列表获取成功",
            });
        })
        .catch((err) => {
            console.log(err);
            res.send({code: 500, msg: "权限列表获取失败"});
        });
});

module.exports = router;
