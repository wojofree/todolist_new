<template>
  <div ref="bar-main" class="bar-chart-wrapper">
    <div class="bar-chart-content">
      <div v-for="(item, index) in chartOption.data" :key="item[0]" class="bar-chart dis-flex">
        <div class="bar-chart-item dis-flex" :style="{background: barColorList [chartOption.color]}">
          <div :ref="'category'+index" class="bar-chart-category">{{ item[0] }}</div>
          <div :ref="'bar'+index" class="bar-chart-width"></div>
        </div>
      <div :ref="'label'+index" class="bar-chart-label" :style="{color: labelColorList [chartOption.color]}">{{ item[1] }}{{ chartOption.isPercentage ? '%' : '' }}</div>
    </div>
    </div>
    <div v-if="chartOption.text !== null"  class="bar-text">{{ chartOption.text }}</div>
    <div v-if="chartOption.text !== null" class="bar-heading">{{ chartOption.heading }}</div>
  </div>
</template>

<script>
import {handleOption} from "./HandleEChartStyle.js";

export default {
  name: "BarChartHorizontal",
  data() {
    return {
      chartOption: this.getChartOptions(),
      labelColorList: [
          '#0C69FF',
          '#4E90FF',
          '#13CA96',
          '#FF8538',
          '#5FC8FF',
          '#FFB6C1',
      ],
      barColorList:[
          'linear-gradient(90deg, rgba(12, 105, 255, 0.00) 14.4%, #0C69FF 100%)',
          '#4E90FF',
          'linear-gradient(90deg, rgba(19, 202, 150, 0.00) 14.4%, #13CA96 100%)',
          'linear-gradient(90deg, rgba(255, 133, 56, 0.00) 14.4%, #FF8538 100%)',
          'linear-gradient(90deg, rgba(95, 200, 255, 0.00) 14.4%, #5FC8FF 100%)',
          'linear-gradient(90deg, rgba(255, 182, 193, 0.00) 14.4%, #FFB6C1 100%)'
      ],
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
        this.chartOption = this.getChartOptions();
        this.$nextTick(() => {
          this.updateStyle();
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateStyle();
    });
  },
  methods: {
    // 组件参数
    getChartOptions() {
      const defaultOptions = {
        data: [
          ['示例数据1', 1],
          ['示例数据2', 1.38],
          ['示例数据3', 0.28],
          ['示例数据4', 0.18],
          ['示例数据5', 0.08]
        ], // 没有表头
        color: 0,   // 颜色，设计稿从左到右从上倒下顺序，0开始
        text: null,   // 说明文本
        heading: null,   // 下标题
        isPercentage: false, // csv数值是否为百分数
      };

      return handleOption(defaultOptions, this.option)
    },
    updateStyle() {
      const categoryMaxWidth = this.getMaxWidth('category');
      const labelMaxWidth = this.getMaxWidth('label');
      const mainWidth = this.$refs["bar-main"].getBoundingClientRect().width;
      const maxAvailableBarWidth = mainWidth - categoryMaxWidth - labelMaxWidth - 16
      const newData = this.transformData(this.chartOption.data, maxAvailableBarWidth);

      this.chartOption.data.forEach((_, index) => {
        const categoryElement = this.$refs[`category${index}`][0];
        const labelElement = this.$refs[`label${index}`][0];
        const barElement = this.$refs[`bar${index}`][0];

        this.setBarStyle(categoryElement, categoryMaxWidth);
        this.setBarStyle(labelElement, labelMaxWidth);
        this.setBarStyle(barElement, newData[index].width);
      });
    },
    transformData(data, maxWidth) {
      const maxVal = data.reduce((maxValue, current) => {
        return Math.max(maxValue, current[1]);
      }, 0);

      return data.map((row) => {
        const newWidth = maxWidth / maxVal * row[1];

        return {
          category: row[0],
          value: row[1],
          width: newWidth,
        };
      });
    },
    setBarStyle(element, width) {
      element.style.width = width + 'px';
    },
    getMaxWidth(refName) {
      let maxWidth = 0;
      this.chartOption.data.forEach((_, index) => {
        const barElement = this.$refs[`${refName}${index}`][0];
        const barWidth = barElement.getBoundingClientRect().width;
        maxWidth = Math.max(maxWidth, barWidth);
      });
      return maxWidth;
    }
  }
}
</script>

<style lang="scss" scoped>
.dis-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bar-chart-wrapper {
  font-family: 'Source Han Sans CN', 'SourceHanSansCN';
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 24px;
  height: fit-content;
  gap: 12px;

  .bar-chart-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bar-chart {
    width: 100%;
    gap: 16px;

    &-item {
      height: 27px;
      font-size: 16px;
    }

    &-category {
      color: #000000;
      text-align: left;
      width: fit-content;
    }

    &-width {
      width: 300px;
      height: 27px;
    }

    &-label {
      text-align: left;
      font-size: 16px;
      width: fit-content;
    }
  }

  .bar-text {
    color: #0C69FF;
    font-size: 14px;
    text-align: center;
  }

  .bar-heading {
    color: #7C7C7C;
    font-size: 16px;
    text-align: center;
  }
}
</style>