<template>
  <div class="admin-info-card">
    <div class="header">
      <div class="avatar" :style="{background: `url(${adminInfo.avatar})`}"></div>
      <div class="info">
        <div class="name">{{adminInfo.username}}</div>
        <div class="dec">{{adminInfo.role_name}}</div>
      </div>
    </div>
    <div class="footer">
      <span>上次登录于</span>
      <div class="footer_text">
        <span>时间:</span>
        <span>{{new Date(adminInfo.last_login.time).toLocaleString()}}</span>
      </div>
      <div class="footer_text">
        <span>IP:</span>
        <span>{{adminInfo.last_login.ip}}</span>
      </div>
      <div class="footer_text">
        <span>地点:</span>
        <span>{{adminInfo.last_login.location}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-info-card",
  props: ["span", "adminInfo"]
};
</script>

<style lang="scss" scoped>
@mixin textOverflow {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.admin-info-card {
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  padding: 16px;
  .header {
    display: flex;
    border-bottom: 2px solid #fff1fd;
    padding-bottom: 20px;
    .avatar {
      width: 100px;
      height: 100px;
      background: url("http://ovg169nib.bkt.clouddn.com/FpJGeRZga0wIGSIBDoO5clVpFyVf")
        no-repeat;
      background-size: 100% auto;
      margin-right: 50px;
      border-radius: 50%;
    }
    .info {
      width: 200px;
      height: 100px;
      font-weight: bold;
      .name {
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 32px;
      }
      .dec {
        line-height: 20px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.64);
      }
    }
  }
  .footer {
    line-height: 50px;
    .footer_text {
      padding-left: 16px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>