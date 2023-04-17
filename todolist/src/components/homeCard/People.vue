<template>
<div class="people-card">789</div>
</template>

<script>
export default {
  name: "Tasks"
}
</script>

<style scoped>
.people-card {
  min-width: 24rem;
  height: 25rem;
  background-color: white;
  margin: .5rem;
  border-radius: .5rem;
  transition: box-shadow .2s;
}

.people-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}
</style>