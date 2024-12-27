<template>
  <div class="heading-main dis-flex-row">
    <div class="heading-left dis-flex-row">
      <div class="heading-left-hashtag">#</div>
      <div class="heading-left-number">{{ option.number }}</div>
    </div>
    <div class="heading-right dis-flex-row">
      <div class="heading-right-border"></div>
      <div class="heading-right-text">{{ option.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadingOne",
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({text: '客流分析溯源', number: '01'}),
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
  gap: 6px;
  padding: 16px 0;
  align-items: flex-end;

  .heading-left {
    color: #006DDF;
    font-family: 'bahnschrift', serif;
    gap: 2px;
    align-items: flex-start;

    &-hashtag {
      font-size: 46px;
      font-weight: lighter;
    }

    &-number {
      font-size: 88px;
      text-align: center;
      height: 106px;
    }
  }

  .heading-right {
    align-items: flex-end;
    padding-bottom: 13px;
    gap: 14px;

    &-border {
      width: 3px;
      height: 58px;
      background-color: #000000;
    }

    &-text {
      font-size: 45px;
      color: #000000;
      font-family: 'Source Han Sans CN', 'SourceHanSansCN_Bold';
      font-weight: bold;
      line-height: 1.1;
      word-break: keep-all;
    }
  }


}
</style>