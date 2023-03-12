const express = require('express')
const {getTokenInfo} = require("../utils/token");
const {getOrderNextId, addOrder, totalOrderCount, queryOrderWithPage} = require("../db/mysql/orders");
const {addOrderDetail, queryOrderDetail} = require("../db/mysql/ordersDetail");
const router = express.Router()

router.post('/add', (req, res) => {
    const {token} = req.headers
    getTokenInfo(token)
        .then(data => {
            // console.log(data)
            let us = data.data.name
            let amount = req.body.reduce((prev, curr) => prev + curr.totalPrice, 0)
            getOrderNextId({})
                .then(result => {
                    let id = result[0].nextId
                    // console.log({id, us, amount})
                    addOrder({id, us, amount})
                        .then(data => {
                            let batchArr = req.body.map(d => {
                                d.orderId = id
                                return d
                            }).map(o => Object.values(o))
                            // console.log(batchArr)
                            addOrderDetail([batchArr])
                                .then(data => {
                                    res.send({code: 200, msg: '创建成功'})
                                })
                        })
                        .catch(e => {
                            res.send({code: 500, msg: '创建失败'})
                        })
                })
                .catch(e => {
                    res.send({code: 500, msg: '创建失败'})
                })
        })
        .catch(e => {
            res.send({code: 500, msg: '创建失败'})
        })


})


router.post('/page', (req, res) => {
    const pageNo = Number(req.body.pageNo) || 1
    const pageSize = Number(req.body.pageSize) || 10
    console.log(pageNo,pageSize)
    totalOrderCount({})
        .then(result => {
            console.log("totalOrderCount", result)
            queryOrderWithPage({pageNo, pageSize})
                .then((data) => {
                    console.log(data)
                    res.send({
                        code: 200,
                        data: data,
                        total: result[0].countOrder,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        msg: "订单列表获取成功",
                    });
                }).catch(() => {
                res.send({code: 500, msg: "订单列表获取失败"});
            });
        }).catch(() => {
        res.send({code: 500, msg: "订单列表获取失败"});
    });

})

router.post('/detail', (req, res) => {
    const {id} = req.body
    queryOrderDetail({id})
        .then((data) => {
            res.send({
                code: 200,
                data: data,
                msg: "订单详情获取成功",
            });
        }).catch(() => {
        res.send({code: 500, msg: "订单详情获取失败"});
    });

})


module.exports = router