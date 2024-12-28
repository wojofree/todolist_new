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
import {ScatterChart} from 'echarts/charts';
import {DatasetComponent, GridComponent} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  SVGRenderer,
  ScatterChart,
  GridComponent,
  DatasetComponent,
]);

</script>
<script>
import {reactive} from "vue";
import {handleOption} from "./HandleEChartStyle.js";

export default {
  name: "ScatterChartNew",
  data() {
    return {
      propsOption: this.getPropsOptions(),
      chartOption: {},
      chartKey: 0,
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({
        data: [
          ['date', '0', '1a', '1a', '1a', '4a', '5a'],
          ['2024/8/1', '22', '2', '1', '1', '1', '1'],
          ['2024/8/2', '1', '2', '1', '1', '1', '1'],
          ['2024/8/4', '1', '3', '1', '1', '1', '1'],
          ['2024/8/5', '1', '3', '1', '1', '1', '1'],
          ['2024/8/6', '1', '4', '1', '1', '1', '1'],
        ]
      }),
    }
  },
  watch: {
    option: {
      deep: true,
      handler: function () {
        this.propsOption = this.getPropsOptions();
        this.chartOption = this.getChartOption();
        this.chartKey += 1;
      }
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
          ['date', '12a', '1a', '1a', '1a', '4a', '5a'],
          ['2024/8/1', '22', '2', '1', '1', '1', '1'],
          ['2024/8/2', '1', '2', '1', '1', '1', '1'],
          ['2024/8/4', '1', '3', '1', '1', '1', '1'],
          ['2024/8/5', '1', '3', '1', '1', '1', '1'],
          ['2024/8/6', '1', '4', '1', '1', '1', '1'],
        ],
        color: 0,  // 颜色，设计稿从左到右从上倒下顺序，0开始
        height: 800, // 图表高度
      };

      let finalOptions = handleOption(defaultOptions, this.option);

      finalOptions.data = this.formatData(finalOptions.data);

      const chartHeight = finalOptions.height;
      const yCount = this.option.data.length - 1;
      const maxSymbolHeight = (chartHeight - (yCount * 2)) / yCount;  // 上下留一像素间距

      const maxValue = (() => {
        return this.option.data.slice(1).reduce((maxVal, row) => {
          return Math.max(maxVal, Math.max(...row.slice(1).map(Number)));
        }, -Infinity);
      })();

      finalOptions.unitSize = maxSymbolHeight / maxValue;

      // 参数类型及缺失项目
      return finalOptions;
    },
    getColorList() {
      const originalColors = [
        '#BDE0EA',
        '#305AFF',
        '#E74C3C',
        '#13CA96',
        '#FFB6C1',
        '#AE7ED4',
        '#FAC858',
        '#FAC858',
      ];

      return originalColors[this.propsOption.color];
    },
    formatData(data) {
      const output = [];
      data.slice(1).forEach((row, yIndex) => {
        row.forEach((value, xIndex) => {
          output.push({
            x: xIndex,
            y: yIndex + 1,
            value: xIndex === 0 ? 0 : value,
          });
        });
      });

      return output;
    },
    getChartOption() {
      return reactive({
        dataset: {
          source: this.propsOption.data,
        },
        color: this.getColorList(),
        animation: false,
        grid: {
          left: 0,
          right: 7,
          bottom: 5,
          top: 5,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 8,
            fontFamily: 'Source Han Sans CN',
            formatter: (value) => value === '0' ? '' : this.option.data[0][value] || '',
          },
          axisTick: {
            lineStyle: {
              color: '#E0E6F1',
            }
          },
          axisLine: {
            show: false
          },
          boundaryGap: false,
          splitLine: {
            show: true
          },
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 8,
            fontFamily: 'Source Han Sans CN',
            formatter: (value) => this.option.data[value][0] || '',
          },
        },
        series: [
          {
            type: 'scatter',
            datasetIndex: 0,
            symbol: 'rect',
            symbolSize: (item) => item.value * this.propsOption.unitSize || '',
            encode: {x: 'x', y: 'y'},
          },
        ],
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
}
</style>