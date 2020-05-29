<template>
  <div class="chart" style="height:340px;max-width:420px" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

export default {
  name: "piechart",
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
          text: "各分类文章数",
          x: "center",
          y: "bottom",
          textStyle: {
            fontSize: 14,
            color: 'rgba(0,0,0,0.5)'
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          bottom: "32",
          data: ["影视", "电台", "阅读", "音乐", "其他"]
        },
        series: [
          {
            name: "文章发表数量",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: [
              { value: this.$props.summary.release.total.film, name: "影视" },
              { value: this.$props.summary.release.total.sound, name: "电台" },
              {
                value: this.$props.summary.release.total.reading,
                name: "阅读"
              },
              { value: this.$props.summary.release.total.music, name: "音乐" },
              { value: this.$props.summary.release.total.image, name: "其他" }
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600
          }
        ]
      });
    }
  }
};
</script>
