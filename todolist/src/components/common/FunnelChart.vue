<template>
  <div class="funnel-chart-wrapper">
    <div v-for="(item, index) in option.data" :key="item[0]" class="funnel-chart">
      <div v-if="index !== 0" class="funnel-text-swap">
        <div class="funnel-text">{{ formatText(index) }}</div>
        <img alt="arrowDown" height="27" src="../../assets/img/arrowDwon.png" width="18">
      </div>
      <div :ref="'bar'+index" :style="{ width: (index === 0) ?'100%' : 'fit-content' }"
           class="funnel-bar">
        {{ item[0] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FunnelChart",
  data() {
    return {
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({
        data: [
          ['总客流人数', 1],
          ['进店人数', 0.38],
          ['流人数', 0.28],
          ['流人数1', 0.18],
          ['流人数2', 0.08]
        ]
      }),
    }
  },
  watch: {
    option: {
      deep: true,
      handler: function () {
        this.$nextTick(() => {
          this.updateStyle();
        });
      }
    },
  },
  mounted() {
    this.updateStyle();
  },
  methods: {
    updateStyle() {
      const {firstBarElementWidth, maxBarWidth} = this.getBarWith();
      const styleData = this.getStyleData(this.option.data, firstBarElementWidth, maxBarWidth);
      this.option.data.forEach((_, index) => {
        const barElement = this.$refs[`bar${index}`][0];
        this.setBarStyle(barElement, index, styleData[index]);
      });
    },
    setBarStyle(barElement, index, style) {
      const dataLength = this.option.data.length;

      barElement.style.width = style.width;
      barElement.style.backgroundColor =
          index === dataLength - 1
              ? "rgba(59, 124, 255, 100%)"
              : `rgba(59, 124, 255, ${style.color})`;
      barElement.style.color = style.color <= 0.35 ? "#5B5B5B" : "white";
    },
    // 百分数, 小数点处理
    formatText(index) {
      const previousValue = index === 0 ? '1' : this.option.data[index - 1][1];
      const currentValue = this.option.data[index][1];
      const value = currentValue / previousValue * 100;
      return Number(value.toFixed(1)) + '%';

    },
    // 增加样式数据
    getStyleData(data, firstBarWidth, maxBarWidth) {
      const dataLength = data.length;
      const widthRatio = Math.pow(maxBarWidth / firstBarWidth, 1 / (dataLength - 1));
      const gradientRatio = Math.pow(0.1, 1 / (dataLength - 1));

      if (dataLength < 5 && (maxBarWidth / firstBarWidth) < 0.3) {
        const widthList = ["100%", "70%", "49%", "34.3%"];
        const colorList = [0.1, 0.3, 0.6, 1];

        return data.map((row, index) => ({
          category: row[0],
          value: data[index - 1],
          width: widthList[index],
          color: index === dataLength - 1 ? '1' : colorList[index],
        }));
      }

      return data.map((row, index) => {
        const widthPercentage = `${Math.pow(widthRatio, index) * 100}%`;
        const color = index === dataLength - 1 ? 1 : Math.pow(gradientRatio, dataLength - index - 1);

        return {
          category: row[0],
          value: row[1],
          width: widthPercentage,
          color: color,
        };
      });
    },
    getBarWith() {
      const firstBarElementWidth = this.$refs[`bar${0}`][0].getBoundingClientRect().width;
      const maxBarWidth = this.getMaxWidth();
      return {firstBarElementWidth, maxBarWidth};
    },
    getMaxWidth() {
      let maxWidth = 0;
      this.option.data.forEach((_, index) => {
        if (index !== 0) {
          const barElement = this.$refs[`bar${index}`][0];
          const barWidth = barElement.getBoundingClientRect().width;
          maxWidth = Math.max(maxWidth, barWidth);
        }
      });
      return maxWidth;
    }
  }
}
</script>

<style lang="scss" scoped>
.funnel-chart-wrapper {
  width: 100%;
  padding-bottom: 24px;
  height: fit-content;

  .funnel-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    width: 100%;
    height: 52px;
    background-color: #2b98bc;
    border-radius: 8px;
    font-size: 20px;
    font-family: 'Source Han Sans CN', 'SourceHanSansCN';
    font-weight: 400;
    box-shadow: 0 12px 12px 0 rgba(26, 117, 234, 0.15);
  }

  .funnel-chart {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .funnel-text-swap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding-left: 34px;
  }

  .funnel-text {
    font-size: 22px;
    font-family: 'Source Han Sans CN', 'SourceHanSansCN_Bold';
    font-weight: bold;
    margin: 16px 0;
  }

}
</style>