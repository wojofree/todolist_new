<template>
  <div class="new-button">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "NewButton",
  data() {
    return {}
  },
  props: {
    backgroundStyle: {
      type: String,
      default: 'white'
    },
    borderStyle: {
      type: String,
      default: 'none'
    },
    fontColor: {
      type: String,
      default: 'var(--black)'
    },
    hoverColor: {
      type: String,
      default: 'rgb(248, 246, 246)'
    }
  },
  created() {
  }
}
</script>

<style scoped>
.new-button {
  width: max-content;
  height: max-content;
  padding: .5rem 1rem;
  transition: background-color .3s;
  border-radius: .4rem;
  font-weight: 500;
  background-color: v-bind(backgroundStyle);
  border: v-bind(borderStyle);
  cursor: pointer;
  color: v-bind(fontColor)
}

.new-button:hover {
  background-color: v-bind(hoverColor);
}
</style>