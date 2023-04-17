<template>
  <NavbarView @fold="menuFold" @userInfo="getUser"></NavbarView>
  <div style="display: flex;">
    <div>
      <SideMenu ref="sideMenu"></SideMenu>
    </div>
    <div style="width: 100%;">
      <router-view v-if="isRouterAlive" :user="user"/>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1e1f21;
  font-size: .9rem;
}

::selection {
  background-color: #BBD6FB;
}
</style>
<script>
import NavbarView from "@/components/NavbarView";
import SideMenu from "@/components/SideMenu.vue"

export default {
  components: {NavbarView, SideMenu},
  data() {
    return {
      isRouterAlive: true,
      user:{}
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
    menuFold() {
      this.$nextTick(() => {
        this.$refs.sideMenu.foldMenu()
      })
    },
    getUser(user) {
      this.user = user
    }
  },
}
</script>