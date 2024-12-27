<template>
  <div class="bar-chart">
    <div ref="bar-main" :style="{ height: propsOption.height + 'px' }" class="bar-chart-main">
      <v-chart :key="chartKey" :option="chartOption" className="chart"/>
    </div>
  </div>
</template>
<script setup>
import {reactive} from 'vue';
import {use} from 'echarts/core';
import {SVGRenderer} from 'echarts/renderers';
import {BarChart} from 'echarts/charts';
import {DatasetComponent, GridComponent,} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DatasetComponent,
]);

</script>
<script>
import {reactive} from "vue";
import {getGElement} from "./HandleEChartStyle.js";

export default {
  name: "BarChartVertical",
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
          ['category', 'value'],
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
      this.formattedData = this.formatData()
      this.propsOption = this.getPropsOptions()
      this.chartOption = this.getChartOption()
      this.chartKey += 1
      this.updateSvgStyle()
    }
  },
  mounted() {
    this.chartOption = this.getChartOption()
    this.updateSvgStyle()
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
        color: 0,  // 颜色，设计稿从左到右从上倒下顺序，0开始
        height: 350, // 图表高度
        yStart: 0, // y轴起点
        yEnd: undefined, // y轴终点
        xRotate: 0, // x轴label角度
        xInterval: 0, // x轴label间隔
        isPercentage: false, // csv数据是否为百分数
      };

      // option类型判断，如果不符合要求切换回默认值；
      const handleOption = (value, defaultValue, checkBoolean = false) => {
        if (checkBoolean) {
          if (typeof value !== 'boolean') {
            return defaultValue;
          }
        } else {
          if (
              value === '' ||
              value === null ||
              value === 'null' ||
              value === undefined ||
              isNaN(parseFloat(value)) ||
              !isFinite(value)
          ) {
            return defaultValue;
          }
        }
        return value;
      };

      let finalOptions = Object.entries(defaultOptions).reduce(
          (options, [key, defaultValue]) => {
            options[key] = handleOption(this.option[key], defaultValue, key === 'isPercentage');
            return options;
          },
          {
            ...defaultOptions,
            ...this.option,
            data: this.option.data || defaultOptions.data,
          });

      finalOptions.height = parseInt(finalOptions.height, 10) + 100

      return finalOptions
    },
    formatData() {
      const data = this.option.data
      return data.map((item, index) => {
        const prefix = index === 0 ? 'index' : index;
        return [prefix, ...item];
      });
    },
    getColorList() {
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
            offset: 1, color: 'rgba(12, 105, 255, 0.00)'
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
            offset: 1, color: 'rgba(255, 133, 56, 0.00)'
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
            offset: 1, color: 'rgba(19, 202, 150, 0.00)'
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
            offset: 1, color: 'rgba(48, 90, 255, 0.00)'
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
            offset: 1, color: 'rgba(136, 48, 255, 0.00)'
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
            offset: 1, color: 'rgba(95, 200, 255, 0.00)'
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
            offset: 1, color: 'rgba(199, 63, 255, 0.00)'
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
            offset: 1, color: 'rgba(255, 182, 193, 0.00)'
          }],
          global: false
        }
      };
      const colorSortLists = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [2, 3, 4, 5, 6, 7, 8, 1],
        [3, 4, 5, 6, 7, 8, 1, 2],
        [3, 4, 6, 7, 8, 5, 1, 2],
        [2],
        [1],
        [3],
        [6],
        [7],
        [9],
      ];
      const colorList = colorSortLists[this.propsOption.color];
      const keys = colorList.map((item) => 'color' + (item));
      const newColors = [];
      keys.forEach((key) => {
        newColors.push(originalColors[key]);
      });

      return newColors;
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
          top: 100,
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: true,
            type: 'category',
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 18,
              fontFamily: 'Source Han Sans CN',
              interval: this.propsOption.xInterval, // 自定义
              formatter: (value) => this.formattedData[value][1] || '',
              rotate: this.propsOption.xRotate, //自定义 默认0
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: this.propsOption.yStart, //自定义
            max: this.propsOption.yEnd, // 自定义
            position: 'left',
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: [5, 6],
                dashOffset: 5
              }
            }
          }],
        series: this.formattedData[0]
            .slice(2)
            .map((item) => ({
              name: item,
              colorBy: 'data',
              type: 'bar',
              yAxisIndex: 0,
              label: {
                show: true,
                position: 'top',
                valueAnimation: true,
                formatter: this.propsOption.isPercentage ? '{@value}%' : '{@value}', // 符号自定义
                offset: [0, -5],
                fontSize: 18,
                fontFamily: 'Source Han Sans CN',
              },
              barMaxWidth: 36,
              encode: {x: 'index', y: item},
            }))
      });
    },
    updateSvgStyle() {
      const chartElement = this.$refs["bar-main"]
      this.$nextTick(() => {
        this.getGElement(chartElement)
      });
    },
    getGElement,
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