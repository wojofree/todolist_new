<template>
  <div style="width: 5rem; height: 5rem;background-color: #1b6279; display: flex;overflow-y: auto;overflow-x: visible">
    <div style="width: 1rem;height: 2rem; background-color: #0d7f56"></div>
    <div style="width: 1rem;height: 2rem; background-color: rebeccapurple"></div>
    <div style="display: grid;flex-direction: column;width: 2rem;height: 3rem">
      <div style="width: 2rem;height: 3rem;background-color: #8c8c8b"></div>
      <div style="width: 10rem; height: 3rem;background-color: #fff3cd"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: "test",
  data() {
    return {
      isHover: false,
    }
  }
}
</script>

<style scoped>

</style>