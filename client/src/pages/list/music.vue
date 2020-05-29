<template>
  <div class="music-list">
    <list-header title="音乐文章"></list-header>
    <div class="input-search">
      <div class="main">
        <input
          type="text"
          v-focus="focused"
          @focus="searchFocus"
          @blur="searchBlur"
          v-model="searchTxt"
          placeholder="Search Article"
          ref="musicSearchInput"
        />
        <div class="search-icon" @click="searchMusicArticle"></div>
      </div>
    </div>
    <div class="container" id="scrollMusicList">
      <div
        class="banner"
        v-for="item in musicArticleList"
        v-bind:key="item._id"
        @click="toArticleDetail(item)"
      >
        <div
          class="left"
          :style="{background: `url(${item.music_info.cover}) no-repeat center`, backgroundSize: '100% auto'}"
        ></div>
        <div class="right">
          <div class="title">{{item.title}}</div>
          <div
            class="music_info"
          >{{item.music_info.name ? item.music_info.name : '未知'}} / {{item.music_info.singer ? item.music_info.singer: '未知'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListHeader from "../common/ListHeader";
import mixin from "../../mixins";
import moment from "moment";
export default {
  name: "music-list",
  mixins: [mixin],
  components: {
    ListHeader
  },
  data() {
    return {
      musicArticleList: [],
      totalItems: 0,
      current: 1,
      searchTxt: "",
      focused: false
    };
  },
  created() {
    this.showLoading("isData");
    this.$axios
      .getMusicArticleList({ current: this.current, isWebApp: true })
      .then(res => {
        this.totalItems = res.data.data.pageInfo.totalItems;
        this.musicArticleList = res.data.data.docs;
        console.log("this.musicArticleList", this.musicArticleList);
        this.preload(
          this.musicArticleList.map(item => {
            return item.cover_url;
          })
        ).done(() => {
          this.hideLoading("isData");
        });
      });
  },
  mounted() {
    const info = document.querySelector("#scrollMusicList");
    info.style.height = `${document.body.clientHeight - 128}px`;
    window.addEventListener("resize", function(e) {
      info.style.height = `${document.body.clientHeight - 128}px`;
    });
  },
  watch: {
    searchTxt(newVal) {
      this.$axios
        .getMusicArticleList({
          current: this.current,
          searchKey: newVal,
          isWebApp: true
        })
        .then(res => {
          this.musicArticleList = res.data.data.docs;
          console.log("this.musicArticleList", this.musicArticleList);
        });
    }
  },
  methods: {
    refresh(done) {
      this.$axios
        .getMusicArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.musicArticleList = res.data.data.docs;
          this.preload(
            this.musicArticleList.map(item => {
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
        this.$refs.musicScroller.finishInfinite(2);
        return;
      }

      this.current++;
      this.$axios
        .getMusicArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.musicArticleList = res.data.data.docs;
          this.preload(
            this.musicArticleList.map(item => {
              return item.cover_url;
            })
          ).done(() => {
            this.$refs.musicScroller.resize();
            done();
          });
        });
    },
    goBack() {
      this.getTopMusicArticle()
        .then(res => {
          this.setTransitionName("move-left-to-right");
          this.$router.go(-1);
        })
        .catch(error => console.log("error", error));
    },
    toArticleDetail(item) {
      this.setTransitionName("move-right-to-left");
      this.$router.push({
        path: `/music/${item._id}`
      });
    },
    searchFocus() {
      this.focused = true;
    },
    searchBlur() {
      this.focused = false;
    },
    searchMusicArticle() {
      this.$axios
        .getMusicArticleList({
          current: this.current,
          searchKey: this.searchTxt,
          isWebApp: true
        })
        .then(res => {
          this.musicArticleList = res.data.data.docs;
          console.log("this.musicArticleList", this.musicArticleList);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.music-list {
  width: 100%;
  height: 100%;
  .input-search {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 88px;
    width: 100%;
    height: 70px;
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
        top: 50%;
        transform: translateY(-38%);
      }
    }
  }
  .container {
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-top: 162px;
    background-color: rgb(255, 255, 255);
    position: relative;
    z-index: 0;
    .banner {
      position: relative;
      z-index: 0;
      max-width: 670px;
      width: 100%;
      height: 150px;
      border-radius: 10px;
      margin: 0 auto;
      box-shadow: 0 0 5px 0px #c4c4c4;
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      display: flex;
      &:last-child {
        margin-bottom: 0;
      }
      .left {
        width: 150px;
        height: 150px;
      }
      .right {
        width: 520px;
        font-size: 32px;
        color: #666;
        .title {
          width: 520px;
          height: 100px;
          box-sizing: border-box;
          padding: 10px 10px;
          word-break: break-all;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; //这里是在第二行有省略号
          overflow: hidden;
          text-align: left;
        }
        .music_info {
          width: 520px;
          height: 50px;
          box-sizing: border-box;
          text-align: right;
          font-size: 20px;
          line-height: 50px;
          padding: 0 30px;
        }
      }
    }
  }
}
</style>
