let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//数据库模型
let Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/resource');

mongoose.connection.on('connected', () => {
  console.log('连接成功')
});
mongoose.connection.on('error', () => {
  console.log('连接失败')
});
mongoose.connection.on('disconnected', () => {
  console.log('连接断开')
});
//查询商品列表
router.get('/', (req, res, next) => {
  // res.send('hello,goods list')
  //排序 升序：1 降序： -1
  let sort = parseInt(req.query['sort']);
  //当前第几页
  let page = parseInt(req.query['page']);
  //总页数
  let pageSize = parseInt(req.query['pageSize']);
  //跳过几条
  let skip = (page - 1) * pageSize;
  //添加过滤
  let priceLevel = req.query['priceLevel'];
  //参数
  let params = {};
  //根据价格过滤
  let salePrice = {};
  let priceGt = '', priceLte = '';
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        break;
    }
    if (priceGt !== "") {
      salePrice.$gt = priceGt;
    }
    if (priceLte !== "") {
      salePrice.$lte = priceLte;
    }
    params = {salePrice};
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});
//加入到购物车
router.post("/addCart", function (req, res, next) {
  console.dir(req.body.productId)
  let userId = '100000077';
  let productId = req.body.productId;
  let User = require('../models/user');
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
        let goodsItem = '';
        //遍历购物车商品
        userDoc.cartList.forEach(function (item) {
          //如果存在，数量加1
          if (item.productId === productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        //如果存在该商品
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: 1,
                msg: err2.message
              })
            } else {
              res.json({
                status: 0,
                msg: '商品数量累加',
                result: '成功'
              })
            }
          })
        } else {
          //如果购物车中不存在该商品
          //在商品列表中查到该商品
          Goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                status: 1,
                msg: err1.message
              })
            } else {
              //如果查到该商品
              if (doc) {
                doc.productNum = 1;
                doc.checked = true;
                console.log(doc)
                //往购物车中加入该商品
                userDoc.cartList.push(doc);
                //保存到数据库
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: 1,
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: '商品添加',
                      result: '成功'
                    })
                  }
                })
              }
            }
          },true);
        }
      }
    }
  })
});
module.exports = router;
