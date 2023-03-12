const express = require("express");
const router = express.Router();
const Food = require("../db/model/foodModel");
const FoodType = require("../db/model/foodTypeModel");
const {getCounter} = require("../utils/counter");
const {formatDateTime} = require("../utils/time");
const {
    totalGoodstypesCount, queryGoodTypesWithPage, deleteGoodstype, queryGoodstypeByName, updateGoodstype,
    addGoodstype
} = require("../db/mysql/goodstypes");
const {queryGoodsByTypeId} = require("../db/mysql/goods");

/**
 * @api {post} /foodType/add 商品分类添加
 * @apiName 商品分类添加
 * @apiGroup FoodType
 *
 * @apiParam {String} name 名称
 */
router.post("/add", (req, res) => {
    let {name} = req.body;
    if (!name) return res.send({code: 500, msg: "缺少参数"});
    queryGoodstypeByName({name})
        .then((data) => {
            if (data.length === 0) {
                const createTime = new Date();
                return addGoodstype({name, createTime});

            } else {
                res.send({code: 500, msg: "商品分类已存在"});
            }
        })
        .then(() => {
            res.send({code: 200, msg: "创建成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "创建失败"});
        });
});

/**
 * @api {post} /foodType/del 删除
 * @apiName 删除
 * @apiGroup FoodType
 *
 * @apiParam {Number} typeid 分类id
 */
router.post("/del", (req, res) => {
    const {id} = req.body;

    queryGoodsByTypeId({id})
        .then((data) => {
            if (data.length) {
                res.send({code: 500, msg: "删除失败，该分类正在被使用"});
            } else {
                return deleteGoodstype({id});
            }
        })
        .then(() => {
            res.send({code: 200, msg: "删除成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "删除失败"});
        });
});

/**
 * @api {post} /foodType/update 商品分类修改
 * @apiName 商品分类修改
 * @apiGroup FoodType
 *
 * @apiParam {String} typeid 分类id
 * @apiParam {String} name 名称
 */
router.post("/update", (req, res) => {
    const {id, name} = req.body;
    queryGoodstypeByName({name})
        .then((data) => {
            if (data.length === 0) {
                return updateGoodstype({name, id});
            } else {
                res.send({code: 500, msg: "名称已存在"});
            }
        })
        .then((e) => {
            console.log("e", e);
            res.send({code: 200, msg: "修改成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "修改失败"});
        });
});

/**
 * @api {post} /foodType/page 商品分类列表
 * @apiName 商品分类列表
 * @apiGroup FoodType
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.post("/page", (req, res) => {
    const pageNo = Number(req.body.pageNo) || 1;
    const pageSize = Number(req.body.pageSize) || 10;

    const {key} = req.body;
    totalGoodstypesCount({key})
        .then(result => {
            // console.log(result)
            queryGoodTypesWithPage({key, pageNo, pageSize})
                .then(data => {
                    // console.log(data)
                    res.send({
                        code: 200,
                        data: data,
                        total: result[0].countGoodstype,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        msg: "商品分类列表获取成功",
                    });
                })
                .catch(() => {
                    res.send({code: 500, msg: "商品分类列表获取失败"});
                });
        })


// const reg = new RegExp(key);
// let query = {};
// query = { $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] };
// FoodType.countDocuments(query, (err, count) => {
//   if (err) {
//     res.send({ code: 500, msg: "商品分类列表获取失败" });
//     return;
//   }
//   FoodType.find(query)
//     .skip(pageSize * (pageNo - 1))
//     .limit(pageSize)
//     .then((data) => {
//       const temp = [];
//       data.map((item) => {
//         temp.push({
//           typeid: item.typeid,
//           name: item.name,
//           createTime: formatDateTime(new Date(item.createTime)),
//         });
//       });
//       res.send({
//         code: 200,
//         data: temp,
//         total: count,
//         pageNo: pageNo,
//         pageSize: pageSize,
//         msg: "商品分类列表获取成功",
//       });
//     })
//     .catch(() => {
//       res.send({ code: 500, msg: "商品分类列表获取失败" });
//     });
// });
})
;

module.exports = router;
