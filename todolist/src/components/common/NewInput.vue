<template>
  <div class="input-swap">
    <input v-model="inputString" class="new-input" readonly  v-if="readonly" @focus="handleFocus"
      @blur="handleBlur" :placeholder="placeholder" />
    <input v-model="inputString" class="new-input" v-else @focus="handleFocus"
      @blur="handleBlur" ref="input" :placeholder="placeholder" />
    <div class="input-icon" v-if="showIcon">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewInput",
  data() {
    return {
      inputString: '',
      mrgLeft:''
    }
  },
  props: {
    mrgTOP: {
      type:String,
      default:'.375rem'
    },
    mrgLFt: {
      type:String,
      default:'.75rem'
    },
    placeholder: {
      type:String,
      default:''
    },
    modelValue: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    weight: {
      type: String,
      default:'normal'
    }
  },
  watch: {
    inputString(newValue) {
      this.$emit('update:modelValue', newValue)
    },
    modelValue(newValue) {
      this.inputString = newValue
    },
    mrgLFt(newValue){
      this.mrgLeft = newValue
    }
  },
  created() {
    this.inputString = this.modelValue
    this.mrgLeft = this.showIcon?'2.55rem':this.mrgLFt
  },
  methods: {
    handleFocus(){
      this.$emit('focus')
    },
    handleBlur() {
      this.$emit('blur')
    },
  }
}
</script>

<style scoped>
.new-input {
  background-color: white;
  border-radius: .375rem;
  padding: .375rem .75rem;
  padding-left: v-bind(mrgLeft);
  padding-right: .75rem;
  padding-top: v-bind(mrgTOP);
  padding-bottom: .375rem;
  color: var(--black);
  border: 1px solid #cfcbcb;
  width: 100%;
  font-weight: v-bind(weight);
}

.new-input:focus {
  outline: 2px solid #4673D2;
  border: 1px solid #4673D2;
}

.input-icon {
  position: absolute;
  left: .375rem;
  top:.2rem;
}

.input-swap {
  position: relative;
  width: 100%;
}
</style>