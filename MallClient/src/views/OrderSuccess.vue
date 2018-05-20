<template>
  <div>
    <!--导航头部-->
    <nav-header ref="navHeader"></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span>订单完成</span>
    </nav-bread>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>订单查看</span></h2>
      </div>
      <!-- 交易步骤-->
      <check-step :step="stepNum"></check-step>
      <div class="order-create">
        <div class="order-create-pic icon" v-if="order">&#xe630;</div>
        <div class="order-create-pic icon error" v-else>&#xe6b9;</div>
        <div class="order-create-main">
          <h3 v-if="order">祝贺你！<br>您的订单正在处理中！</h3>
          <h3 v-else>暂无该订单，请重新提交信息！</h3>
          <p v-if="order">
            <span>订单号：{{order.orderId}}</span>
            <span>交易总金额：{{order.orderTotal | fomatPrice('￥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">回到购物车</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">浏览商品</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--导航尾部-->
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .order-create-pic {
    font-size: 10em;
    line-height: 1em;
    text-align: center;
    color: #174405;
  }
  .order-create-pic.error{
    color: #F00;
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
        stepNum: 4,
        orderId: this.$route.query.orderId,
        userId: Fun.getCookie("userId"),
        order: null
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
      this.getOrder();
    },
    methods: {
      getOrder() {
        if (this.userId && this.orderId) {
          axios.post('/api/users/getOrder', {
            userId: this.userId,
            orderId: this.orderId
          }).then(res => {
            let result = res.data;
            if (!result.status) {
              this.order = result.result;
            }
          })
        }
      }
    }
  }
</script>
