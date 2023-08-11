<template>
  <div v-show="openMessage" class="message-swap">
    <div v-if="overLay" class="background"></div>
    <div class="message-main">
      <div class="message">
        <div v-show="!hiddenIcon" class="x-icon cursor" @click="closeMessage">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <XIcon/>
          </icon-base>
        </div>
        <div ref="messageMain" class="message-card">
          <slot/>
        </div>
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
      iconTop: '',
      iconRight: '',
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
      default: {top: '2rem', right: '.5rem'}
    },
    hiddenIcon: {
      type: Boolean,
      default: false,
    },
    cardWidth: {
      type: String,
      default: 'auto'
    },
    cardHeight: {
      type: String,
      default: 'auto'
    },
    maxWidth: {
      type: String,
      default: 'auto'
    },
    mrgTop: {
      type: String,
      default: '0px'
    },
    justifyContent: {
      type: String,
      default: 'center'
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
      } else {
        this.closeMessage()
      }
    }
  },
  created() {
    this.iconTop = '-' + this.iconPosition.top
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
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100002;
  width: 100%;
  height: 100%;
}

.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: v-bind(justifyContent);
  margin-top: v-bind(mrgTop);
}


.x-icon {
  z-index: 1000;
  margin-bottom: v-bind(iconTop);
  margin-right: v-bind(iconRight);
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .4rem;
  color: var(--gray);
}

.x-icon:hover {
  background-color: rgb(248, 246, 246);
  color: var(--black);
}

.message-card {
  width: v-bind(cardWidth);
  max-width: v-bind(maxWidth);
  display: flex;
  align-items: center;
  justify-content: center;
  height: v-bind(cardHeight);
}
</style>