<template>
  <div class="message-swap" v-show="openMessage">
    <div class="background" v-if="overLay"></div>
    <div class="message-main" ref="messageMain">
      <slot/>
      <div class="x-icon cursor" @click="closeMessage">
        <icon-base box-view="0 0 32 32" width="1rem" height="1rem">
          <XIcon/>
        </icon-base>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import XIcon from "@/components/icons/XIcon";

export default {
  name: "MessageBox",
  components: {XIcon, IconBase},
  data() {
    return {
      openMessage: false,
      firstClick: false,
      iconTop:'',
      iconRight:'',
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    overLay: {
      type: Boolean,
      default: true
    },
    iconPosition: {
      type: Object,
      default: {top:'.5rem',right:'.5rem'}
    }
  },
  watch: {
    openMessage(newValue) {
      if (newValue) {
        document.addEventListener("click", this.handleMessage)
      } else {
        document.removeEventListener("click", this.handleMessage)
      }
    },
    modelValue(newValue) {
      if (newValue) {
        this.openMessage = true
        setTimeout(() => {
          this.firstClick = true
        }, 40)
      }
    }
  },
  created() {
    this.iconTop = this.iconPosition.top
    this.iconRight = this.iconPosition.right
    this.openMessage = this.modelValue
  },
  methods: {
    handleMessage(e) {
      if (this.$refs.messageMain && !this.$refs.messageMain.contains(e.target) && this.firstClick) {
        this.closeMessage()
      }
    },
    closeMessage() {
      this.firstClick = this.openMessage = false
      this.$emit('update:modelValue', false)
    }
  }
}
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .35);
  z-index: 100001;
}

.message-main {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100002;
}

.x-icon {
  position: absolute;
  top: v-bind(iconTop);
  right: v-bind(iconRight);
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .4rem;
}

.x-icon:hover {
  background-color: rgb(248, 246, 246);
}
</style>