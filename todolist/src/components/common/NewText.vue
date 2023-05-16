<template>
  <div class="input-swap">
    <textarea v-model="inputString" class="new-input" readonly  v-if="readonly"/>
    <textarea v-model="inputString" class="new-input" v-else />
<!--    <div class="input-icon" v-if="showIcon">-->
<!--      <slot/>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "NewText",
  data() {
    return {
      inputString: '',
      mrgLeft:''
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '10rem'
    }
  },
  watch: {
    inputString(newValue) {
      this.$emit('update:modelValue', newValue)
    },
    modelValue(newvalue) {
      this.inputString = newvalue
    }
  },
  created() {
    this.inputString = this.modelValue
  },
}
</script>

<style scoped>
.new-input {
  background-color: white;
  border-radius: .375rem;
  padding: .375rem .75rem;
  color: var(--black);
  border: 1px solid #cfcbcb;
  font-size: .875rem;
  width: 100%;
  height: v-bind(height);
  resize:none;
  z-index: 100;
}

.new-input:focus {
  outline: 2px solid #4673D2;
  border: 1px solid #4673D2;
}

.input-swap {
  position: relative;
  width: 100%;
}
</style>