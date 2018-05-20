<template>
  <div class="goods-list">
    <!--导航头部-->
    <nav-header ref="navHeader"></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span>商品</span>
    </nav-bread>
    <!--商品列表-->
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <!--选择排序方式-->
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="price cur" :class="!sortFlag ? 'sort-up': '' " @click="sortGoods">价格<i
            class="icon icon-arrow-short">&#xe610;</i></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">筛选</a>
        </div>
        <!--结果页-->
        <div class="accessory-result">
          <!-- 价格筛选 -->
          <div class="filter stopPop" :class="{'filterby-show':filterBy}" id="filter">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceCheck==='all'}" @click="setPriceFilter('all')">全部</a>
              </dd>
              <dd v-for="(item,index) in priceFilter">
                <a href="javascript:void(0)" :class="{'cur':priceCheck===index}" @click="setPriceFilter(index)">{{item.priceEnd
                  ? (item.priceStart + '元 - ' + item.priceEnd+'元') : (item.priceStart + '元以上')}}</a>
              </dd>
            </dl>
          </div>
          <!-- 搜索结果展示列表 -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy">
              <ul>
                <!--商品-->
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="javascript:;"><img v-lazy="'static/products/'+item.productImage"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-if="loadingShow">
                <img src="@/assets/loading-svg/loading-spinning-bubbles.svg">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!--未登录加入购物车-->
    <modal :md-show="isLogin" @close="isLogin = !isLogin">
      <p slot="message" class="no-login">请[<a href="javascript:;" class="denglu-btn" @click="login">登录</a>]，否则无法加入到购物车
      </p>
      <div slot="btn-group">
        <a href="javascript:;" class="btn btn--m" @click="isLogin = !isLogin">关闭</a>
      </div>
    </modal>
    <!--登录加入购物车成功-->
    <modal :md-show="addSuccess" md-title="提示" @close="addSuccess = !addSuccess">
      <p slot="message" class="add-success">
        <span class="icon">&#xe744;</span><span class="text">加入成功</span>
      </p>
      <div slot="btn-group">
        <a href="javascript:;" class="btn" @click="addSuccess = !addSuccess">继续购物</a>
        <router-link to="/cart" class="btn">查看购物车</router-link>
      </div>
    </modal>
    <!--导航尾部-->
    <nav-footer></nav-footer>
  </div>
</template>
<style scoped>
  p.no-login {
    height: 100%;
    line-height: 4em;
    text-align: center;
    font-size: 16px;
  }

  p.no-login .denglu-btn {
    color: #f90;
  }

  p.add-success {
    line-height: 60px;
    font-size: 0;
    text-align: center;
  }

  p.add-success .icon {
    font-size: 16px;
    color: #40e20b;
  }

  p.add-success .text {
    padding-left: 20px;
    font-size: 16px;
    color: #000;
  }
</style>
<script>
  import NavHeader from "@/components/NavHeader"
  import NavFooter from "@/components/NavFooter"
  import NavBread from "@/components/NavBread"
  import Modal from "@/components/Modal"
  import axios from "axios"
  import {Fun} from "@/util/Fun"

  export default {
    data() {
      return {
        userId: '100000077',
        goodsList: [],
        sortFlag: true,
        loadingShow: false,
        isLogin: false,
        addSuccess: false,
        page: 1,
        pageSize: 8,
        busy: false,
        priceFilter: [{
          priceStart: 100,
          priceEnd: 400
        }, {
          priceStart: 400,
          priceEnd: 800
        }, {
          priceStart: 800,
          priceEnd: 1200
        }, {
          priceStart: 1200
        }],
        priceCheck: "all",
        filterBy: false,
        overLayFlag: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    created() {
      this.getGoodsList(false);
    },
    methods: {
      login() {
        this.isLogin = false;
        this.$refs.navHeader.loginModalFlag = true;
      },
      getGoodsList(flag) {
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceCheck
        };
        this.loadingShow = true;
        axios.get('/api/goods', {
          params: param
        }).then((res) => {
          this.loadingShow = false;
          if (res.data.status === 0) {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list);
              if (res.data.result.count === 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.data.result.list;
              this.busy = false;
            }
          }
        })
      },
      //排序
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      //加载更多
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      //小的视口，显示价格筛选
      showFilter() {
        this.filterBy = true
        this.overLayFlag = true
      },
      //关闭遮罩层
      closePop() {
        this.filterBy = false
        this.overLayFlag = false
      },
      //选择筛选项
      setPriceFilter(option) {
        this.priceCheck = option;
        this.closePop();
        this.page = 1;
        this.getGoodsList();
      },
      //加入购物车
      addCart(productId) {
        let userId = Fun.getCookie("userId");
        if (userId === this.userId) {
          axios.post("/api/goods/addCart", {productId: productId}).then((res) => {
            if (!res.data.status) {
              this.addSuccess = true;
            }
          })
        } else {
          this.isLogin = true;
        }
      }
    }
  }
</script>

