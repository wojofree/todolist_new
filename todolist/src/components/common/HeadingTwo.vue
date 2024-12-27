<template>
<div class="heading-main dis-flex-row">
  <div class="heading-text">{{ option.text }}</div>
  <div class="heading-img"></div>
</div>
</template>

<script>
export default {
  name: "HeadingTwo",
  data() {
    return {
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({text: '客流分析溯源'}),
    }
  }
}
</script>

<style lang="scss" scoped>
.dis-flex-row {
  display: flex;
  flex-direction: row;
}

.heading-main {
  padding: 16px 0 8px 0;

  .heading-text {
    height: 48px;
    background-color: #006DDF;
    padding-left: 12px;
    font-size: 33px;
    color: #ffffff;
    font-family: 'Source Han Sans CN', 'SourceHanSansCN';
    word-break: keep-all;
  }

  .heading-img {
    width: 40px;
    height: 48px;
    background: url('../../assets/img/headingTwoIMG.png') no-repeat right 0 top;
    background-size: 40px;
  }

}
</style>