<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/" class="logo-link">
          <img class="navbar-brand-logo" src="@/assets/img/logo.png" id="icon-cart"><span>feng shopping</span>
        </a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <span class="navbar-link" v-if="nickName">{{nickName}}</span>
          <a href="javascript:void(0)" class="navbar-link" v-if="!nickName"
             @click="loginModalFlag = !loginModalFlag">登录</a>
          <a href="javascript:void(0)" class="navbar-link" @click="logout">退出</a>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count"></span>
            <a class="navbar-link navbar-cart-link icon" href="javascript:;" @click="toCart()">&#xe64e;</a>
          </div>
        </div>
      </div>
    </div>
    <modal md-title="登录" :md-show="loginModalFlag" @close="loginModalFlag = !loginModalFlag">
      <div class="error-wrap" slot="message">
        <span class="error error-show" v-show="errorTip">{{errMsg}}</span>
        <ul>
          <li class="regi_form_input">
            <i class="icon IconPeople">&#xe60f;</i>
            <input type="text"
                   tabindex="1"
                   name="loginname"
                   v-model="userName"
                   class="regi_login_input regi_login_input_left"
                   placeholder="用户名"
                   data-type="loginname">
          </li>
          <li class="regi_form_input noMargin">
            <i class="icon IconPwd">&#xe64c;</i>
            <input type="password"
                   tabindex="2"
                   name="password"
                   v-model="userPwd"
                   class="regi_login_input regi_login_input_left login-input-no input_text"
                   placeholder="密码"
                   @keyup.enter="login">
          </li>
        </ul>
      </div>
      <div slot="btn-group">
        <a href="javascript:;" class="btn-login" @click="login">登 录</a>
      </div>
    </modal>
  </header>
</template>
<style>
  .logo-link {
    width: 200px;
    height: 55px;
    line-height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo-link span {
    font-size: 17px;
    font-weight: bold;
  }
  .logo-link .navbar-brand-logo {
    height: 100%;
  }
</style>
<script>
  import md5 from 'js-md5';
  import axios from 'axios'
  import Modal from "@/components/Modal"
  import {Fun} from "@/util/Fun"

  export default {
    name: "NavHeader",
    data() {
      return {
        userName: '',
        userPwd: '',
        errMsg: '用户名或者密码错误',
        nickName: '',
        errorTip: false,
        loginModalFlag: false
      }
    },
    components: {
      Modal
    },
    created() {
      let userId = Fun.getCookie("userId");
      if (userId) {
        this.nickName = Fun.getCookie("nickName");
      } else {
        this.$router.push('/');
      }
    },
    methods: {
      login() {
        if (!this.userName || !this.userPwd) {
          this.errorTip = true;
          this.errMsg = '用户名或者密码错误';
          return;
        }
        axios.post('/api/users/login', {
          userName: this.userName,
          userPwd: md5(this.userPwd)
        }).then((res) => {
          let result = res.data;
          if (!result.status) {
            this.nickName = result.result.nickName;
            this.errorTip = false;
            this.loginModalFlag = false;
          } else {
            this.errMsg = result.result.errMsg;
            this.errorTip = true;
          }
        })
      },
      logout() {
        if (!Fun.getCookie("userId")) return;
        axios.post('/api/users/logout').then((res) => {
          let result = res.data;
          if (!result.status) {
            this.nickName = '';
            this.$router.push('/');
          }
        });
      },
      toCart() {
        let userId = Fun.getCookie("userId");
        userId && this.$router.push('/cart');
      }
    }
  }
</script>
