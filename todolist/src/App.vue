<template>
  <router-view v-if="isRouterAlive"/>
</template>

<style lang="scss">
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1e1f21;
  font-size: .9rem;
}
::selection  {
  background-color: #BBD6FB;
}
</style>
<script>
import NavbarView from "@/components/NavbarView";
export default {
  components: {NavbarView},
  data() {
    return {
      isRouterAlive: true,
    };
  },
  provide() {
    //提供
    return {
      reload: this.reload,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
}
</script>