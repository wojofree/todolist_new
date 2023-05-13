<template>
  <HomeView></HomeView>
</template>

<script>
import SideMenu from "@/components/common/SideMenu.vue"

export default {
  components: {
    SideMenu
  },
  data() {
    return {}
  },
  methods: {
    menuFold() {
      this.$nextTick(() => {
        this.$refs.sideMenu.foldMenu()
      })
    }
  }
}
</script>
<script setup>
// import common from "@/components/SideMenu.vue"
import NavbarView from "@/components/NavbarView";
import HomeView from "@/views/home/HomeView";
</script>
<style>
</style>
<style scoped>
</style>