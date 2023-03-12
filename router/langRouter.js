const express = require("express");
const router = express.Router();
const {
    queryLangsWithPage,
    totalLangCount,
    queryLangByKey,
    addLang,
    deleteLang,
    updateLang, deleteAllLangs
} = require("../db/mysql/langs");
const {dlXlsx, dlJs, dlZip} = require("../utils/exportXlsx.js");


/**
 * @api {post} /lang/add 多语言单个添加
 * @apiName 多语言添加
 * @apiGroup Lang
 *
 * @apiParam {String} key 变量名
 * @apiParam {String} zh-CN 中文
 * @apiParam {String} notice 解释中文
 * @apiParam {String} en-US 英语
 * @apiParam {String} vi-VN 越南语
 * @apiParam {String} th-TH 泰语
 * @apiParam {String} en-IN 印度语
 */
router.post("/add", (req, res) => {
    const query = req.body;
    delete query.isTrusted
    let key = query.key
    console.log(query)
    queryLangByKey({key})
        .then((data) => {
            console.log(data)
            if (data.length === 0) {
                addLang(query)
                    .then(() => {
                        res.send({code: 200, msg: "添加成功"});
                    })
                    .catch(() => {
                        res.send({code: 500, msg: "添加失败"});
                    });
            } else {
                res.send({code: 500, msg: "该变量名已存在"});
            }
        })
});

/**
 * @api {post} /lang/del 删除
 * @apiName 删除
 * @apiGroup Lang
 *
 * @apiParam {Number} _id id
 */
router.post("/del", (req, res) => {
    const {id} = req.body;

    deleteLang({id})
        .then((data) => {
            res.send({code: 200, msg: "删除成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "删除失败"});
        });
});

/**
 * @api {post} /lang/delAll 删除全部
 * @apiName 删除全部
 * @apiGroup Lang
 *
 */
router.post("/delAll", (req, res) => {
    deleteAllLangs({})
        .then((data) => {
            res.send({code: 200, msg: "删除成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "删除失败"});
        });
});

/**
 * @api {post} /lang/update 修改
 * @apiName 修改
 * @apiGroup Lang
 *
 * @apiParam {String} _id id
 * @apiParam {String} key 变量名
 * @apiParam {String} zh-CN 中文
 * @apiParam {String} notice 解释中文
 * @apiParam {String} en-US 英语
 * @apiParam {String} vi-VN 越南语
 * @apiParam {String} th-TH 泰语
 * @apiParam {String} en-IN 印度语
 */
router.post("/update", (req, res) => {
    const query = req.body;
    let l = {
        key: query.key,
        "zh-CN": query["zh-CN"],
        notice: query.notice,
        "en-US": query["en-US"],
        "vi-VN": query["vi-VN"],
        "th-TH": query["th-TH"],
        "en-IN": query["en-IN"],
        "id": query["id"],
    }
    updateLang(l)
        .then((data) => {
            res.send({code: 200, msg: "修改成功"});
        })
        .catch(() => {
            res.send({code: 500, msg: "修改失败"});
        });
});

/**
 * @api {post} /lang/page 查询
 * @apiName 查询
 * @apiGroup Lang
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.post("/page", (req, res) => {
    const pageNo = Number(req.body.pageNo);
    const pageSize = Number(req.body.pageSize);
    const {key} = req.body;

    totalLangCount({key})
        .then(result => {
            // console.log(result)
            queryLangsWithPage({key, pageNo, pageSize})
                .then(data => {
                    // console.log(data)
                    res.send({
                        code: 200,
                        data: data,
                        total: result[0].countLang,
                        pageNo: pageNo,
                        pageSize: pageSize,
                        msg: "语言列表获取成功",
                    });
                })
                .catch(() => {
                    res.send({code: 500, msg: "语言分类列表获取失败"});
                });
        })
});

/**
 * @api {post} /lang/export 导出excel
 * @apiName 导出excel
 * @apiGroup Lang
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.get("/export", (req, res) => {
    const pageNo = Number(req.query.pageNo);
    const pageSize = Number(req.query.pageSize);
    const {key} = req.query;


    queryLangsWithPage({key, pageNo, pageSize})
        .then(data => {
            dlXlsx(data)
                .then((data) => {
                    res.download("多语言文件.xlsx");
                })
                .catch((err) => {
                    res.send({code: 500, msg: err});
                });

        })
        .catch((err) => {
            res.send({code: 500, msg: err});
        });
});

/**
 * @api {post} /lang/export/js 导出js文件
 * @apiName 导出js文件 TODO 待修改
 * @apiGroup Lang
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} key 关键字查询
 */
router.get("/export/js", (req, res) => {
    const pageNo = Number(req.query.pageNo);
    const pageSize = Number(req.query.pageSize);
    const {key} = req.query;

    queryLangsWithPage({key, pageNo, pageSize})
        .then((data) => {
            const _data = data;
            let zhObj = {},
                noticeObj = {},
                enObj = {},
                viObj = {},
                thObj = {},
                inObj = {};
            _data.map((item) => {
                zhObj[item.key] = item["zh-CN"];
                noticeObj[item.key] = item["notice"];
                enObj[item.key] = item["en-US"];
                viObj[item.key] = item["vi-VN"];
                thObj[item.key] = item["th-TH"];
                inObj[item.key] = item["en-IN"];
            });
            dlJs("zh-CN", zhObj)
                .then((data) => {
                    dlJs("notice", noticeObj);
                })
                .then((data) => {
                    dlJs("en-US", enObj);
                })
                .then((data) => {
                    dlJs("vi-VN", viObj);
                })
                .then((data) => {
                    dlJs("th-TH", thObj);
                })
                .then((data) => {
                    dlJs("en-IN", inObj);
                })
                .then((data) => {
                    dlZip();
                })
                .then((data) => {
                    setTimeout(function () {
                        res.download("多语言文件.zip");
                    }, 200);
                })
                .catch((err) => {
                    console.log(err);
                    res.send("err");
                });
        })
        .catch((err) => {
            res.send({code: 500, msg: err});
        });
});

module.exports = router;
