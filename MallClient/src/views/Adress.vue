<template>
  <div>
    <!--导航头部-->
    <nav-header ref="navHeader"></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span>发货地址</span>
    </nav-bread>
    <div class="checkout-page">
      <div class="container">
        <div class="checkout-addr">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
          </div>
          <!-- 交易步骤-->
          <check-step :step="stepNum"></check-step>
          <!-- 地址列表 -->
          <div class="page-title-normal checkout-title">
            <h2><span>收货地址</span></h2>
          </div>
          <div class="addr-list-wrap">
            <div class="addr-list">
              <ul>
                <li v-for="(adress,index) in adressListFilter" :class="{'check':checkedAdress === index}"
                    @click="selectAdress(adress,index)">
                  <dl>
                    <dt>{{adress.userName}}</dt>
                    <dd class="address">{{adress.streetName}}</dd>
                    <dd class="tel">{{adress.tel}}</dd>
                  </dl>
                  <!--删除按钮-->
                  <div class="addr-opration addr-del" @click="delAdress(adress.addressId)">
                    <a href="javascript:;" class="addr-del-btn">
                      <i class="icon icon-del">&#xe7b1;</i>
                    </a>
                  </div>
                  <div class="addr-opration addr-set-default">
                    <a v-if="!adress.isDefault" @click="setDefault(adress.addressId)" href="javascript:;"
                       class="addr-set-default-btn"><i>设为默认地址</i></a>
                  </div>
                  <div v-if="adress.isDefault" class="addr-opration addr-default">默认地址</div>
                </li>
                <!--添加地址-->
                <li class="addr-new">
                  <div class="add-new-inner">
                    <i class="icon icon-add" @click="addrAddShow = true">&#xe673;</i>
                    <p>添加地址</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="shipping-addr-more">
              <a class="addr-more-btn up-down-btn" href="javascript:;" :class="{ 'open' : limit>3 }" @click="expand()">更多
                <i class="i-up-down">
                  <i class="i-up-down-l"></i>
                  <i class="i-up-down-r"></i>
                </i>
              </a>
            </div>
          </div>

          <!-- 物流-->
          <div class="page-title-normal checkout-title">
            <h2><span>物流</span></h2>
          </div>
          <div class="shipping-method-wrap">
            <div class="shipping-method">
              <ul>
                <li class="check">
                  <div class="name">标准航运</div>
                  <div class="price">包邮</div>
                  <div class="shipping-tips">
                    <p>一旦发货，订单应在1-7个工作日到达目的地。</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="next-btn-wrap">
            <router-link class="btn btn--m btn--red" :to="{path: 'orderConfirm',query:{'adressId':selectedAddrId}}">
              下一步
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--确认删除-->
    <modal :md-show="mdShow" md-title="提示" @close="mdShow = !mdShow">
      <p slot="message" style="font-size: 18px;">
        您确定删除该地址？
      </p>
      <div slot="btn-group">
        <a href="javascript:;" class="btn btn--m" @click="confrimDelAdress()">确定</a>
        <a href="javascript:;" class="btn btn--m" @click="mdShow = !mdShow">取消</a>
      </div>
    </modal>
    <!--删除失败-->
    <modal :md-show="delError" md-title="提示" @close="delError = !delError">
      <p slot="message" class="del-err">
        <span class="icon">&#xe669;</span><span class="text">删除失败</span>
      </p>
      <div slot="btn-group">
        <a href="javascript:;" class="btn btn--m" @click="delError = !delError">确定</a>
      </div>
    </modal>
    <add-adress v-if="addrAddShow" ref="addAdressBox" @close="closeAddBox()" @addAdress="addAdress"></add-adress>
    <div class="md-overlay" v-show="addrAddShow" @click="closeAddBox()"></div>
    <!--导航尾部-->
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .icon.icon-del {
    font-size: 18px;
  }

  .icon.icon-add {
    font-size: 3.5em;
    line-height: 50px;
    text-align: center;
  }

  .addr-list-wrap .addr-list li:hover .addr-set-default {
    display: block;
  }

  p.del-err {
    font-size: 18px;
  }

  p.del-err .icon {
    font-size: 16px;
    color: #f00;
  }

  p.del-err .text {
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
  import CheckStep from "@/components/CheckStep"
  import AddAdress from "@/components/AddAdress"
  import axios from "axios"
  import {Fun} from "@/util/Fun"

  export default {
    name: "Adress",
    data() {
      return {
        //添加收货地址
        addrAddShow: false,
        //订单进度
        stepNum: 1,
        userId: Fun.getCookie('userId'),
        //选择的地址id
        selectedAddrId: "",
        //确认删除模态框
        mdShow: false,
        //删除失败模态框
        delError: false,
        adressList: [],
        //默认显示条数
        limit: 3,
        //默认选中的地址
        checkedAdress: 0,
        //删除的地址id
        delAdressId: ''
      }
    },
    created() {
      this.getAdressList();
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal,
      CheckStep,
      AddAdress
    },
    computed: {
      adressListFilter() {
        return this.adressList.slice(0, this.limit);
      }
    },
    methods: {
      //关闭新增地址模态框
      closeAddBox() {
        this.addrAddShow = false;
      },
      //确认新增地址
      addAdress(data) {
        if (this.userId && data) {
          axios.post('/api/users/addAdress', {userId: this.userId, data}).then(res => {
            let result = res.data;
            if (!result.status) {
              this.addrAddShow = false;
            }
          })
        }
      },
      //得到默认地址
      checkadrr() {
        this.adressList.forEach((item, index) => {
          if (item.isDefault) {
            this.checkedAdress = index;
            this.selectedAddrId = item.addressId;
          }
        });
      },
      //获取地址列表
      getAdressList() {
        if (this.userId) {
          axios.post('/users/cart/adressList', {
            userId: this.userId
          }).then((res) => {
            this.adressList = res.data.result;
            this.checkadrr();
          })
        }
      },
      //展开列表
      expand() {
        if (this.limit === 3) {
          this.limit = this.adressList.length;
        } else {
          this.limit = 3;
        }
      },
      //设置默认地址
      setDefault(id) {
        if (this.userId && id) {
          axios.post('/users/cart/setDefault', {
            userId: this.userId,
            adressId: id
          }).then(res => {
            let result = res.data;
            if (!result.status)
              this.getAdressList();
            else
              this.delError = true;
          })
        }
      },
      //删除地址
      delAdress(id) {
        if (this.userId && id) {
          this.mdShow = !this.mdShow;
          this.delAdressId = id;
        }
      },
      //确认删除地址
      confrimDelAdress() {
        if (this.userId && this.delAdressId) {
          this.mdShow = !this.mdShow;
          axios.post('/api/users/cart/delAdress', {
            userId: this.userId,
            adressId: this.delAdressId
          }).then(res => {
            let result = res.data;
            if (!result.status)
              this.getAdressList();
          })
        }
      },
      //选择地址
      selectAdress(adress, index) {
        this.checkedAdress = index;
        this.selectedAddrId = adress.addressId;
      }
    }
  }
</script>

<style scoped>

</style>
