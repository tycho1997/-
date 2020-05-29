<template>
  <div class="reading-list">
    <list-header title="阅读文章"></list-header>
    <div class="input-search">
      <div class="main">
        <input
          type="text"
          v-focus="focused"
          @focus="searchFocus"
          @blur="searchBlur"
          v-model="searchTxt"
          placeholder="Search Article"
          ref="readingSearchInput"
        />
        <div class="search-icon" @click="searchReadingArticle"></div>
      </div>
    </div>
    <div class="container" id="readingList">
      <div
        class="banner"
        v-for="item in readingArticleList"
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
      </div>
    </div>
  </div>
</template>

<script>
import ListHeader from "../common/ListHeader";
import mixin from "../../mixins";
import moment from "moment";
export default {
  name: "reading-list",
  mixins: [mixin],
  components: {
    ListHeader
  },
  data() {
    return {
      readingArticleList: [],
      totalItems: 0,
      current: 1,
      searchTxt: "",
      focused: false
    };
  },
  mounted() {
    const info = document.querySelector("#readingList");
    info.style.height = `${document.body.clientHeight - 128}px`;
    window.addEventListener("resize", function(e) {
      info.style.height = `${document.body.clientHeight - 128}px`;
    });
  },
  created() {
    this.showLoading("isData");
    this.$axios
      .getReadingArticleList({ current: this.current, isWebApp: true })
      .then(res => {
        this.totalItems = res.data.data.pageInfo.totalItems;
        this.readingArticleList = res.data.data.docs;
        console.log("this.readingArticleList", this.readingArticleList);
        this.preload(
          this.readingArticleList.map(item => {
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
        .getReadingArticleList({
          current: this.current,
          searchKey: newVal,
          isWebApp: true
        })
        .then(res => {
          this.readingArticleList = res.data.data.docs;
        });
    }
  },
  methods: {
    refresh(done) {
      this.$axios
        .getReadingArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.readingArticleList = res.data.data.docs;
          this.preload(
            this.readingArticleList.map(item => {
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
        this.$refs.readingScroller.finishInfinite(2);
        return;
      }

      this.current++;
      this.$axios
        .getReadingArticleList({ current: this.current, isWebApp: true })
        .then(res => {
          this.readingArticleList = res.data.data.docs;
          this.preload(
            this.readingArticleList.map(item => {
              return item.cover_url;
            })
          ).done(() => {
            this.$refs.readingScroller.resize();
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
        path: `/reading/${item._id}`
      });
    },
    searchFocus() {
      this.focused = true;
    },
    searchBlur() {
      this.focused = false;
    },
    searchReadingArticle() {
      this.$axios
        .getReadingArticleList({
          current: this.current,
          searchKey: this.searchTxt,
          isWebApp: true
        })
        .then(res => {
          this.readingArticleList = res.data.data.docs;
          console.log("this.readingArticleList", this.readingArticleList);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.reading-list {
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
        top: 50%;
        transform: translateY(-38%);
      }
    }
  }
  .container {
    padding-top: 160px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: rgb(255, 255, 255);
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
    }
  }
}
</style>
