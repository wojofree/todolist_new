<template>
  <div>test</div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {}
  },
  props: {
    modelValue: {},
    mainColor: {
      type: String,
      default: '#1e1f21'
    },
    list: {
      type: Object,
      default: [{name: 'test1', value: 'test1'}, {name: 'test2', value: 'test2'}, {name: 'test3', value: 'test3'}]
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

</style>