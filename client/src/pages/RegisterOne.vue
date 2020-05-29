<template>
  <div class="container">
    <div class="back" @click="goBack"></div>
    <div class="input-email">
      <div class="label">Email</div>
      <input type="email" v-model="email" placeholder="请输入邮箱" />
    </div>
    <div class="btn" @click="getCode" :class="{active: btnActive}">获取验证码</div>
    <p class="tip">注册遇到困难？</p>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import types from "../store/types";
import mixin from "../mixins";
export default {
  name: "register-one",
  mixins: [mixin],
  data() {
    return {
      email: "",
      btnActive: false
    };
  },
  watch: {
    email(val) {
      this.btnActive = this.$v.isEmail(val) ? true : false;
    }
  },
  methods: {
    goBack() {
      this.setTransitionName("move-left-to-right");
      this.$router.go(-1);
    },
    getCode() {
      if (this.$v.isEmail(this.email)) {
        this.showLoading();
        this.$axios
          .getCode({ email: this.email })
          .then(res => {
            this.hideLoading();
            this.$toast(res.data.message);
            if (!res.data.status) return;
            this.setTransitionName("move-right-to-left");
            this.$router.push({
              path: "/register2",
              query: {
                email: encodeURIComponent(this.email)
              }
            });
          })
          .catch(error => {
            this.hideLoading();
            this.$toast("出错了", "bottom");
          });
      } else {
        this.$toast("请输入正确邮箱地址");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .back {
    width: 16px;
    height: 32px;
    background: url("../assets/images/back.png") no-repeat;
    background-size: 100% auto;
    position: fixed;
    left: 32px;
    top: 50px;
  }
  .input-email {
    position: relative;
    width: 600px;
    height: 80px;
    border: 1px solid rgb(219, 219, 219); /* no */
    padding: 32px;
    margin: 32px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .label {
      font-size: 26px;
      color: #999999;
      margin-right: 35px;
    }
    input {
      background: none;
      outline: none;
      -webkit-appearance: none;
      border-radius: 0;
      width: 465px;
      height: 35px;
      border: 0;
      border-left: 1px solid rgb(219, 219, 219); /* no */
      padding-left: 20px;
    }
  }
  .btn {
    position: relative;
    width: 500px;
    height: 80px;
    border-radius: 10px;
    background-color: rgb(219, 219, 219);
    font-size: 28px;
    color: #fff;
    font-weight: bold;
    line-height: 80px;
    text-align: center;
  }
  .btn.active {
    background-color: #666;
  }
  .tip {
    top: 870px;
    font-size: 22px;
    color: #666666;
    padding: 5px 0;
    text-decoration: underline;
  }
}
</style>
