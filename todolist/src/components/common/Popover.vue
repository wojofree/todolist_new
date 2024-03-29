<template>
  <div ref="popSwap" class="pop-swap" @click="stopPropagation">
    <div ref="popoverMain" class="popover-main" @click="showPop" @mouseenter="hoverShow" @mouseleave="hoverClose">
      <slot name="main"></slot>
    </div>
    <div ref="popoverContent" :class="{'vis-hidden':!isPopShow}" class="popover-content" @click="closePop"
         @mouseenter="hoverShow" @mouseleave="hoverClose">
      <slot name="pop"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popover",
  data() {
    return {
      isPopShow: false,
      mainWidth: '',
      mainHeight: '',
      marWidth: '',
      marHeight: '',
      flexDirection: 'column',
      alignItems: '',
    }
  },
  props: {
    direction: {
      type: String,
      default: 'flex-end'
    },
    popPosition: {
      type: String,
      default: 'under'
    },
    hoverControl: {
      type: Boolean,
      default: false
    },
    clickClose: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    async isPopShow(newValue) {
      if (newValue) {
        this.getPosition()
        document.addEventListener('click', this.closePop)
      } else {
        document.removeEventListener('click', this.closePop)
      }
    }
  },
  mounted() {
    this.mainHeight = this.$refs.popoverMain.offsetHeight + 'px'
    this.mainWidth = this.$refs.popoverMain.offsetWidth + 'px'
  },
  async created() {
    this.alignItems = this.direction
    await this.$nextTick(() => {
        this.mainHeight = this.$refs.popoverMain.offsetHeight + 'px'
        this.mainWidth = this.$refs.popoverMain.offsetWidth + 'px'
      })
    await this.getMargin()
  },
  methods: {
    getMargin() {
      if (this.popPosition === 'under') {
        this.marHeight = 0
        this.marWidth = 0
      } else if (this.popPosition === 'side') {
        this.marWidth = this.mainWidth
        this.marHeight = '-' + this.mainHeight
      }
    },
    async hoverShow() {
      if (this.hoverControl) {
        this.getPosition()
        await this.$nextTick(() => {
          this.mainHeight = this.$refs.popoverMain.offsetHeight + 'px'
          this.mainWidth = this.$refs.popoverMain.offsetWidth + 'px'
        })
        this.getMargin()
        this.isPopShow = true
      }
    },
    hoverClose() {
      if (this.hoverControl) {
        this.isPopShow = false;
        this.$emit('close', true)
      }
    },
    closePop(e) {
      if (!this.clickClose) {
        if (this.$refs.popSwap && !this.$refs.popSwap.contains(e.target)) {
          this.isPopShow = false;
          this.$emit('close', true)
        }
      } else {
        this.isPopShow = false;
        this.$emit('close', true)
        this.$emit('clickClose', true)
      }
    },
    showPop() {
      this.getPosition()
      if (!this.isPopShow) {
        setTimeout(() => {
          this.isPopShow = true
        }, 10)
      }
    },
    getPosition() {
      this.alignItems = this.direction
      this.flexDirection = 'column'
      const width = this.$refs.popoverContent.offsetWidth
      const height = this.$refs.popoverContent.offsetHeight
      const {left, right, top, bottom} = this.$refs.popoverMain.getBoundingClientRect()
      if (this.alignItems === 'flex-start' && window.innerWidth - right - width < 0) {
        this.alignItems = 'flex-end'
      }
      if (this.alignItems === 'flex-end' && left - width < 0) {
        this.alignItems = 'flex-start'
      }
      if (this.flexDirection === 'column-reverse' && top - height < 0) {
        this.flexDirection = 'column'
      }
      if (this.flexDirection === 'column' && window.innerHeight - bottom - height < 0) {
        this.flexDirection = 'column-reverse'
      }
    },
    stopPropagation(event) {
      event.stopPropagation()
    }
  }
}
</script>

<style scoped>
.popover-main {
  cursor: pointer;
  width: fit-content;
  height: fit-content;
}

.pop-swap {
  /*position: relative;*/
  display: flex;
  align-items: v-bind(alignItems);
  flex-direction: v-bind(flexDirection);
  width: v-bind(mainWidth);
  height: v-bind(mainHeight);
}

.popover-content {
  cursor: default;
  /*position: absolute;*/
  margin-top: v-bind(marHeight);
  margin-bottom: v-bind(marHeight);
  margin-right: v-bind(marWidth);
  margin-left: v-bind(marWidth);
  width: max-content;
  min-width: 10rem;
  display: flex;
  flex-direction: column;
  padding: .3rem 0;
  background-color: white;
  border: 1px solid #EDEAE9;
  border-radius: .4rem;
  box-shadow: 0 1px 4px 0 rgba(109, 110, 111, 0.08);
  z-index: 1000001;
}

.vis-hidden {
  visibility: hidden;
}
</style>