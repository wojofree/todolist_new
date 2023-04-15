<template>
      <HomeView></HomeView>
</template>

<script>
import SideMenu from "@/components/SideMenu.vue"

export default {
  components: {
    SideMenu
  },
  data() {
    return {
    }
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
// import Menu from "@/components/SideMenu.vue"
import NavbarView from "@/components/NavbarView";
import HomeView from "@/views/home/HomeView";
</script>
<style>
</style>
<style scoped>
</style>