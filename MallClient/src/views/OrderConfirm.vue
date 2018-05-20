<template>
  <div>
    <!--导航头部-->
    <nav-header ref="navHeader"></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span>确认订单</span>
    </nav-bread>
    <div class="container">
      <div class="checkout-order">
        <!-- 交易步骤-->
        <check-step :step="stepNum"></check-step>
        <!-- 订单商品列表 -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单详情</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>订单内容</li>
                <li>价格</li>
                <li>数量</li>
                <li>小计</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in orderGoodsList">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="'/static/products/'+ item.productImage" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | fomatPrice('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">{{item.productNum}}</span>
                      </div>
                    </div>
                    <div v-if="false" class="item-stock item-stock-no">有货</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(Number(item.salePrice)*Number(item.productNum)) | fomatPrice('￥')}}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 价格详情 -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>商品总价:</span>
                <span>{{productsPrice | fomatPrice('￥')}}</span>
              </li>
              <li>
                <span>运费:</span>
                <span>{{freight | fomatPrice('￥')}}</span>
              </li>
              <li>
                <span>优惠:</span>
                <span>{{discount | fomatPrice('￥')}}</span>
              </li>
              <li>
                <span>税收:</span>
                <span>{{taxRevenue | fomatPrice('￥')}}</span>
              </li>
              <li class="order-total-price">
                <span>订单总金额:</span>
                <span>{{totalPrice | fomatPrice('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <a class="btn btn--m" href="javascript:;" @click="$router.back()">上一步</a>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="payMent()">确认支付</button>
          </div>
        </div>
      </div>
    </div>
    <!--导航尾部-->
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .item-quantity {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
<script>
  import NavHeader from "@/components/NavHeader"
  import NavFooter from "@/components/NavFooter"
  import NavBread from "@/components/NavBread"
  import Modal from "@/components/Modal"
  import CheckStep from "@/components/CheckStep"
  import axios from "axios"
  import {Fun} from "@/util/Fun"

  export default {
    data() {
      return {
        stepNum: 2,
        userId: Fun.getCookie('userId'),
        orderGoodsList: [],
        //商品总价
        productsPrice: 0,
        //运费
        freight: 0,
        //优惠
        discount: 0,
        //适用税率
        rata: 0.0005,
        //税收
        taxRevenue: 0,
        //订单总金额
        totalPrice: 0
      }
    },
    filters: {
      fomatPrice: Fun.currency
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal,
      CheckStep
    },
    created() {
      this.getOrderGoods();
    },
    methods: {
      //获取订单详情
      getOrderGoods() {
        if (this.userId) {
          axios.get('/api/users/cartList', {
            params: {
              userId: this.userId
            }
          }).then((res) => {
            let list = res.data.result;
            list.forEach(item => {
              if (item.checked) {
                this.orderGoodsList.push(item)
              }
            });
            this.calOrderPrice();
          })
        }
      },
      calOrderPrice() {
        if (this.orderGoodsList) {
          this.orderGoodsList.forEach(item => {
            this.productsPrice += Number(item.salePrice) * Number(item.productNum);
          });
          this.taxRevenue = this.productsPrice * this.rata;
          this.totalPrice = this.productsPrice + this.freight - this.discount + this.taxRevenue;
        }
      },
      //支付（跳过三方支付环节）
      payMent() {
        axios.post('/api/users/payMent', {
          userId: this.userId,
          orderTotal: this.totalPrice,
          adressId: this.$route.query.adressId
        }).then(res => {
          let result = res.data;
          if (!result.status) {
            //查看订单页
            this.$router.push(`/orderSuccess?orderId=${result.result.orderId}`);
          }
        })
      }
    }
  }
</script>
