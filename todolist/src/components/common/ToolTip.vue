<template>
<div class="tooltip-main">
  <div class="slot-main" @mouseenter="isHover = true" @mouseleave="isHover =false" ref="slotMain">
    <slot />
  </div>
  <div class="tips-swap" v-show="isHover">
    <div class="triangle"></div>
    <div class="content">{{ content }}</div>
  </div>
</div>
</template>

<script>
export default {
  name: "ToolTip",
  data() {
    return {
      triangle:['column','rotate(45deg)','-.5rem','0'],
      isHover:false,
      width: '3rem',
      height: '3rem'
    }
  },
  created() {
    this.$nextTick(()=>{
      this.width = this.$refs.slotMain.offsetWidth+'px'
      this.height = this.$refs.slotMain.offsetHeight+'px'
    })
  },
  props: {
    content:{
      type:String,
      default:'Content'
    }

  },
  watch:{
    isHover(newValue) {
      if (newValue){
        const height = this.$refs.slotMain.offsetHeight
        const {top} = this.$refs.slotMain.getBoundingClientRect()
        if (height+top+50 >= window.innerHeight){
          this.triangle = ['column-reverse','rotate(225deg)','0','-.5rem']
        } else {
          this.triangle = ['column','rotate(45deg)','-.5rem','0']
        }
      }
    }
  }
}
</script>

<style scoped>
.tooltip-main{
  display: flex;
  flex-direction: v-bind(triangle[0]);
  width: v-bind(width);
  height: v-bind(height);
  align-items: center;
}

.tips-swap {
  position: absolute;
  margin-top: v-bind(height);
  margin-bottom: v-bind(height);
  display: flex;
  align-items: flex-end;
  flex-direction: v-bind(triangle[0]);
  z-index: 10;
  width: max-content;
  padding:.5rem 0;
}

.triangle {
  width: .8rem;
  height: .8rem;
  transform: v-bind(triangle[1]);
  margin: auto;
  margin-bottom: v-bind(triangle[2]);
  margin-top: v-bind(triangle[3]);
  background-color: var(--gray);
}

.content {
  background-color: var(--gray);
  width: fit-content;
  height: fit-content;
  padding: .5rem;
  border-radius: .3rem;
  color: white;
  font-size: .7rem;
}
</style>