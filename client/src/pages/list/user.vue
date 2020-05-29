<template>
  <div class="user-list">
    <list-header title="关注"></list-header>
    <div class="container">
      <div class="banner" v-for="(item, index) in userList" :key="index">
        <div class="left">
          <div
            class="avatar"
            @click="toUser(item._id)"
            :style="{background: `url(${item.avatar}) no-repeat center`, backgroundSize: '100% auto'}"
          ></div>
        </div>
        <div class="middle">
          <div class="name text-overflow">{{item.username}}</div>
          <div class="description text-overflow">{{item.description}}</div>
        </div>
        <div class="right" v-if="type === 'follower'"></div>
        <div class="right" v-else>
          <div
            class="follow"
            :class="{active: item.isFollowed}"
            @click="handleFollow(index)"
          >{{item.isFollowed ? '已关注' : '关注'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListHeader from "../common/ListHeader";
import mixin from "../../mixins";
import { mapState, mapGetters, mapMutations } from "vuex";
import types from "../../store/types";
export default {
  name: "user",
  components: {
    ListHeader
  },
  mixins: [mixin],
  data() {
    return {
      userList: [],
      type: ""
    };
  },
  computed: {
    ...mapGetters(["user_info"])
  },
  created() {
    this.$data.type = this.$route.params.type;
    if (this.$route.params.item && this.$route.params.item.length) {
      for (let i in this.$route.params.item) {
        this.$axios
          .getFriendShipById({
            from_user: this.user_info._id,
            to_user: this.$route.params.item[i]
          })
          .then(res => {
            this.$set(this.$data.userList, i, res.data.data);
          });
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === "UserList") {
        this.$data.type = this.$route.params.type;
        if (this.$route.params.item && this.$route.params.item.length) {
          for (let i of this.$route.params.item) {
            this.$axios
              .getFriendShipById({
                from_user: this.user_info._id,
                to_user: this.$route.params.item[i]
              })
              .then(res => {
                this.$set(this.$data.userList, i, res.data.data);
              });
          }
        }
      }
    }
  },
  methods: {
    handleFollow(index) {
      if (this.$data.type === "following") {
        this.$axios
          .changeFriendShipById({
            from_user: this.user_info._id,
            to_user: this.$data.userList[index]._id,
            to_follow: !this.$data.userList[index].isFollowed
          })
          .then(res => {
            this.$set(this.$data.userList[index], 'isFollowed', !this.$data.userList[index].isFollowed);
          });
      } else {
        this.$axios
          .changeFriendShipById({
            from_user: this.$data.userList[index]._id,
            to_user: this.user_info._id,
            to_follow: !this.$data.userList[index].isFollowed
          })
          .then(res => {
            this.$set(this.$data.userList[index], 'isFollowed', !this.$data.userList[index].isFollowed);
          });
      }
    },
    toUser(id) {
      this.setTransitionName("move-right-to-left");
      this.$router.push({
        path: "/user",
        query: {
          user_id: id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-list {
  width: 100%;
  overflow-x: hidden;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  .container {
    width: 100%;
    margin-top: 98px;
    background-color: #fff;
    .banner {
      width: 750px;
      height: 100px;
      margin: 30px auto;
      padding: 10px 20px;
      border-bottom: 1px solid #d4d4d4; /*no*/
      display: flex;
      .left {
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
      .middle {
        margin-left: 20px;
        text-align: left;
        width: 490px;
        .name {
          height: 60px;
          line-height: 60px;
          font-size: 30px;
          color: #666;
          font-weight: bold;
        }
        .description {
          height: 40px;
          line-height: 40px;
          font-size: 20px;
          color: #666;
        }
      }
      .right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .follow {
          display: block;
          width: 90px;
          height: 50px;
          line-height: 50px;
          margin: 20px auto;
          text-align: center;
          font-size: 20px;
          color: #666666;
          border: 1px solid rgb(102, 102, 102); /* no */
          border-radius: 5px;
          transition: all 1s;
          box-sizing: border-box;
          &.active {
            display: block;
            border: none;
            background-color: rgb(153, 157, 252);
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
