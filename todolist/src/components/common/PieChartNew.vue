<template>
  <div class="bar-chart">
    <div ref="bar-main" class="bar-chart-main" style="height: 850px;">
      <v-chart :key="chartKey" :option="chartOption" className="chart"/>
    </div>
  </div>
</template>
<script setup>
import {reactive} from 'vue';
import {use} from 'echarts/core';
import {SVGRenderer} from 'echarts/renderers';
import {PieChart} from 'echarts/charts';
import {DatasetComponent, GridComponent,} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  SVGRenderer,
  PieChart,
  GridComponent,
  DatasetComponent,
]);

</script>
<script>
import {reactive} from "vue";
import {updateSVG, handleOption} from "./HandleEChartStyle.js";

export default {
  name: "PieChartNew",
  data() {
    return {
      propsOption: this.getPropsOptions(),
      chartOption: {},
      chartKey: 0,
      barMainSize: 670
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({}),
    }
  },
  watch: {
    option: {
      deep: true,
      handler: function () {
        this.propsOption = this.getPropsOptions();
        this.updateChart();
      }
    }
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    updateChart() {
      this.$nextTick(() => {

        const mainElement = this.$refs["bar-main"];
        const size = mainElement.getBoundingClientRect().width;
        const minWidth = Math.min(315, this.propsOption.width) // 限制小饼图最大宽度
        mainElement.style.height = mainElement.style.width = this.propsOption.width !== null ? minWidth + 'px': size + 'px';

        this.chartOption = this.getChartOption();
        this.chartKey += 1;
        this.updateSvgStyle();
      });
    },
    // 组件参数
    getPropsOptions() {
      const defaultOptions = {
        data: [
          ['category', 'value'],
          ['示例数据1', 127.64],
          ['示例数据2', 41.42],
          ['示例数据3', 19.06],
          ['示例数据4', 11.41],
          ['示例数据5', 1.33],
          ['示例数据6', 0.96]
        ],
        color: 0,  // 颜色，设计稿从左到右从上倒下顺序，0开始
        width: null, // 图表宽度，大饼图不传或传空；
        isHalf: false, // 半圆
        labelWidth: undefined, // label宽度
      };

      // 参数类型及缺失项目
      let finalOptions = handleOption(defaultOptions, this.option);

      finalOptions.itemStyle = finalOptions.width !== null ?
          {
            borderRadius: 4,
            borderColor: '#ffffff',
            borderWidth: 1
          } :
          finalOptions.isHalf ? {} :
              {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              };

      finalOptions.startAngle = finalOptions.isHalf ? 180 : 0;
      finalOptions.radius = finalOptions.width !== null ? ["25%", "55%"] : ["40%", "75%"];
      finalOptions.labelLine = finalOptions.width !== null ? 5 : 10;

      return finalOptions;
    },
    getColorList() {

      if (this.propsOption.color === 0 ) {
        return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
      }

      const originalColors = {
        color1: '#305AFF',
        color2: '#13CA96',
        color3: '#FAC858',
        color4: '#66BEEC',
        color5: '#AE7ED4',
        color6: '#E74C3C',
        color7: '#FFB6C1',
        color8: '#ADD8E6',
        color9: '#FF9900',
        color10: '#99CCFF',
      };
      const colorSortLists = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [7, 8, 9, 3, 1, 2, 5, 4, 6, 10],
        [5, 7, 4, 3, 8, 9, 1, 2, 6, 10],
        [9, 10, 3, 5, 7, 4, 8, 1, 2, 6],
        [3, 4, 5, 9, 2, 7, 8, 1, 6, 10],
      ];
      const colorList = colorSortLists[this.propsOption.color - 1];
      const keys = colorList.map((item) => 'color' + (item));
      const newColors = [];
      keys.forEach((key) => {
        newColors.push(originalColors[key]);
      });

      return newColors;
    },
    getChartOption() {
      return reactive({
        dataset: {
          source: this.propsOption.data
        },
        color: this.getColorList(), // 颜色选择
        animation: false,
        series: [
          {
            type: "pie",
            radius: this.propsOption.radius,
            startAngle: this.propsOption.startAngle,
            endAngle: 360,
            voidLabelOverlap: false,
            itemStyle: this.propsOption.itemStyle,
            labelLine: {
              length: this.propsOption.labelLine,
              length2: this.propsOption.labelLine,
              showAbove: true
            },
            label: {
              show: true,
              color: '#000000',
              width: this.propsOption.labelWidth,
              fontSize: 11,
              formatter: '{b}: {d}%',
              position: 'outside',
              minMargin: 2,
              fontFamily: 'Source Han Sans CN',
              overflow: 'break',
              rotate: 0,
            },
          }
        ]
      });
    },
    updateSvgStyle() {
      // label超出坐标系顶部异常处理
      const chartElement = this.$refs["bar-main"];
      this.$nextTick(() => {
        updateSVG(chartElement);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.bar-chart {
  width: 100%;
  height: fit-content;
  padding-bottom: 24px;

  &-main {
    width: 100%;
    overflow: hidden;
  }
}
</style>