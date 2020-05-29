<template>
  <div class="chart" style="height:340px;max-width:420px" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

const animationDuration = 3000;

export default {
  name: "raddarchart",

  props: { summary: Object },
  data() {
    return {
      chart: null,
      max: { reader: 0, writer: 0 },
      fix: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$data.max.reader =
        Math.max(
          this.$props.summary.views.film,
          this.$props.summary.views.image,
          this.$props.summary.views.music,
          this.$props.summary.views.reading,
          this.$props.summary.views.sound
        ) * 1.2;
      this.$data.max.writer =
        Math.max(
          this.$props.summary.release.total.film,
          this.$props.summary.release.total.image,
          this.$props.summary.release.total.music,
          this.$props.summary.release.total.reading,
          this.$props.summary.release.total.sound
        ) * 1.2;
      this.$data.fix = this.$data.max.writer / this.$data.max.reader * 2;
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "用户阅读和作者发布偏好",
          x: "center",
          y: "bottom",
          textStyle: {
            fontSize: 14,
            color: 'rgba(0,0,0,0.5)'
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: "66%",
          center: ["50%", "42%"],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: "rgba(127,95,132,.3)",
              opacity: 1,
              shadowBlur: 45,
              shadowColor: "rgba(0,0,0,.5)",
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: "电台文章", max: this.$data.max.reader },
            { name: "阅读文章", max: this.$data.max.reader },
            { name: "影视文章", max: this.$data.max.reader },
            { name: "音乐文章", max: this.$data.max.reader },
            { name: "其它分享", max: this.$data.max.reader }
          ]
        },
        legend: {
          left: "center",
          bottom: "32",
          data: ["用户偏好", "作者偏好"]
        },
        series: [
          {
            type: "radar",
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 15,
                shadowColor: "rgba(0,0,0,.2)",
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              }
            },
            data: [
              {
                value: [
                  this.$props.summary.views.sound,
                  this.$props.summary.views.reading,
                  this.$props.summary.views.film,
                  this.$props.summary.views.music,
                  this.$props.summary.views.image
                ],
                name: "用户偏好"
              },
              {
                value: [
                  this.$props.summary.release.total.sound / this.$data.fix,
                  this.$props.summary.release.total.reading / this.$data.fix,
                  this.$props.summary.release.total.film / this.$data.fix,
                  this.$props.summary.release.total.music / this.$data.fix,
                  this.$props.summary.release.total.image / this.$data.fix
                ],
                name: "作者偏好"
              }
            ],
            animationDuration: animationDuration
          }
        ]
      });
    }
  }
};
</script>
