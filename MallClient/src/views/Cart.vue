<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>购物车</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>我的购物车</span></h2>
        </div>
        <div v-if="cartList && cartList.length > 0">
          <div class="item-list-wrap">
            <div class="cart-item">
              <div class="cart-item-head">
                <ul>
                  <li>商品</li>
                  <li>单价</li>
                  <li>数量</li>
                  <li>总价</li>
                  <li>编辑</li>
                </ul>
              </div>
              <ul class="cart-item-list">
                <li v-for="cartItem in cartList">
                  <div class="cart-tab-1">
                    <div class="cart-item-check">
                    <span @click="editCart('checked',cartItem)">
                      <a v-if="cartItem.checked" href="javascipt:;"
                         class="checkbox-btn item-check-btn icon">&#xe63b;</a>
                      <a v-else href="javascipt:;" class="checkbox-btn item-check-btn icon">&#xe63d;</a>
                    </span>
                    </div>
                    <div class="cart-item-pic">
                      <img :src="'/static/products/'+cartItem.productImage">
                    </div>
                    <div class="cart-item-title">
                      <div class="item-name">{{cartItem.productName}}</div>
                    </div>
                  </div>
                  <div class="cart-tab-2">
                    <div class="item-price">{{Number(cartItem.salePrice) | fomatPrice('￥')}}</div>
                  </div>
                  <div class="cart-tab-3">
                    <div class="item-quantity">
                      <a class="input-sub" @click="editCart('minu',cartItem)">-</a>
                      <span class="select-ipt">{{cartItem.productNum}}</span>
                      <a class="input-add" @click="editCart('add',cartItem)">+</a>
                    </div>
                  </div>
                  <div class="cart-tab-4">
                    <div class="item-price-total">{{parseFloat(Number(cartItem.salePrice) *
                      Number(cartItem.productNum)) | fomatPrice('￥')}}
                    </div>
                  </div>
                  <div class="cart-tab-5">
                    <div class="cart-item-opration">
                      <a href="javascript:;" @click="delCartItem(cartItem)" class="item-edit-btn icon">&#xe7b1;</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="cart-foot-wrap">
            <div class="cart-foot-inner">
              <div class="cart-foot-l">
                <div class="item-all-check">
                  <a href="javascipt:;">
                  <span class="checkbox-btn item-check-btn" @click="toggleCheckAll">
                    <a v-if="isCheckedAll" href="javascript:;" class="checkbox-btn item-check-btn icon">&#xe63b;</a>
                    <a v-else href="javascript:;" class="checkbox-btn item-check-btn icon">&#xe63d;</a>
                  </span>
                    <span>全选</span>
                  </a>
                </div>
              </div>
              <div class="cart-foot-r">
                <div class="item-total">
                  总金额: <span class="total-price">{{totalPrice | fomatPrice('￥')}}</span>
                </div>
                <div class="btn-wrap">
                  <a href="javascript:;" @click="checkCount > 0 && checkOut()" class="btn btn--red"
                     :class="{'btn--dis': checkCount === 0}">结算</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-cart-product" v-else>
          <div class="icon">&#xe6b9;</div>
          <p>您还没有任何商品，赶紧去<a href="/" class="add-good">添加</a>吧</p>
        </div>
      </div>
    </div>
    <modal :md-show="modalConfirm" md-title="提示" @close="modalConfirm = ! modalConfirm">
      <p slot="message" class="tip-title">是否删除该商品？</p>
      <div slot="btn-group">
        <a href="javascript:;" class="btn btn--s" @click="confirmDelCart()">确定</a>
        <a href="javascript:;" class="btn btn--s btn--red" @click="modalConfirm = false">取消</a>
      </div>
    </modal>
    <!--导航尾部-->
    <nav-footer></nav-footer>
  </div>
</template>
<style scoped>
  .cart-item-list .cart-tab-3 {
    padding-top: 64px;
  }

  p.tip-title {
    line-height: 4rem;
    font-size: 16px;
    color: #000;
  }

  div.item-quantity {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-quantity a {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 15px;
    font-size: 18px;
    user-select: none;
    border: 1px solid #ddd;
    border-radius: 50%;
  }

  .item-quantity .select-ipt {
    margin: 0 20px;
  }

  .no-cart-product {
    text-align: center;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: center;
  }

  .no-cart-product .icon {
    height: 100px;
    font-size: 6em;
  }

  .no-cart-product p {
    color: #666666;
    font-size: 18px;
  }

  .add-good {
    transition: all .3s;
    color: #d1434a;
  }

  .add-good:hover {
    font-size: 20px;
    text-decoration: underline;
    color: #009de6;
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
    name: "Cart",
    data() {
      return {
        userId: '',
        productId: '',
        cartList: [],
        modalConfirm: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    computed: {
      //商品总金额
      totalPrice() {
        let sum = 0;
        this.cartList.forEach((item) => {
          if (item.checked)
            sum += (item.productNum * item.salePrice)
        });
        return Number(sum);
      },
      //是否全选
      isCheckedAll() {
        return this.checkCount === this.cartList.length;
      },
      checkCount() {
        let i = 0;
        this.cartList.forEach((item) => {
          if (item.checked) {
            i++;
          }
        });
        return i;
      }
    },
    created() {
      this.userId = Fun.getCookie('userId');
      if (!this.userId) {
        this.$router.push('/')
      }
    },
    mounted() {
      this.init()
    },
    filters: {
      fomatPrice: Fun.currency
    },
    methods: {
      //购物车列表初始化
      init() {
        if (!this.userId) return;
        axios.get('/api/users/cartList', {
          params: {
            userId: this.userId
          }
        }).then((res) => {
          this.cartList = res.data.result;
        })
      },
      //删除商品
      delCartItem(product) {
        this.modalConfirm = true;
        this.productId = product.productId;
      },
      //确认删除商品
      confirmDelCart() {
        if (this.userId && this.productId) {
          this.modalConfirm = false;
          axios.post('/api/users/cart/delCartItem', {userId: this.userId, productId: this.productId}).then((res) => {
            let result = res.data;
            this.cartList.forEach((product) => {
              if (product.productId === this.productId) {
                Fun.removeItem(this.cartList, product);
              }
            })
          });
        }
      },
      //全选切换
      toggleCheckAll() {
        let flag = !this.isCheckedAll ? true : false;
        this.cartList.forEach((product) => {
          product.checked = flag;
        });
        axios.post('/api/users/cart/checkedAll', {
          userId: this.userId,
          checkedAll: flag
        }).then((res) => {

        })
      },
      //商品编辑
      editCart(f, product) {
        let pram = {
          userId: this.userId,
          productId: product.productId
        };
        switch (f) {
          case 'add':
            product.productNum++;
            pram.productNum = product.productNum;
            break;
          case 'minu':
            if (product.productNum <= 1) break;
            product.productNum--;
            pram.productNum = product.productNum;
            break;
          case 'checked':
            product.checked = !product.checked;
            pram.checked = product.checked;
            break;
        }
        axios.post('/api/users/cart/editCartItem', pram).then((res) => {
          let result = res.data;
        })
      },
      //结算跳转
      checkOut() {
        this.$router.push('/adress');
      }
    }
  }
</script>

<style scoped>

</style>
