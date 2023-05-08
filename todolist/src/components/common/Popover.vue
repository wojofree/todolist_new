<template>
  <div class="pop-swap">
    <div class="popover-main" @click="showPop" @mouseenter="hoverShow" @mouseleave="hoverClose" ref="popoverMain">
      <slot name="main"></slot>
    </div>
    <div class="popover-content" :class="{'vis-hidden':!isPopShow}" ref="popoverContent" @mouseenter="hoverShow" @mouseleave="hoverClose">
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
      alignItems: ''
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
    }
  },
  watch: {
    isPopShow(newValue) {
      if (newValue) {
        document.addEventListener('click', this.closePop)
      } else {
        document.removeEventListener('click', this.closePop)
      }
    }
  },
  async created() {
    this.alignItems = this.direction
    await this.$nextTick(() => {
      this.mainHeight = this.$refs.popoverMain.offsetHeight + 'px'
      this.mainWidth = this.$refs.popoverMain.offsetWidth + 'px'
    })
    if (this.popPosition === 'under') {
        this.marHeight = this.mainHeight
        this.marWidth = 0
      } else if (this.popPosition === 'side') {
        this.marWidth = this.mainWidth
        this.marHeight = 0
      }
    console.log(this.marWidth)
  },
  methods: {
    hoverShow() {
      if (this.hoverControl) {
        this.getPosition()
        this.isPopShow = true
      }
    },
    hoverClose() {
      if (this.hoverControl) {
        this.isPopShow = false;
      }
    },
    closePop() {
      this.isPopShow = false;
    },
    showPop() {
      this.getPosition()
      setTimeout(() => {
        this.isPopShow = true
      }, 30)
    },
    getPosition(){
      const width = this.$refs.popoverContent.offsetWidth
      const height = this.$refs.popoverContent.offsetHeight
      const {left, right, top, bottom} = this.$refs.popoverMain.getBoundingClientRect()
      if (this.alignItems === 'flex-start' && window.innerWidth - left - width < 0) {
        this.alignItems = 'flex-end'
      }
      if (this.alignItems === 'flex-end' && right - width < 0) {
        this.alignItems = 'flex-start'
      }
      if (this.flexDirection === 'column-reverse' && top - height < 0) {
        this.flexDirection = 'column'
      }
      if (this.flexDirection === 'column' && window.innerHeight - bottom - height < 0) {
        this.flexDirection = 'column-reverse'
      }
    }
  }
}
</script>

<style scoped>
.popover-main {
  width: fit-content;
  height: fit-content;
}

.pop-swap {
  display: flex;
  align-items: v-bind(alignItems);
  flex-direction: v-bind(flexDirection);
  width: v-bind(mainWidth);
  height: v-bind(mainHeight);
}

.popover-content {
  position: absolute;
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
  z-index: 100001;
}

.vis-hidden {
  visibility: hidden;
}
</style>