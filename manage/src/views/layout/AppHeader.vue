<template>
  <header class="header" :class="{hidden: !openedMenu}">
    <div class="main">
      <div class="bar" @click="toggleMenu">
        <i class="el-icon-menu" style="color: rgba(0,0,0,0.64)"></i>
      </div>
      <div class="logo" :class="{hidden: !openedMenu}">
        <div class="text" :class="{hidden: !openedMenu}">
            <div style="color: #40c9c6;float:left;">R</div>
            <div style="color: #36a3f7;float:left;">e</div>
            <div style="color: #f4516c;float:left;">a</div>
            <div style="color: #34bfa3;float:left;">d</div>
            <div style="float:left;">e</div>
            <div style="float:left;">r</div>
        </div>
      </div>

      <div class="personal">
        <div class="msg">
          <i class="iconfont icon-message"></i>
        </div>
        <div class="account">
          <div class="avatar" :style="avatarStyle"></div>
          <el-dropdown>
            <div class="name">
              {{adminInfo.username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="goHome">首页</span>
              </el-dropdown-item>
              <!--<el-dropdown-item><span @click="modifyPasswordDialog.opened = true">修改密码</span></el-dropdown-item>-->
              <el-dropdown-item>
                <span @click="goUserProfile">个人资料</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span @click="loginOut">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script type="text/babel">
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import types from "../../store/types";

export default {
  name: "AppHeader",
  props: ["adminInfo"],
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: ""
      },
      modifyPasswordDialog: {
        opened: false,
        formLabelWidth: "120px",
        width: "30%"
      },
      avatarStyle: {},
      thisAdminInfo: this.adminInfo
    };
  },
  computed: {
    ...mapState({
      openedMenu: state => {
        return state.header.openedMenu;
      }
    })
  },
  created() {
    this.avatarStyle.background = `url(${this.thisAdminInfo.avatar}) no-repeat`;
    this.avatarStyle.backgroundSize = `100% auto`;
  },
  mounted() {},
  methods: {
    ...mapMutations({
      toggleMenu: types.TOGGLE_MENU
    }),
    goHome() {
      this.$router.push({
        path: "/dashboard"
      });
    },
    goUserProfile() {
      this.$router.push({
        path: "/user/profile"
      });
    },
    loginOut() {
      this.$message({
        message: "退出登录成功",
        type: "success"
      });
      this.$store.dispatch(types.ADMIN_LOGINOUT);
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding: 0 40px;
  transition: all 0.5s;
  &.hidden {
    padding: 0 40px 0 0;
  }

  .main {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;

    .logo {
      width: 200px;
      height: 100%;
      float: left;
      padding: 20px 10px;
      display: flex;
      justify-items: center;
      align-items: center;
      transition: all 0.5s;
      &.hidden {
        width: 65px;
      }
      /*:-moz-any-link.img {
        width: 40px;
        height: 40px;
        background: url("../../assets/images/logo.png") no-repeat;
        background-size: 100% auto;
      }*/
      .text {
        font-size: 25px;
        font-weight: bold;
        color: #353535;
        transition: all 0.5s;
        &.hidden {
          display: none;
          opacity: 0;
          visibility: hidden;
        }
      }
    }

    .bar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
      margin-left: 10px;
      float: left;
      transition: all 0.5s;
      cursor: pointer;
      i {
        font-size: 40px;
      }
    }

    .personal {
      height: 100%;
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .msg {
        width: 40px;
        height: 40px;
        border: 1px solid #e4e8eb;
        border-radius: 50%;
        vertical-align: middle;
        line-height: 40px;
        margin-right: 10px;
        text-align: center;
        i {
          font-size: 20px;
          color: #6f7180;
        }
      }
      .account {
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        .name {
          display: block;
          font-weight: 400;
          color: #353535;
          font-size: 14px;
          margin-left: 10px;
        }
      }
    }
  }

  .modifyPasswordDialog {
    width: 500px;
  }
}
</style>
