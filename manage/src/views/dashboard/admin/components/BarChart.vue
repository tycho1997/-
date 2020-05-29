<template>
  <div class="chart" style="height:340px;max-width:420px" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
const animationDuration = 6000;

export default {
  name: "barchart",
  props: { summary: Object },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
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
          text: "近7天文章发表情况",
          x: "center",
          y: "bottom",
          textStyle: {
            fontSize: 14,
            color: "rgba(0,0,0,0.5)"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: "2%",
          right: "2%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              this.$props.summary.release.last7Day[6].date,
              this.$props.summary.release.last7Day[5].date,
              this.$props.summary.release.last7Day[4].date,
              this.$props.summary.release.last7Day[3].date,
              this.$props.summary.release.last7Day[2].date,
              this.$props.summary.release.last7Day[1].date,
              this.$props.summary.release.last7Day[0].date
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "阅读文章",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [
              this.$props.summary.release.last7Day[6].reading,
              this.$props.summary.release.last7Day[5].reading,
              this.$props.summary.release.last7Day[4].reading,
              this.$props.summary.release.last7Day[3].reading,
              this.$props.summary.release.last7Day[2].reading,
              this.$props.summary.release.last7Day[1].reading,
              this.$props.summary.release.last7Day[0].reading
            ],
            animationDuration
          },
          {
            name: "音乐文章",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [
              this.$props.summary.release.last7Day[6].music,
              this.$props.summary.release.last7Day[5].music,
              this.$props.summary.release.last7Day[4].music,
              this.$props.summary.release.last7Day[3].music,
              this.$props.summary.release.last7Day[2].music,
              this.$props.summary.release.last7Day[1].music,
              this.$props.summary.release.last7Day[0].music
            ],
            animationDuration
          },
          {
            name: "电影文章",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [
              this.$props.summary.release.last7Day[6].film,
              this.$props.summary.release.last7Day[5].film,
              this.$props.summary.release.last7Day[4].film,
              this.$props.summary.release.last7Day[3].film,
              this.$props.summary.release.last7Day[2].film,
              this.$props.summary.release.last7Day[1].film,
              this.$props.summary.release.last7Day[0].film
            ],
            animationDuration
          },
          {
            name: "电台文章",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [
              this.$props.summary.release.last7Day[6].sound,
              this.$props.summary.release.last7Day[5].sound,
              this.$props.summary.release.last7Day[4].sound,
              this.$props.summary.release.last7Day[3].sound,
              this.$props.summary.release.last7Day[2].sound,
              this.$props.summary.release.last7Day[1].sound,
              this.$props.summary.release.last7Day[0].sound
            ],
            animationDuration
          },
          {
            name: "其它文章",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: [
              this.$props.summary.release.last7Day[6].image,
              this.$props.summary.release.last7Day[5].image,
              this.$props.summary.release.last7Day[4].image,
              this.$props.summary.release.last7Day[3].image,
              this.$props.summary.release.last7Day[2].image,
              this.$props.summary.release.last7Day[1].image,
              this.$props.summary.release.last7Day[0].image
            ],
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
