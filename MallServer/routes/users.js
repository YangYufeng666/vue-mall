let express = require('express');
let router = express.Router();
require('./../Util/Fun');
let User = require('./../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('用户测试api');
});
//用户登录
router.post('/login', function (req, res, next) {
    let params = {
        userName: req.body.userName,
        userPwdMd5: req.body.userPwd
    };
    User.findOne(params, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            });
        } else {
            if (doc && params.userPwdMd5 === doc.userPwdMd5) {
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie('nickName', doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                // req.session.user = doc;
                res.json({
                    status: 0,
                    msg: '登录成功',
                    result: {
                        nickName: doc.userName
                    }
                })
            } else {
                res.json({
                    status: 1,
                    msg: '登录失败',
                    result: {
                        errMsg: '该账户不存在或密码错误'
                    }
                })
            }
        }
    })
});
//用户退出
router.post('/logout', function (req, res, next) {
    //清除cookie
    res.cookie('userId', "", {
        path: '/',
        maxAge: -1
    });
    res.cookie('nickName', "", {
        path: '/',
        maxAge: -1
    });
    res.json({
        status: 0,
        msg: '退出成功',
        result: {}
    })
});
//用户的购物车列表
router.get('/cartList', function (req, res, next) {
    let userId = req.query.userId;
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message,
                result: '获取用户购物车列表失败'
            })
        } else {
            if (doc) {
                res.json({
                    status: 0,
                    msg: '获取用户购物车列表成功',
                    result: doc.cartList
                })
            }
        }
    });
});
//购物车商品删除
router.post('/cart/delCartItem', (req, res, next) => {
    let userId = req.body.userId;
    let productId = req.body.productId;
    User.update({userId}, {
        $pull: {
            cartList: {
                productId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '删除失败',
                result: ''
            })
        } else {
            res.json({
                status: 0,
                msg: '删除成功',
                result: ''
            })
        }
    });
});
//购物车商品修改
router.post('/cart/editCartItem', (req, res, next) => {
    let data = {};
    let userId = req.body.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;
    if (productNum !== undefined) {
        data["cartList.$.productNum"] = productNum;
    }
    if (checked !== undefined) {
        data["cartList.$.checked"] = checked;
    }
    User.update({userId, "cartList.productId": productId}, data, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '修改失败',
                result: ''
            })
        } else {
            res.json({
                status: 0,
                msg: '修改成功',
                result: ''
            })
        }
    });
});
//购物车商品全选
router.post('/cart/checkedAll', (req, res, next) => {
    let userId = req.body.userId;
    let checkedAll = req.body.checkedAll;
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '修改失败',
                result: ''
            })
        } else {
            if (doc) {
                doc.cartList.forEach((item) => {
                    item.checked = checkedAll;
                });
                doc.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: 1,
                            msg: '修改失败',
                            result: ''
                        })
                    } else {
                        res.json({
                            status: 0,
                            msg: '修改成功',
                            result: ''
                        })
                    }
                });
            }
        }
    });
});
//用户地址查询
router.post('/cart/adressList', (req, res, next) => {
    let userId = req.body.userId;
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '查询失败',
                result: []
            })
        } else {
            if (doc) {
                res.json({
                    status: 0,
                    msg: '查询成功',
                    result: doc.addressList
                })
            }
        }
    });
});
//设置默认地址
router.post('/cart/setDefault', (req, res, next) => {
    let userId = req.body.userId;
    let adressId = req.body.adressId;
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '设置失败',
                result: []
            })
        } else {
            if (doc) {
                let adressList = doc.addressList;
                adressList.forEach((adress) => {
                    if (adress.addressId === adressId) {
                        adress.isDefault = true;
                    } else {
                        adress.isDefault = false;
                    }
                });
                doc.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: 1,
                            msg: '设置失败',
                            result: ''
                        })
                    } else {
                        res.json({
                            status: 0,
                            msg: '设置成功',
                            result: ''
                        })
                    }
                });
            }
        }
    });
});
//删除地址
router.post('/cart/delAdress', (req, res, next) => {
    let userId = req.body.userId;
    let adressId = req.body.adressId;
    User.update({userId}, {
        $pull: {
            addressList: {
                addressId: adressId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '删除失败',
                result: ''
            })
        } else {
            res.json({
                status: 0,
                msg: '删除成功',
                result: ''
            })
        }
    });
});
//支付
router.post('/payMent', (req, res, next) => {
    let userId = req.body.userId;
    let orderTotal = req.body.orderTotal;
    let adressId = req.body.adressId;
    let delCartItem = () => {
        User.update({userId}, {
            $pull: {
                cartList: {
                    checked: true
                }
            }
        }, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
    };
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: '',
                result: []
            })
        } else {
            if (doc) {
                let adressList = doc.addressList;
                let cartList = doc.cartList;
                let orderAdress = {};
                let goodsList = [];
                //获取用户的地址信息
                adressList.forEach((adress) => {
                    if (adress.addressId === adressId) {
                        orderAdress = adress;
                    }
                });
                //添加购物车商品信息到订单
                cartList.filter(item => {
                    if (item.checked) {
                        goodsList.push(item);
                    }
                });
                //用户的购物车删除商品
                delCartItem();
                //平台码
                let platForm = '622';
                let rad1 = Math.floor(Math.random() * 10);
                let rad2 = Math.floor(Math.random() * 10);
                //创建订单
                let order = {
                    orderId: platForm + rad1 + (+new Date()) + rad2,
                    orderTotal,
                    adressInfo: orderAdress,
                    goodsList,
                    orderStatus: true,
                    createDate: new Date().Format("yyyy-MM-dd hh:mm:ss")
                };
                doc.orderList.push(order);
                doc.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: 1,
                            msg: '',
                            result: ''
                        })
                    } else {
                        res.json({
                            status: 0,
                            msg: '',
                            result: {
                                orderTotal: order.orderTotal,
                                orderId: order.orderId
                            }
                        })
                    }
                });
            }
        }
    });
});
//订单详情查询
router.post('/getOrder', function (req, res, next) {
    let userId = req.body.userId;
    let orderId = req.body.orderId;
    User.findOne({userId}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message,
                result: '获取订单详情失败'
            })
        } else {
            if (doc) {
                let orderList = doc.orderList;
                let idRES = false;
                orderList.forEach(order => {
                    if (order.orderId === orderId) {
                        idRES = true;
                        res.json({
                            status: 0,
                            msg: '获取订单详情成功',
                            result: order
                        })
                    }
                });
                if (!idRES) {
                    res.json({
                        status: 1,
                        msg: '暂无该订单',
                        result: {}
                    })
                }
            }
        }
    });
});
//添加收货地址
router.post("/addAdress", function (req, res, next) {
    let userId = req.body.userId;
    let data = req.body.data;
    //在用户集中查找
    User.findOne({userId: userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            //通过userId查找数据
            if (userDoc) {
                let adress = '';
                //地址id是否重复
                let idRep = false;
                userDoc.addressList.forEach((item) => {
                    //id是否重复
                    if (item.addressId === data.addressId) {
                        idRep = true;
                    }
                });
                //如果不重复
                if (!idRep) {
                    userDoc.addressList.push(data);
                    userDoc.save((err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: 1,
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: 0,
                                msg: '地址添加',
                                result: '成功'
                            })
                        }
                    })
                } else {
                    //如果重复
                    res.json({
                        status: 0,
                        msg: '改地址已存在',
                        result: '失败'
                    })
                }
            }
        }
    })
});
module.exports = router;
