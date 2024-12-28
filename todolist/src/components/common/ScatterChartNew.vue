<template>
  <div class="bar-chart">
    <div ref="bar-main" :style="{ height: propsOption.height + 'px' }" class="bar-chart-main">
      <v-chart :key="chartKey" :option="chartOption" className="chart"/>
    </div>
    <div v-if="propsOption.heading !== null" class="bar-chart-heading">{{ propsOption.heading }}</div>
  </div>
</template>
<script setup>
import {reactive} from 'vue';
import {use} from 'echarts/core';
import {SVGRenderer} from 'echarts/renderers';
import {LineChart} from 'echarts/charts';
import {DatasetComponent, GridComponent, LegendComponent} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  SVGRenderer,
  LineChart,
  GridComponent,
  DatasetComponent,
  LegendComponent
]);

</script>
<script>
import {reactive} from "vue";
import {handleOption} from "./HandleEChartStyle.js";

export default {
  name: "ScatterChartNew",
  data() {
    return {
      formattedData: this.formatData(),
      propsOption: this.getPropsOptions(),
      chartOption: {},
      chartKey: 0
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({
        data: [
          ['category', '7月'],
          ['20-29岁', 27.64],
          ['30-39岁', 41.42],
          ['40-49岁', 19.06],
          ['50-59岁', 11.41],
          ['60-69岁', 1.33],
          ['70岁以上', 0.96]
        ]
      }),
    }
  },
  watch: {
    option: function () {
      this.formattedData = this.formatData();
      this.propsOption = this.getPropsOptions();
      this.chartOption = this.getChartOption();
      this.chartKey += 1;
    }
  },
  mounted() {
    this.chartOption = this.getChartOption();
  },
  methods: {
    // 组件参数
    getPropsOptions() {
      const defaultOptions = {
        data: [
          ['category', 'value'],
          ['20-29岁', 27.64],
          ['30-39岁', 41.42],
          ['40-49岁', 19.06],
          ['50-59岁', 11.41],
          ['60-69岁', 1.33],
          ['70岁以上', 0.96]
        ],
        heading: null, // 标题
        color: 0,  // 颜色，设计稿从左到右从上倒下顺序，0开始
        height: 350, // 图表高度
        yStart: 0, // y轴起点
        yEnd: undefined, // y轴终点
        xRotate: 0, // x轴label角度
        xInterval: 0, // x轴label间隔
        isPercentage: false, // csv数据是否为百分数
        isShowLegend: true, // 是否显示图例
      };

      // 参数类型及缺失项目
      let finalOptions = handleOption(defaultOptions, this.option)

      finalOptions.yLabel = finalOptions.isPercentage ? '{value}%' : '{value}';

      return finalOptions;
    },
    getColorList() {
      const transparency = this.propsOption.color < 4 ? 0.1 : 1;

      const originalColors = {
        color1: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#0C69FF'
          }, {
            offset: 1, color: `rgba(12, 105, 255, ${transparency})`
          }],
          global: false
        },
        color2: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#FF8538'
          }, {
            offset: 1, color: `rgba(255, 133, 56, ${transparency})`
          }],
          global: false
        },
        color3: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#13CA96'
          }, {
            offset: 1, color: `rgba(19, 202, 150, ${transparency})`
          }],
          global: false
        },
        color4: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#305AFF'
          }, {
            offset: 1, color: `rgba(48, 90, 255, ${transparency})`
          }],
          global: false
        },
        color5: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#8830FF'
          }, {
            offset: 1, color: `rgba(136, 48, 255, ${transparency})`
          }],
          global: false
        },
        color6: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#5FC8FF'
          }, {
            offset: 1, color: `rgba(95, 200, 255, ${transparency})`
          }],
          global: false
        },
        color7: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#C73FFF'
          }, {
            offset: 1, color: `rgba(199, 63, 255, ${transparency})`
          }],
          global: false
        },
        color8: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#FFB6C1'
          }, {
            offset: 1, color: `rgba(255, 182, 193, ${transparency})`
          }],
          global: false
        }
      };
      const colorSortLists = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [2, 3, 4, 5, 6, 7, 8, 1],
        [3, 4, 5, 6, 7, 8, 1, 2],
        [3, 4, 6, 7, 8, 5, 1, 2],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [2, 3, 4, 5, 6, 7, 8, 1],
        [3, 4, 5, 6, 7, 8, 1, 2],
        [3, 4, 6, 7, 8, 5, 1, 2],
      ];
      const colorList = colorSortLists[this.propsOption.color];
      const keys = colorList.map((item) => 'color' + (item));
      const newColors = [];
      keys.forEach((key) => {
        newColors.push(originalColors[key]);
      });

      return newColors;
    },
    formatData() {
      const data = this.option.data;
      return data.map((item, index) => {
        const prefix = index === 0 ? 'index' : index;
        return [prefix, ...item];
      });
    },
    getChartOption() {
      return reactive({
        dataset: {source: this.formattedData},
        animation: false,
        color: this.getColorList(),
        grid: {
          left: 0,
          right: 1,
          bottom: 5,
          top: 35,
          containLabel: true
        },
        legend: {
          show: this.propsOption.isShowLegend,
          right: '0',
          top: '0',
          itemWidth: 18,
          itemHeight: 3,
          orient: 'horizontal',
          icon: 'roundRect',
          textStyle: {
            fontSize: 12,
            fontFamily: 'Source Han Sans CN',
          }
        },
        xAxis: {
          type: 'category',
          deduplication: false,
          axisLabel: {
            fontSize: 12,
            fontFamily: 'Source Han Sans CN',
            formatter: (value) => this.formattedData[value][1] || '',
            interval: this.propsOption.xInterval, //自定义 默认0，空为null
            rotate: this.propsOption.xRotate, //自定义 默认0
          }
        },
        yAxis: {
          type: 'value',
          min: this.propsOption.yStart, // 自定义
          max: this.propsOption.yEnd, // 自定义
          axisLabel: {
            fontSize: 12,
            fontFamily: 'Source Han Sans CN',
            interval: 0,
            formatter: this.propsOption.yLabel, // %
          },
        },
        series: this.formattedData[0]
            .slice(2)
            .map((name) => ({
              name: name,
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 3
              },
              encode: {x: 'index', y: name},
            }))
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.bar-chart {
  font-family: 'Source Han Sans CN', 'SourceHanSansCN';
  width: 100%;
  height: fit-content;
  padding-bottom: 24px;

  &-main {
    width: 100%;
    overflow: hidden;
  }

  &-heading {
    font-size: 16px;
    color: #7C7C7C;
    margin-top: 12px;
  }
}
</style>