<template>
<div class="projects-card">456</div>
</template>

<script>
export default {
  name: "Tasks"
}
</script>

<style scoped>
.projects-card {
  min-width: 24rem;
  height: 25rem;
  background-color: white;
  margin: .5rem;
  border-radius: .5rem;
  transition: box-shadow .2s;
}

.projects-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}
</style>