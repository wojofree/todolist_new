<template>
  <div class="drawer-swap" ref="drawerSwap">
    <div class="drawer-main">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Drawer",
  data() {
    return {
      modelStyle: {
        rtl: {
          width: 'max-content',
          height: '100%',
          top: '0',
          right: '0',
          bottom: '',
          left: ''
        },
        ltr: {
          width: 'max-content',
          height: '100%',
          top: '0',
          right: '',
          bottom: '',
          left: '0'
        },
        btt: {
          width: '100%',
          height: 'max-content',
          top: '',
          right: '0',
          bottom: '0',
          left: ''
        },
        ttb: {
          width: '100%',
          height: 'max-content',
          top: '0',
          right: '0',
          bottom: '',
          left: ''
        }
      },
      isFirstClick: false
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    width: {
      type: String,
      default: '23.5rem'
    },
    height: {
      type: String,
      default: '23.5rem'
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue) {
        this.modelStyle.rtl.width = this.modelStyle.ltr.width = this.width
        this.modelStyle.rtl.right = this.modelStyle.ltr.left = this.modelStyle.btt.bottom = this.modelStyle.ttb.top = 0
        this.modelStyle.btt.height = this.modelStyle.ttb.height = this.height
        document.addEventListener("click", this.close)
        setTimeout(() => {
          this.isFirstClick = true
        }, 10)
      } else {
        this.modelStyle.rtl.width = this.modelStyle.ltr.width = this.modelStyle.btt.height = this.modelStyle.ttb.height = 0
        this.modelStyle.rtl.right = this.modelStyle.ltr.left = this.modelStyle.btt.bottom = this.modelStyle.ttb.top = '-35px'
        this.isFirstClick = false
        document.removeEventListener("click", this.close)
      }
    }
  },
  async created() {
    if (this.modelValue) {
      this.modelStyle.rtl.width = this.modelStyle.ltr.width = this.width
      this.modelStyle.btt.height = this.modelStyle.ttb.height = this.height
      this.modelStyle.rtl.right = this.modelStyle.ltr.left = this.modelStyle.btt.bottom = this.modelStyle.ttb.top = 0
    } else {
      this.modelStyle.rtl.width = this.modelStyle.ltr.width = this.modelStyle.btt.height = this.modelStyle.ttb.height = 0
      this.modelStyle.rtl.right = this.modelStyle.ltr.left = this.modelStyle.btt.bottom = this.modelStyle.ttb.top = '-35px'
    }
  },
  methods: {
    close(e) {
      if (this.$refs.drawerSwap && !this.$refs.drawerSwap.contains(e.target) && this.isFirstClick) {
        this.isFirstClick = false
        this.$emit("update:modelValue", false)
      }
    }
  }
}
</script>

<style scoped>
.drawer-swap {
  position: absolute;
  top: v-bind(modelStyle [direction] ['top']);
  bottom: v-bind(modelStyle [direction] ['bottom']);
  right: v-bind(modelStyle [direction] ['right']);
  left: v-bind(modelStyle [direction] ['left']);
  background-color: white;
  height: v-bind(modelStyle [direction] ['height']);
  width: v-bind(modelStyle [direction] ['width']);
  transition: width .3s, height .3s;
  z-index: 100101;
  box-shadow: 5px 5px 5px 5px rgba(109, 110, 111, 0.1);
}

.drawer-main {
  position: relative;
  right: 0;
}

</style>