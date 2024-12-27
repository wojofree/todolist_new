<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar">
      <div class="progress-item">
        <div class="corner color-white">
          <div class="corner-text">
            {{ leftText }}
          </div>
          <div class="corner-value">
            {{ leftNumber }}</div>
          </div>
      </div>
      <div class="progress-interval"></div>
    </div>
    <div class="right-corner">
      <div class="corner color-blue">
          <div class="corner-text">
            {{ rightText }}
          </div>
          <div class="corner-value">
            {{ rightNumber }}</div>
          </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBarTwo",
  data() {
    return {
      progressWidth: '0',
      leftNumber: 0,
      rightNumber: 0,
      leftText: '',
      rightText: '',
    }
  },
  props: {
    option: {
      type: Object,
      required: false,
      default: () => ({ value: 0.9, leftCornerText: '左标',  rightCornerText: '右标'}),
    }
  },
  watch: {
    option: function () {
      this.updateData()
    },
  },
  mounted() {
    this.updateData()
  },
  methods: {
    formatValue(value) {
      return Number(value.toFixed(1))
    },
    updateData() {
      const _value = this.formatValue(this.option.value * 100)

      if (_value < 50) {
        this.rightNumber = _value + '%'
        this.progressWidth = this.leftNumber = this.formatValue(100 - _value) + '%'
        this.leftText = this.option.rightCornerText
        this.rightText = this.option.leftCornerText
      } else {
        this.leftNumber = this.progressWidth = _value + '%'
        this.rightNumber = this.formatValue(100 - _value) + '%'
        this.rightText = this.option.rightCornerText
        this.leftText = this.option.leftCornerText
      }
    }
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
    background-color: #0C69FF;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .progress-item {
    width: v-bind(progressWidth);
    background-color: #FF7723;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .progress-interval {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #FF7723 0%, #FF7723 50%, #0C69FF 50%, #0C69FF 100%);
  }

  .right-corner {
    padding-right: 67.4px;
    display: flex;
    justify-content: flex-end;
    background: url('../../assets/img/rightCornerIMG.png') no-repeat right 20px top;
    background-size: 31.4px;
  }

  .color-white {
    color: white;
  }

  .color-blue {
    color: #0C69FF;
  }

  .corner {
      font-family: 'SourceHanSansCN_Bold',serif;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 40px;

      .corner-text{
        font-size: 20px;
        margin: 6px 9px 0 0 ;
      }

      .corner-value {
        font-size: 29px;
      }
    }
}
</style>