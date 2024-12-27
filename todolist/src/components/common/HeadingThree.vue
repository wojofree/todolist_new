<template>
<div class="heading-main dis-flex-row">
  <div class="heading-border"></div>
  <div class="heading-text">{{ option.text }}</div>
</div>
</template>

<script>
export default {
  name: "HeadingThree",
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
  padding: 16px 0 24px 0;
  gap: 14px;
  align-items: center;

  .heading-text {
    font-size: 33px;
    color: #006DDF;
    font-family: 'Source Han Sans CN', 'SourceHanSansCN_Medium';
    font-weight: 500;
    word-break: keep-all;
  }

  .heading-border {
    width: 6px;
    height: 32px;
    background: linear-gradient(180deg, #0C69FF 0%, rgba(12, 105, 255, 0.00) 100%);
  }

}
</style>