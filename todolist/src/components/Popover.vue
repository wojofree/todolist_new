<template>
  <div class="popover-main" @click="showPop">
    <slot name="main"></slot>
  </div>
  <div class="popover-content" v-show="isPopShow" ref="popoverContent">
    <slot name="pop"></slot>
  </div>
</template>

<script>
export default {
  name: "Popover",
  data() {
    return {
      isPopShow: false
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
  methods: {
    closePop(e) {
      this.isPopShow = false;
    },
    showPop() {
      setTimeout(() => {
        this.isPopShow = true
      }, 30)
    }
  }
}
</script>

<style scoped>
.popover-main {
  width: max-content;
  height: max-content;
}

</style>