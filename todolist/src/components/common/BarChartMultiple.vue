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
import {BarChart} from 'echarts/charts';
import {DatasetComponent, GridComponent, LegendComponent} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DatasetComponent,
  LegendComponent
]);

</script>
<script>
import {reactive} from "vue";
import {formatData, handleOption} from "./HandleEChartStyle.js";

export default {
  name: "BarChartMultiple",
  data() {
    return {
      propsOption: this.getPropsOptions(),
      chartOption: {},
      chartKey: 0
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({ }),
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
          ['category', 'value'],
          ['示例数据1', 27.64],
          ['示例数据2', 41.42],
          ['示例数据3', 19.06],
          ['示例数据4', 11.41],
          ['示例数据5', 1.33],
          ['示例数据6', 0.96]
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
      let finalOptions = handleOption(defaultOptions, this.option);
      finalOptions.data = formatData(finalOptions.data);

      finalOptions.yLabel = finalOptions.isPercentage ? '{value}%' : '{value}';

      return finalOptions;
    },
    getColorList() {
      const originalColors = {
        color1: '#87CEFA',
        color2: '#FAC858',
        color3: '#13CA96',
        color4: '#AE7ED4',
        color5: '#E74C3C',
        color6: '#FFB6C1',
      };
      const colorSortLists = [
        [1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 1],
        [3, 4, 5, 6, 1, 2],
        [4, 5, 6, 1, 2, 3],
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
        dataset: {source: this.propsOption.data},
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
          itemHeight: 11,
          itemWidth: 6,
          orient: 'horizontal',
          textStyle: {
            fontSize: 12,
            fontFamily: 'Source Han Sans CN',
          },
          top: '0'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 12,
            fontFamily: 'Source Han Sans CN',
            interval: this.propsOption.xInterval, // 自定义
            formatter: (value) => this.propsOption.data[value][1] || '',
            rotate: this.propsOption.xRotate, //自定义 默认0
          },
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
        series: this.propsOption.data[0]
            .slice(2)
            .map((item) => ({
              name: item,
              type: 'bar',
              datasetIndex: 0,
              barMaxWidth: 28.8,
              encode: {x: 'index', y: item},
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
    text-align: center;
  }
}
</style>