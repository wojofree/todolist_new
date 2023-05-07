<template>
  <div class="pop-swap">
    <div class="popover-main" @click="showPop" ref="popoverMain">
      <slot name="main"></slot>
    </div>
    <div class="popover-content" v-show="isPopShow" ref="popoverContent">
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
      mainWidth:'',
      mainHeight:'',
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
  mounted() {
    this.$nextTick(()=>{
      this.mainWidth = this.$refs.popoverMain.offsetWidth + 'px'
      this.mainHeight = this.$refs.popoverMain.offsetHeight + 'px'
    })
  },
  methods: {
    closePop() {
      this.isPopShow = false;
    },
    showPop() {
      setTimeout(() => {
        this.isPopShow = true
      }, 30)
    }
  },
  props:{
   direction: {
     type:String,
     default:'flex-end'
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
  align-items: v-bind(direction);
  flex-direction: column;
  width: v-bind(mainWidth);
  height: v-bind(mainHeight);
}

.popover-content {
  position: absolute;
  margin-bottom: v-bind(mainHeight);
  margin-top: v-bind(mainHeight);
  width: max-content;
  display: flex;
  flex-direction: column;
  padding: .3rem 0;
  background-color: white;
  border: 1px solid #EDEAE9;
  border-radius: .4rem;
  box-shadow: 0 1px 4px 0 rgba(109, 110, 111, 0.08);
  z-index: 100001;
}
</style>