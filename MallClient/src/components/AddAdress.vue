<template>
  <div class="add-adress-box">
    <h2 class="title">新增收货地址
      <button class="close">&times;</button>
    </h2>
    <ul>
      <li class="regi_form_input">
        <i class="icon IconPeople">&#xe60f;</i>
        <input type="text"
               v-model="userName"
               class="regi_login_input regi_login_input_left"
               placeholder="收件人">
      </li>
      <li class="regi_form_input">
        <i class="icon IconPwd">&#xe627;</i>
        <input type="number"
               v-model="tel"
               class="regi_login_input regi_login_input_left login-input-no input_text"
               placeholder="联系电话">
      </li>
      <li class="regi_form_input">
        <i class="icon IconPwd">&#xe619;</i>
        <input type="text"
               v-model="streetName"
               class="regi_login_input regi_login_input_left login-input-no input_text"
               placeholder="地址">
      </li>
      <li class="regi_form_input">
        <i class="icon IconPwd">&#xe60b;</i>
        <input type="tel"
               v-model="postCode"
               class="regi_login_input regi_login_input_left login-input-no input_text"
               placeholder="邮政编码">
      </li>
    </ul>
    <div class="btn-wrap">
      <a href="javascript:;" class="btn" @click="confrim()">确定</a>
      <a href="javascript:;" class="btn" @click="$emit('close')">取消</a>
    </div>
  </div>
</template>
<style scoped>
  .add-adress-box {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: space-between;
    z-index: 999;
    width: 40%;
    height: 400px;
    padding: 1.5em;
    position: fixed;
    left: 50%;
    top: 50%;
    background: #ffffff;
    transform: translate(-50%, -50%);
  }

  .title {
    position: relative;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 17px;
    text-align: center;
  }

  .title .close {
    position: absolute;
    right: -15px;
    top: -15px;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 28px;
    font-size: 20px;
    color: #ccc;
  }

  .btn-wrap {
    display: flex;
    margin-top: 20px;
    justify-content: space-around;
  }

  .btn-wrap a {
    display: block;
    width: 35%;
  }
</style>
<script>
  export default {
    name: "AddAdress",
    data() {
      return {
        postCode: "",
        streetName: "",
        tel: "",
        userName: ""
      }
    },
    methods: {
      //生成adressId
      getAdressId() {
        let timemap1 = Math.floor(+new Date());
        let timemap2 = Math.floor(+new Date());
        let rad = Math.floor(Math.random() * 100);
        let leng = Math.floor(Math.random() * 15 + 8);
        let addressIdStr = String(timemap1 + rad + timemap2);
        let addressId = Math.floor(addressIdStr.substr(0, leng));
        return addressId;
      },
      confrim() {
        let data = {
          postCode: this.postCode,
          streetName: this.streetName,
          tel: this.tel,
          userName: this.userName,
          addressId: this.getAdressId(),
          isDefault: false
        };
        if (this.streetName && this.tel && this.userName)
          this.$emit('addAdress', data);
      }
    }
  }
</script>

<style scoped>

</style>
