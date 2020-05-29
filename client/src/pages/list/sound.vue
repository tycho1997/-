<template>
  <div class="sound-list">
    <list-header title="电台文章"></list-header>

    <div class="input-search">
      <div class="main">
        <input
          type="text"
          v-focus="focused"
          @focus="searchFocus"
          @blur="searchBlur"
          v-model="searchTxt"
          placeholder="Search Article"
          ref="soundSearchInput"
        />
        <div class="search-icon" @click="searchSoundArticle"></div>
      </div>
    </div>
    <div class="container" id="soundList">
      <div
        class="banner"
        v-for="item in soundArticleList"
        v-bind:key="item._id"
        @click="toArticleDetail(item)"
      >
        <img class="center" :src="item.cover_url" alt />
        <div class="main">
          <div class="title">{{item.title}}</div>
          <div class="info">
            <div class="time">{{moment(item.update_time,`YYYY/MM/DD`)}}</div>
            <div class="author">©&nbsp;️{{item.author.user_id ? item.author.user_id.username : ''}}</div>
          </div>
        </div>
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ListHeader from "../common/ListHeader";
import mixin from "../../mixins";
import moment from "moment";
export default {
  name: "sound-list",
  mixins: [mixin],
  components: {
    ListHeader
  },
  data() {
    return {
      soundArticleList: [],
      totalItems: 0,
      current: 1,
      searchTxt: "",
      focused: false
    };
  },
  mounted() {
    const info = document.querySelector("#soundList");
    info.style.height = `${document.body.clientHeight - 140}px`;
    window.addEventListener("resize", function(e) {
      info.style.height = `${document.body.clientHeight - 140}px`;
    });
  },
  created() {
    this.showLoading("isData");
    this.$axios
      .getSoundArticleList({ current: this.current, isWebApp: true })
      .then(res => {
        this.totalItems = res.data.data.pageInfo.totalItems;
        this.soundArticleList = res.data.data.docs;
        console.log("this.soundArticleList", this.soundArticleList);
        this.preload(
          this.soundArticleList.map(item => {
            return item.cover_url;
          })
        ).done(() => {
          this.hideLoading("isData");
        });
      });
  },
  watch: {
    searchTxt(newVal) {
      this.$axios
        .getSoundArticleList({
          current: this.current,
          searchKey: newVal,
          isWebApp: true
        })
        .then(res => {
          this.soundArticleList = res.data.data.docs;
          console.log("this.soundArticleList", this.soundArticleList);
        });
    }
  },
  methods: {
    refresh(done) {
      this.$axios
        .getMusicArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.soundArticleList = res.data.data.docs;
          this.preload(
            this.soundArticleList.map(item => {
              return item.cover_url;
            })
          ).done(() => {
            this.current = 1;
            done();
          });
        });
    },
    infinite(done) {
      if (this.current * 15 >= this.totalItems) {
        this.$refs.soundScroller.finishInfinite(2);
        return;
      }

      this.current++;
      this.$axios
        .getMusicArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.soundArticleList = res.data.data.docs;
          this.preload(
            this.soundArticleList.map(item => {
              return item.cover_url;
            })
          ).done(() => {
            this.$refs.soundScroller.resize();
            done();
          });
        });
    },
    goBack() {
      this.setTransitionName("move-left-to-right");
      this.$router.go(-1);
    },
    toArticleDetail(item) {
      this.setTransitionName("move-right-to-left");
      this.$router.push({
        path: `/sound/${item._id}`
      });
    },
    searchFocus() {
      this.focused = true;
    },
    searchBlur() {
      this.focused = false;
    },
    searchSoundArticle() {
      this.$axios
        .getSoundArticleList({
          current: this.current,
          searchKey: this.searchTxt,
          isWebApp: true
        })
        .then(res => {
          this.soundArticleList = res.data.data.docs;
          console.log("this.soundArticleList", this.soundArticleList);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.sound-list {
  width: 100%;
  height: 100%;
  .input-search {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 88px;
    width: 100%;
    height: 70px;
    line-height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main {
      position: relative;
      width: 100%;
      margin-bottom: 16px;
      input {
        background: none;
        outline: none;
        -webkit-appearance: none;
        border-radius: 0;
        width: 95%;
        height: 50px;
        border: 0;
        background-color: rgb(246, 246, 246);
        box-sizing: border-box;
        padding: 0px 4.5% 0 2.5%;
      }
      .search-icon {
        width: 40px;
        height: 40px;
        background: url("../../assets/images/search-icon.png") no-repeat;
        background-size: 100%;
        position: absolute;
        right: 4.5%;
        top: 55%;
        transform: translateY(-38%);
      }
    }
  }
  .container {
    padding-top: 160px;
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255);
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    .banner {
      position: relative;
      z-index: 0;
      max-width: 670px;
      width: 100%;
      height: 300px;
      border-radius: 10px;
      margin: 0 auto;
      box-shadow: 0 0 15px 0px #c4c4c4;
      position: relative;
      margin-bottom: 30px;
      overflow: hidden;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        width: 100%;
        -webkit-filter: blur(1px);
        -moz-filter: blur(1px);
        -o-filter: blur(1px);
        -ms-filter: blur(1px);
        filter: blur(1px);
      }
      .main {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        .title {
          width: 98%;
          margin: 0 auto;
          font-size: 30px;
          font-weight: 400;
          color: #fff;
          word-break: break-all;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; //这里是在第二行有省略号
          overflow: hidden;
        }
        .info {
          position: absolute;
          right: 0;
          bottom: 20px;
          width: 100%;
          padding: 0 20px;
          font-size: 20px;
          text-align: right;
          color: #fff;
        }
      }
      .icon {
        position: absolute;
        left: 20px;
        bottom: 20px;
        width: 40px;
        height: 40px;
        background: url("../../assets/images/play-big-icon.png") no-repeat;
        background-size: 100% auto;
      }
    }
  }
}
</style>
