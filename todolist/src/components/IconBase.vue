<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="boxView"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    boxView: {
      type: String,
      default: '0 0 30 30'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>

<style scoped>
svg {
  display: flex;
  vertical-align: baseline;
  align-items: center;
}
</style>