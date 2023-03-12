const express = require('express')
const router = express.Router()

const {
    queryGoodsWithPage,
    totalGoodsCount,
    queryGoodsByName,
    addGoods,
    deleteGoods,
    updateGoods
} = require('../db/mysql/goods')
const {queryAllGoodtype} = require('../db/mysql/goodstypes')

/**
 * @api {post} /good/add 商品添加
 * @apiName 商品添加
 * @apiGroup Good
 *
 * @apiParam {String} name 名称
 * @apiParam {String} price 价格
 * @apiParam {String} desc 描述
 * @apiParam {Number} type_id 分类id
 * @apiParam {String} img 图片
 */
router.post('/add', (req, res) => {
    const {name, price, desc, typeId, img} = req.body
    queryGoodsByName({name})
        .then((data) => {
            if (data.length === 0) {
                addGoods({name, price, desc, typeId, img})
                    .then(() => {
                        res.send({code: 200, msg: '添加成功'})
                    })
                    .catch(() => {
                        res.send({code: 500, msg: '添加失败'})
                    })
            } else {
                res.send({code: 500, msg: '商品已存在'})
            }
        })

})

/**
 * @api {post} /good/del 删除
 * @apiName 删除
 * @apiGroup Good
 *
 * @apiParam {Number} _id id
 */
router.post('/del', (req, res) => {
    const {id} = req.body
    deleteGoods({id})
        .then((data) => {
            res.send({code: 200, msg: '删除成功'})
        })
        .catch(() => {
            res.send({code: 500, msg: '删除失败'})
        })
})

/**
 * @api {post} /good/update 商品修改
 * @apiName 商品修改
 * @apiGroup Good
 *
 * @apiParam {String} _id id
 * @apiParam {String} name 名称
 * @apiParam {Number} price 价格
 * @apiParam {String} desc 描述
 * @apiParam {Number} typeId 分类id
 * @apiParam {String} img 图片
 */
router.post('/update', (req, res) => {
    const {id, name, price, desc, typeId, img} = req.body
    updateGoods({name, price, desc, typeId, img, id})
        .then(() => {
            res.send({code: 200, msg: '修改成功'})
        })
        .catch(() => {
            res.send({code: 500, msg: '修改失败'})
        })
})

/**
 * @api {post} /good/page 商品列表
 * @apiName 商品列表
 * @apiGroup Good
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} typeId 分类id
 * @apiParam {Number} key 关键字查询
 */
router.post('/page', (req, res) => {
    const pageNo = Number(req.body.pageNo) || 1
    const pageSize = Number(req.body.pageSize) || 10
    const {typeId} = req.body
    const {key} = req.body

    totalGoodsCount({key, typeId})
        .then(result => {
            // console.log("totalGoodsCount", result)
            queryGoodsWithPage({typeId, key, pageNo, pageSize})
                .then((data) => {
                    // console.log("data", data)
                    queryAllGoodtype({})
                        .then(goodtypes => {
                            // console.log(goodtypes)
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < goodtypes.length; j++) {
                                    if (data[i].typeId === goodtypes[j].id) {
                                        data[i].goodtypes = goodtypes[j]
                                        break
                                    }
                                }
                            }
                            // console.log(data)
                            res.send({
                                code: 200,
                                data: data,
                                total: result[0].countGoods,
                                pageNo: pageNo,
                                pageSize: pageSize,
                                msg: "商品列表获取成功",
                            });
                        }).catch(() => {
                        res.send({code: 500, msg: "商品列表获取失败"});
                    });
                }).catch(() => {
                res.send({code: 500, msg: "商品列表获取失败"});
            });
        }).catch(() => {
        res.send({code: 500, msg: "商品列表获取失败"});
    });
})

module.exports = router
