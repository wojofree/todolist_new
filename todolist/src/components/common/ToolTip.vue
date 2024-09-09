<template>
  <div class="tooltip-main">
    <div class="slot-main" @mouseenter="isHover = true" @mouseleave="isHover =false" ref="slotMain">
      <slot/>
    </div>
    <div class="tips-swap" v-show="isHover">
      <div class="triangle"></div>
      <div class="content">
       <div class="header" v-if="header !=='header'">{{ header }}</div>
       <span>{{ content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolTip",
  data() {
    return {
      triangle: ['column', 'rotate(45deg)', '-.5rem', '0'],
      isHover: false,
      width: '2rem',
      height: '2rem'
    }
  },
  created() {
    this.$nextTick(() => {
      this.width = this.$refs.slotMain.offsetWidth + 'px'
      this.height = this.$refs.slotMain.offsetHeight + 'px'
    })
  },
  props: {
    content: {
      type: String,
      default: 'Content'
    },
    header: {
      type: String,
      default: 'header'
    }
  },
  watch: {
    isHover(newValue) {
      this.height = this.$refs.slotMain.offsetHeight + 'px'
      if (newValue) {
        const height = this.$refs.slotMain.offsetHeight
        const {top} = this.$refs.slotMain.getBoundingClientRect()
        if (height + top + 50 >= window.innerHeight) {
          this.triangle = ['column-reverse', 'rotate(225deg)', '0', '-.5rem']
        } else {
          this.triangle = ['column', 'rotate(45deg)', '-.5rem', '0']
        }
      }
    },
  }
}
</script>

<style scoped>
.tooltip-main {
  /*position: relative;*/
  display: flex;
  flex-direction: v-bind(triangle [0]);
  width: max-content;
  /*height: v-bind(height);*/
  align-items: center;
}

.tips-swap {
  position: absolute;
  margin-top: v-bind(height);
  margin-bottom: v-bind(height);
  display: flex;
  align-items: flex-end;
  flex-direction: v-bind(triangle [0]);
  z-index: 100;
  width: max-content;
  padding: .5rem 0;
}

.triangle {
  width: .8rem;
  height: .8rem;
  transform: v-bind(triangle [1]);
  margin: auto;
  margin-bottom: v-bind(triangle [2]);
  margin-top: v-bind(triangle [3]);
  background-color: #363639;
}

.content {
  background-color: #363639;
  width: fit-content;
  height: fit-content;
  padding: .5rem;
  border-radius: .3rem;
  color: white;
  font-size: .7rem;
  max-width: 12rem;
}

.header {
  padding-bottom: .5rem;
  margin-bottom: .5rem;
  border-bottom: 1px solid white;
  font-weight: 700;
}

.slot-main {
  width: 100%;
}
</style>