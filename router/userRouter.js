const express = require("express");
const router = express.Router();
const User = require("../db/model/userModel");
const Mail = require("../utils/mail");
const {setToken, getTokenInfo} = require("../utils/token");

const {
    queryUserByUsPs,
    totalUserCount,
    queryUsersWithPage,
    queryUserByName,
    addUser,
    deleteUser, updateUserRole, updateUserState, register, updatePS
} = require('../db/mysql/users')

// 内存中存入验证码
let codes = {};

/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
 * @apiGroup User
 *
 * @apiParam {String} us 用户名（邮箱）
 * @apiParam {String} ps 用户密码
 * @apiParam {code} ps 验证码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "msg": "创建成功"
 *     }
 */
router.post("/reg", (req, res) => {
    let {us, ps, code} = req.body;
    if (!us || !ps) return res.send({code: 500, msg: "缺少参数"});
    // if (!codes[us] || codes[us].code != code) // TODO 验证码 待修改

    queryUserByName({us})
        .then((data) => {
            if (data.length === 0) {
                const time = new Date();
                register({us, ps, time})
                    .then(() => {
                        res.send({code: 200, msg: "创建成功"});
                    })
                    .catch(() => {
                        res.send({code: 500, msg: "创建失败"});
                    });
            } else {
                res.send({code: 500, msg: "用户名已存在"});
            }
        })

});

/**
 * @api {post} /user/add 用户添加
 * @apiName 用户添加
 * @apiGroup User
 *
 * @apiParam {String} us 用户名
 * @apiParam {String} ps 用户密码
 * @apiParam {String} roleId 角色
 * @apiParam {Number} age 年龄
 * @apiParam {Boolean} state 是否启用
 * @apiParam {Number} sex 性别 0-男 1-女
 */
router.post("/add", (req, res) => {
    let {us, ps, age, state, sex} = req.body;
    if (!us || !ps) return res.send({code: 500, msg: "缺少参数"});
    queryUserByName({us})
        .then((data) => {
            if (data.length === 0) {
                const time = new Date();
                addUser({us, ps, time, age, state, sex})
                    .then(() => {
                        res.send({code: 200, msg: "创建成功"});
                    })
                    .catch(() => {
                        res.send({code: 500, msg: "创建失败"});
                    });
            } else {
                res.send({code: 500, msg: "用户名已存在"});
            }
        })


});

/**
 * @api {post} /user/update 用户编辑
 * @apiName 用户编辑
 * @apiGroup User
 *
 * @apiParam {String} id id
 * @apiParam {String} us 用户名
 * @apiParam {String} roleId 角色
 * @apiParam {Number} age 年龄
 * @apiParam {Boolean} state 是否启用
 * @apiParam {Number} sex 性别 0-男 1-女
 */
