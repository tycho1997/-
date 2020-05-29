<template>
  <div class="moment">
    <m-header></m-header>
    <div id="scrollMoment">
      <div class="banner" v-for="(item, index) in imageArticleList" v-bind:key="item._id">
        <div class="cover" @click="showPreview(item)">
          <img alt :src="item.image_url" />
        </div>
        <div class="info">
          <p class="txt">{{item.content}}</p>
          <p class="author" @click="toUser(item)">{{item.author.username}}</p>
          <div class="bottom">
            <div class="time">{{moment(item.create_time)}}</div>
            <div class="operate">
              <div
                class="collect"
                :class="{active: isCollected(item, index)}"
                @click="handleCollect(item, index)"
              ></div>
              <div class="share"></div>
              <div class="like-box" @click="handleLike(item, index)">
                <div class="like" :class="{active: isLiked(item)}"></div>
                <div class="num-box">
                  <div class="num">{{item.likes_count}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <m-footer class="footer"></m-footer>
  </div>
</template>

<script>
import MHeader from "./common/MHeader";
import MFooter from "./common/MFooter";
import ImagePreview from "./common/ImagePreview";
import { mapState, mapGetters, mapMutations } from "vuex";
import types from "../store/types";
import mixin from "../mixins";
export default {
  name: "moment",
  components: {
    MHeader,
    MFooter,
    ImagePreview
  },
  mixins: [mixin],
  data() {
    return {
      imageArticleList: [],
      totalItems: 0,
      current: 1
    };
  },
  created() {
    this.showLoading("isData");
    this.$axios.getImageArticleList({ current: this.current }).then(res => {
      this.totalItems = res.data.data.pageInfo.totalItems;
      this.imageArticleList = res.data.data.docs;
      this.preload(
        this.imageArticleList.map(item => {
          return item.image_url;
        })
      ).done(() => {
        this.hideLoading("isData");
      });
    });
  },
  mounted() {
    const container = document.querySelector("#scrollMoment");
    container.style.height = `${document.body.clientHeight - 173}px`;
    window.addEventListener("resize", function(e) {
      container.style.height = `${document.body.clientHeight - 173}px`;
    });
  },
  computed: {
    ...mapGetters(["user_info"])
  },
  methods: {
    refresh(done) {
      this.$axios.getImageArticleList().then(res => {
        this.imageArticleList = res.data.data.docs;
        this.preload(
          this.imageArticleList.map(item => {
            return item.image_url;
          })
        ).done(() => {
          this.current = 1;
          done();
        });
      });
    },
    infinite(done) {
      if (this.current * 5 >= this.totalItems) {
        this.$refs.scroller.finishInfinite(2);
        return;
      }

      this.current++;
      this.$axios.getImageArticleList({ current: this.current }).then(res => {
        this.imageArticleList = res.data.data.docs;
        this.preload(
          this.imageArticleList.map(item => {
            return item.image_url;
          })
        ).done(() => {
          this.$refs.scroller.resize();
          done();
        });
      });
    },
    handleCollect(item, index) {
      const to_collect = this.isCollected(item);
      console.log("!to_collect", !to_collect);
      this.$axios
        .changeImageArticleCollectById({
          _id: item._id,
          user_id: this.user_info._id,
          to_collect: !to_collect
        })
        .then(res => {
          console.log(res.data.data);
          this.imageArticleList[index] = Object.assign(
            this.imageArticleList[index],
            res.data.data
          );
        });
    },
    handleLike(item, index) {
      const to_like = this.isLiked(item);
      this.$axios
        .changeImageArticleLikesById({
          _id: item._id,
          user_id: this.user_info._id,
          to_like: !to_like
        })
        .then(res => {
          this.imageArticleList[index] = Object.assign(
            this.imageArticleList[index],
            res.data.data
          );
        });
    },
    toUser(item) {
      this.setTransitionName("move-right-to-left");
      this.$router.push({
        path: "/user",
        query: {
          user_id: item.author._id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.moment {
  height: 100%;
  #scrollMoment {
    padding-top: 98px;
    overflow-y: scroll;
    width: 100%;
    position: release;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    flex-wrap: wrap;
    .banner {
      width: 100%;
      max-width: 600px;
      margin: 16px 0 64px 0;
      background-color: #fff;
      .cover {
        width: 100%;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.3);
        img {
          width: 100%;
          max-height: 80vh;
        }
        img[lazy="loading"] {
          width: 40px;
          height: 300px;
          margin: auto;
        }
      }
      .info {
        width: 100%;
        font-size: 30px;
        line-height: 35px;
        color: #666666;
        letter-spacing: 2px;
        .txt {
          width: 100%;
          //margin-top: 80px;
          text-align: center;
        }
        .author {
          width: 100%;
          margin-top: 40px;
          text-align: center;
        }
        .bottom {
          width: 100%;
          margin-top: 60px;
          display: flex;
          justify-content: space-around;
          .time {
            font-size: 28px;
            text-align: left;
          }
          .operate {
            display: flex;
            justify-content: center;
            .collect {
              width: 32px;
              height: 33px;
              background: url("../assets/images/collect.png") no-repeat;
              background-size: 100% auto;
              margin-right: 30px;
              cursor: pointer;
            }
            .collect.active {
              background: url("../assets/images/colect-active.png") no-repeat;
              background-size: 100% auto;
            }
            .share {
              width: 32px;
              height: 32px;
              background: url("../assets/images/share.png") no-repeat;
              background-size: 100% auto;
              margin-right: 40px;
              cursor: pointer;
            }
            .like-box {
              display: flex;
              .like {
                width: 32px;
                height: 32px;
                background: url("../assets/images/like.png") no-repeat;
                background-size: 100% auto;
                cursor: pointer;
              }
              .like.active {
                background: url("../assets/images/like-active.png") no-repeat;
                background-size: 100% auto;
              }
              .num-box {
                height: 100%;
                .num {
                  font-size: 16px;
                  color: #141414;
                  transform: scale(0.7);
                  margin-left: 3px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
