var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwdMd5": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [{
    "productImage": String,
    "salePrice": Number,
    "productName": String,
    "productId": String,
    "productNum": Number,
    "checked": Boolean
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": String,
    "isDefault": Boolean
  }]
});
module.exports = mongoose.model('user', userSchema, 'dumall-users');
