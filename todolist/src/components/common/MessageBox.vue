<template>
  <div class="message-swap">
    <div class="background"></div>
    <div class="message-main">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBox"
}
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .15);
  z-index: 100001;
}

.message-main {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100002;
}
</style>