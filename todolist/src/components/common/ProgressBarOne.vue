<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar">
      <div class="progress-item"></div>
    </div>
    <div class="corner-marker">
      <div>{{ option.leftCornerText }}</div>
      <div>{{ option.rightCornerText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBarOne",
  data() {
    return {
      progressWidth: '0',
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({value: 0.95, leftCornerText: '左标', rightCornerText: '右标'}),
    }
  },
  watch: {
    option: function (newValue) {
      this.progressWidth = newValue.value * 100 + '%'
    },
  },
  mounted() {
    this.progressWidth = this.option.value * 100 + '%'
  }
}
</script>

<style scoped>

.progress-bar-wrapper {
  width: 100%;
  padding-bottom: 24px;
  height: fit-content;

  .progress-bar {
    width: 100%;
    background-color: #E0ECFF;
    height: 24px;
    border-radius: 17px;
  }

  .progress-item {
    width: v-bind(progressWidth);
    background-color: #0C69FF;
    height: 24px;
    border-radius: 17px;
  }

  .corner-marker {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-family: 'SourceHanSansCN_Bold', serif;
  }
}
</style>