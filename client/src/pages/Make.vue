<template>
  <div class="make">
    <div class="back" @click="goBack"></div>
    <div class="container">
      <div class="cover">
        <img v-if="image_url===''" src='../assets/images/reader-background.png' />
        <img v-else :src="image_url" />
        <div class="main">
          <div class="tip">Good Day</div>
          <div class="icon"></div>
          <div class="tip">点击更改图片</div>
          <input type="file" accept="image/jpg, image/jpeg, image/png" @change="chooseImage" />
        </div>
      </div>
      <div class="info">
        <div class="place">
          <span class="icon"></span>
          {{!!user_info.ip_location ? user_info.ip_location.city : 'Earth' }}
        </div>
        <div class="username">{{user_info.username}}</div>
      </div>
      <div class="txt">
        <textarea class="textarea" v-model="text"></textarea>
      </div>
      <div class="btns">
        <div class="release" @click="handleRelease">
          <div class="icon"></div>
          <div>发布</div>
        </div>
        <div class="save" @click="handleSave">
          <div class="icon"></div>
          <div>保存</div>
        </div>
      </div>
    </div>

    <transition :name="resultTransition">
      <make-result v-show="showResult" :url="resultUrl" @back="resultBack"></make-result>
    </transition>
  </div>
</template>

<script>
import Exif from "exif-js";
import MC from "mcanvas";
import moment from "moment";
import { mapState, mapGetters, mapMutations } from "vuex";
import types from "../store/types";
import mixin from "../mixins";
import MakeResult from "./MakeResult";
export default {
  name: "make",
  mixins: [mixin],
  components: {
    MakeResult
  },
  data() {
    return {
      content: "",
      resultTransition: "move-right-to-left",
      showResult: false,
      resultUrl: "",
      text: "",
      image_url: ""
    };
  },
  created() {
    document.getElementById("app").style.backgroundColor = `#fff`;
    console.log(this.user_info);
  },
  beforeDestroy() {
    document.getElementById("app").style.backgroundColor = `rgb(240,240,240)`;
  },
  destroyed() {
    document.getElementById("app").style.backgroundColor = `rgb(240,240,240)`;
  },
  computed: {
    ...mapGetters(["user_info"])
  },
  methods: {
    goBack() {
      document.getElementById("app").style.backgroundColor = `rgb(240,240,240)`;
      this.$router.push("/me");
    },
    handleRelease() {
      if (this.$data.text.length > 300) {
        this.$toast("文字有点多，删减一点.");
        return;
      }
      this.showLoading();
      this.upload(this.image_url, data => {
        this.$axios
          .addImageArticle({
            author_id: this.user_info._id,
            content: this.$data.text,
            image_url: data.result_url
          })
          .then(res => {
            this.hideLoading();
            this.$toast("Reader发布成功", "bottom");
            console.log(res);
          })
          .catch(error => {
            this.hideLoading();
            this.$toast("Reader发布失败", "bottom");
            console.log(error);
          });
        // this.$axios.addImageArticle()
      });
    },
    handleSave() {
      this.showLoading();
      this.content = document.querySelectorAll(".textarea")[0].innerHTML;
      if (this.content.length > 300) {
        this.$toast("文字有点多，删减一点.");
        return;
      }
      const time = this.moment(Date.now());
      let originImageW, originImageH;
      const newImage = new Image();
      newImage.crossOrigin = "*";
      newImage.onload = data => {
        originImageW = newImage.width;
        originImageH = newImage.height;
        let mc = new MC({
          width: 1000,
          height: (1000 * originImageH) / originImageW + 800,
          backgroundColor: "#fff"
        });
        mc.add(newImage, {
          width: "100%",
          crop: {
            x: 0,
            y: 0,
            width: "100%",
            height: "100%"
          },
          pos: {
            x: 0,
            y: 0
          }
        })
          .text(
            `${time} / ${
              this.user_info ? this.user_info.ip_location.city : "Earth"
            }`,
            {
              width: "95%",
              align: "left",
              pos: {
                x: 20,
                y: (1000 * originImageH) / originImageW + 20
              },
              normalStyle: {
                color: "#000",
                font: "25px Microsoft YaHei,sans-serif",
                lineHeight: 40
              }
            }
          )
          .text(`${this.user_info ? this.user_info.username : "Reader"}`, {
            width: "95%",
            align: "center",
            pos: {
              x: 20,
              y: (1000 * originImageH) / originImageW + 500
            },
            normalStyle: {
              color: "#000",
              font: "30px Microsoft YaHei,sans-serif",
              lineHeight: 40
            }
          })
          .text(this.content, {
            width: "90%",
            align: "center",
            pos: {
              x: "center",
              y: (1000 * originImageH) / originImageW + 120
            },
            normalStyle: {
              color: "#000",
              font: "35px Microsoft YaHei,sans-serif",
              lineHeight: 45
            }
          })
          .add(`http://mafei.ostqa.cn/logo.png`, {
            width: "30%",
            pos: {
              x: "center",
              y: (1000 * originImageH) / originImageW + 680
            }
          })
          .draw(b64 => {
            this.upload(b64, res => {
              this.resultUrl = res.result_url;
              this.preload(this.resultUrl).done(data => {
                this.hideLoading();
                this.showResultPage();
              });
            });
          });
      };
      newImage.src = this.image_url;
    },
    chooseImage(event) {
      const file = event.target.files[0] || e.dataTransfer.files[0];
      if (!file) return;
      if (this.readFileSize(file).indexOf("MB") > -1) {
        if (parseInt(this.readFileSize(file)) > 10) {
          this.$toast("图片太大哦");
          return;
        }
      }
      this.getImageBase(file, originB64 => {
        this.image_url = originB64;
      });
    },
    getImageBase(file, callback) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let base64 = this.result;
          let img = new Image();
          img.src = base64;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (base64.length <= 100 * 1024) {
            callback && callback(base64);
          } else {
            img.onload = () => {
              let data = self.compress(img, Orientation);
              callback && callback(data);
            };
          }
        };
      }
    },
    resultBack() {
      this.hideResultPage();
    },
    showResultPage() {
      this.resultTransition = "move-right-to-left";
      this.showResult = true;
    },
    hideResultPage() {
      this.resultTransition = "move-left-to-right";
      this.showResult = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.make {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .back {
    width: 18px;
    height: 35px;
    background: url("../assets/images/back.png") no-repeat;
    background-size: 100% auto;
    position: absolute;
    left: 28px;
    top: 25px;
    z-index: 1;
  }
  .container {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    overflow: auto;
    .cover {
      width: 100%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        /*min-height: 500px;*/
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        .icon {
          width: 64px;
          height: 64px;
          background: url("../assets/images/image-icon.png") no-repeat;
          background-size: 100% auto;
        }
        .tip {
          text-align: center;
          font-size: 25px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 10px;
        }
        input[type="file"] {
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          cursor: pointer;
        }
      }
    }
    .info {
      padding: 28px;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      .place {
        .icon {
          width: 32px;
          height: 32px;
          display: inline-block;
          vertical-align: -5px;
          background: url("../assets/images/place-icon.png") no-repeat;
          background-size: 100% auto;
        }
      }
    }
    .txt {
      width: 100%;
      height: 200px;
      .textarea {
        width: 100%;
        height: 100%;
        border: 0;
        min-height: 100px;
        max-height: 500px;
        padding: 20px;
        box-sizing: border-box;
        outline: 0;
        font-size: 30px;
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: auto;
        _overflow-y: visible;
        text-align: left;
        -webkit-user-modify: read-write-plaintext-only;
      }
    }
    .btns {
      position: absolute;
      left: 0;
      bottom: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .release,
      .save {
        width: 100px;
        height: 100px;
        padding: 5px;
        border-radius: 50%;
        box-shadow: 0 0 10px 0px #999;
        font-size: 25px;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .release {
        margin-right: 200px;
        .icon {
          width: 50px;
          height: 50px;
          background: url("../assets/images/release-icon.png") no-repeat;
          background-size: 100% auto;
        }
      }
      .save {
        .icon {
          width: 50px;
          height: 50px;
          background: url("../assets/images/save-icon.png") no-repeat;
          background-size: 100% auto;
        }
      }
    }
  }
}
</style>
