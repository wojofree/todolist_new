<template>
<div class="drawer-swap">
  <slot />
</div>
</template>

<script>
export default {
  name: "Drawer",
  props:{
    direction:{
      type:String,
      default:'rtl'
    }
  }
}
</script>

<style scoped>
.drawer-swap {
  position: absolute;
  top:0;
  right:0;
  background-color: white;
  height: 100%;
  width: 10rem;
}


</style>