router.post("/update", (req, res) => {
    let {id, us, age, state, sex} = req.body;
    if (!id || !us) return res.send({code: 500, msg: "缺少参数"});
    User.updateOne({id}, {us, age, state, sex})
        .then(() => {
            res.send({code: 200, msg: "创建成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "创建失败"});
        });
});

/**
 * @api {post} /user/updateState 用户账号状态修改
 * @apiName 用户账号状态修改
 * @apiGroup User
 *
 * @apiParam {String} id 用户id
 * @apiParam {String} state 状态 0-禁用 1-启用
 */
router.post("/updateState", (req, res) => {
    let {id, state} = req.body;
    if (!id || (state !== true && state !== false))
        return res.send({code: 500, msg: "缺少参数"});
    updateUserState({state, id})
        .then(() => {
            res.send({code: 200, msg: "修改成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "修改失败"});
        });
});

/**
 * @api {post} /user/updateps 用户修改密码
 * @apiName 用户修改密码
 * @apiGroup User
 *
 * @apiParam {String} oldPs 旧密码
 * @apiParam {String} newPs 新密码
 */
router.post("/updateps", (req, res) => {
    let {oldPs, newPs} = req.body;
    if (!oldPs || !newPs) return res.send({code: 500, msg: "缺少参数"});
    getTokenInfo(req.headers.token)
        .then((data) => {
            updatePS({us: data.data.name, ps: newPs})
                .then(() => {
                    res.send({code: 200, msg: "修改成功"});
                })
                .catch(() => {
                    res.send({code: 500, msg: "修改失败"});
                });
        })

});

/**
 * @api {post} /user/updateRole 用户分配角色
 * @apiName 用户分配角色
 * @apiGroup User
 *
 * @apiParam {String} id 用户id
 * @apiParam {String} roleId 角色id
 */
router.post("/updateRole", (req, res) => {
    let {id, roleId} = req.body;
    if (!id || !roleId) return res.send({code: 500, msg: "缺少参数"});
    updateUserRole({roleId, id})
        .then(() => {
            res.send({code: 200, msg: "修改成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "修改失败"});
        });
});

/**
 * @api {post} /user/del 用户删除
 * @apiName 用户删除
 * @apiGroup User
 *
 * @apiParam {Number} _id id
 */
router.post("/del", (req, res) => {
    const {id} = req.body;

    deleteUser({id})
        .then((data) => {
            res.send({code: 200, msg: "删除成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "删除失败"});
        });
});

/**
 * @api {post} /user/login 用户登录
 * @apiName 用户登录
 * @apiGroup User
 *
 * @apiParam {String} us 用户名（邮箱）
 * @apiParam {String} ps 用户密码
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "msg": "登录成功"
 *     }
 */
router.post("/login", (req, res) => {
    let {us, ps} = req.body;
    console.log(us)
    console.log(ps)
    if (!us || !ps) return res.send({code: 500, msg: "缺少参数"});

    queryUserByUsPs({us, ps})
        .then((data) => {
            // console.log(data)
            // console.log(data.length)
            if (data.length > 0) {
                if (!data[0].state) return res.send({code: 502, msg: "账号已被禁用"});
                let token = setToken({login: true, name: us, roleId: data[0].roleId});
                res.send({code: 200, msg: "登录成功", token});
            } else {
                res.send({code: 500, msg: "账号或密码不正确"});
            }
        })
        .catch((e) => {
            console.log(e)
            res.send({code: 500, msg: "登录失败"});
        });
});

/**
 * @api {post} /user/page 用户列表
 * @apiName 用户列表
 * @apiGroup User
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.post("/page", (req, res) => {
    const pageNo = Number(req.body.pageNo) || 1;
    const pageSize = Number(req.body.pageSize) || 10;

    const {key} = req.body;

    totalUserCount({key})
        .then(result => {
            console.log(result)
            queryUsersWithPage({key, pageNo, pageSize})
                .then(data => {
                    data.forEach(d => delete d.ps)
                    res.send({
                        code: 200,
                        data: data,
                        total: result[0].countUser,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        msg: "用户列表获取成功",
                    });
                })
                .catch(e => {
                    res.send({code: 500, msg: "用户列表获取失败"});
                })
        })
        .catch(e => {
            res.send({code: 500, msg: "用户列表获取失败"});
        })

});

/**
 * @api {post} /user/getMailCode 获取邮箱验证码
 * @apiName 获取邮箱验证码  TODO 需要修改
 * @apiGroup User
 *
 * @apiParam {String} mail 用户名（邮箱）
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "msg": "邮箱验证码发送成功"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "code": "500",
 *       "msg": "邮箱验证码发送失败"
 *     }
 */
router.post("/getMailCode", (req, res) => {
    const {mail} = req.body;
    // 判断五分钟内不能重复发送
    // if (codes[mail] && (((new Date()).getTime() - codes[mail].ctime) < 300000) ) return res.send({ code: 500, msg: '验证码5分钟内，不可重复发送' })
    // 判断五分钟内不能超过3次
    if (
        codes[mail] &&
        new Date().getTime() - codes[mail].ctime < 300000 &&
        codes[mail].ctime + 1 > 3
    )
        return res.send({code: 500, msg: "验证码5分钟内，发送次数不可大于3次"});
    const code = parseInt(Math.random() * 10000);
    Mail.send(mail, code)
        .then(() => {
            // 判断五分钟内不能重复发送
            // codes[mail] = {ctime: (new Date()).getTime(), code: code}
            // 判断五分钟内不能超过3次
            if ((codes[mail] && codes[mail].account >= 3) || !codes[mail]) {
                codes[mail] = {ctime: new Date().getTime(), code: code, account: 1};
            } else {
                // codes[mail] && (codes[mail].account < 3)
                codes[mail] = {
                    ctime: codes[mail].ctime,
                    code: code,
                    account: codes[mail].account++,
                };
            }
            console.log("存下", codes[mail]);
            // codes[mail] = {ctime: (new Date()).getTime(), code: code, account: ((codes[mail] && (codes[mail].account>3)) ? 0 : codes[mail].account++)}
            res.send({code: 200, msg: "邮箱验证码发送成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "邮箱验证码发送失败"});
        });
});

module.exports = router;
