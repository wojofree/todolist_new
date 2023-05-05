<template>
<div>
  <div>
    <slot name="main"></slot>
  </div>
  <div>
    <slot name="pop"></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "Popover"
}
</script>

<style scoped>

</style>