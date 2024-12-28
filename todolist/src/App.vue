<template>
<!--  <div class="main-swap">-->
<!--    <NavbarView @fold="menuFold" @userInfo="getUser"></NavbarView>-->
<!--    <div class="d-flex">-->
<!--      <div>-->
<!--        <SideMenu ref="sideMenu" @projectList="getProject"></SideMenu>-->
<!--      </div>-->
<!--      <div class="main">-->
        <router-view  />
<!--        <router-view v-if="isRouterAlive"/>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<style lang="scss">
//.main-swap {
//  display: flex;
//  flex-direction: column;
//  //height: calc(100vh);
//  width: calc(100vw);
//  //overflow-x: hidden;
//  //position: relative;
//}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  //color: #1e1f21;
  //font-size: .9rem;
}

//::selection {
//  background-color: #BBD6FB;
//}
//
//.main {
//  width: 100%;
//  min-width: 63rem;
//  //overflow-y: auto;
//  min-height: calc(100vh);
//  display: flex;
//  flex-direction: column;
//}
</style>
<script>
// import NavbarView from "@/components/NavbarView";
// import SideMenu from "@/components/common/SideMenu.vue"

export default {
  // components: {NavbarView, SideMenu},
  data() {
    return {
      // isRouterAlive: true,
      // user: {},
      // projectList: {}
    };
  },
  // provide() {
  //   //提供
  //   return {
  //     reload: this.reload,
  //   };
  // },
  mounted() {
    // window.addEventListener('resize', this.handleResize);
  },
  methods: {
    // handleResize(){
    //   const windowWidth = window.innerWidth;
    //   this.$refs.sideMenu.isFold = windowWidth < 1150;
    // },
    // reload() {
    //   this.isRouterAlive = false;
    //   this.$nextTick(function () {
    //     this.isRouterAlive = true;
    //   });
    // },
    // menuFold() {
    //   this.$nextTick(() => {
    //     this.$refs.sideMenu.foldMenu()
    //   })
    // },
    // getUser(user) {
    //   this.user = user
    // },
    // getProject(projectList) {
    //   this.projectList = projectList
    // }
  },
}
</script>
