<template>
<input v-model="inputString" class="new-input" />
</template>

<script>
export default {
  name: "NewInput",
  data() {
    return {
      inputString:''
    }
  },
  props: {
    modelValue:{
      type:String,
      default:''
    }
  },
  watch:{
    inputString(newValue){
      this.$emit('update:modelValue',newValue)
    },
    modelValue(newvalue){
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
  border:1px solid #cfcbcb;
  font-size: .875rem;
}

.new-input:focus {
  outline:2px solid #4673D2;
  border:1px solid #4673D2;
  /*border-style: inset;*/
}
</style>