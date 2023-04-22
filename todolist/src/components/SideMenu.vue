<template>
  <!--  页面导航-->
  <div class="Menu" :class="{ 'menu-fold': isFold }">
    <div class="menu-swap">
      <!--    home-->
      <div class="menu-top ml-7">
        <div class="menu-item cursor" @click="isActive = 'home'" :class="{'hover-bg':isActive === 'home'}">
          <IconBase box-view=" 0 0 40 40" width="1.2rem" height="1.2rem">
            <Home/>
          </IconBase>
          <span>Home</span>
        </div>
        <!--      my tasks-->
        <div class="menu-item cursor" @click="isActive = 'tasks'" :class="{'hover-bg':isActive === 'tasks'}">
          <IconBase box-view=" 0 0 40 40" width="1.2rem" height="1.2rem">
            <Done/>
          </IconBase>
          <span>My Tasks</span>
        </div>
        <!--      inbox-->
        <div class="menu-item cursor" @click="isActive = 'inbox'" :class="{'hover-bg':isActive === 'inbox'}">
          <IconBase box-view=" 0 0 40 40" width="1.2rem" height="1.2rem">
            <InBox/>
          </IconBase>
          <span>Inbox</span>
        </div>
        <!--      my workspace-->
        <div class="menu-item cursor" @click="isActive = 'workspace'" :class="{'hover-bg':isActive === 'workspace'}">
          <IconBase box-view=" 0 0 1020 1020" width="1.2rem" height="1.2rem">
            <WorkSpace/>
          </IconBase>
          <span>My Workspace</span>
        </div>
      </div>
      <!--    项目导航-->
      <!--    project title-->
      <div class="menu-top flex">
        <div class="menu-title" @mouseenter="isTitleHover = true" @mouseleave="isTitleHover = false">
          <div class="menu-title-left cursor" @click="isSeen = !isSeen">
            <div class="rotate-90" :class="{'hover-color':isTitleHover === true,'rotate-0':isSeen === false}">
              <IconBase>
                <Triangle/>
              </IconBase>
            </div>
            <span>Projects</span>
          </div>
          <div class="icon-item cursor">
            <IconBase box-view="0 0 24 24" width=".75rem" height=".75rem" class="mag-auto">
              <More/>
              >
            </IconBase>
          </div>
          <div class="icon-item cursor">
            <IconBase box-view="0 0 24 24" width=".75rem" height=".75rem" class="mag-auto">
              <Plus/>
              >
            </IconBase>
          </div>
        </div>
        <!--      project list-->
        <div class="project" v-for="project in projectList" v-show="isSeen">
          <div class="menu-item cursor" :class="{'hover-bg':isActive === project.id}" @click="isActive = project.id">
            <IconBase :icon-color=project.color width="1.25rem" height="1.25rem" box-view=" 2 2 20 20" class="flex-0">
              <Box/>
            </IconBase>
            <span class="text-overflow">{{ project.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiHttpClient} from "@/app/app.service";
import IconBase from "@/components/IconBase";
import {Home, WorkSpace, InBox, Done, Triangle, More, Plus, Box} from "@/components/icons"

export default {
  components: {
    IconBase, Home, WorkSpace, InBox, Done, Triangle, More, Plus, Box
  },
  name: "SideMenu",
  data() {
    return {
      isTitleHover: false,
      projectList: {},
      isSeen: true,
      isActive: true,
      isFold: false,
    };
  },
  created() {
    this.getProject()
  },
  methods: {
    getProject() {
      let url = "/api/get_project/"
      apiHttpClient.get(url).then((response) => {
        let data = response.data.results
        data.sort((a, b) => b.id - a.id)
        this.projectList = data
        this.$emit('projectList',this.projectList)
      })
    },
    foldMenu() {
      this.isFold = !this.isFold
    }
  },
}
</script>

<style scoped>
.Menu {
  width: 15rem;
  background-color: #F9F8F8;
  height:100%;
  transition: width .3s;
  position: relative;
}

.menu-fold {
  width: 0;
  /*visibility: hidden;*/
  transition: width .3s;
}

.menu-swap {
  width: 15rem;
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hover-color {
  color: var(--black) !important;
}

.mag-auto {
  margin: auto;
}

.menu-item {
  display: flex;
  margin-right: auto;
  width: 100%;
  padding: .3rem 1rem;
  transition: background-color .3s;
  border-radius: .5rem;
  margin-bottom: .05rem;
  align-items: center;
}

.menu-item:hover {
  background-color: #E9E7E7;
}

.hover-bg {
  background-color: #E9E7E7;
}

.menu-item span {
  margin-left: .6rem;
}

.project {
  margin-left: .7rem;
}

.rotate-90 {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  color: var(--gray);
}

.rotate-0 {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

.ml-7 {
  margin-left: .7rem;
}

.menu-top {
  padding: .5rem 1rem .45rem .5rem;
  border-bottom: .08rem solid #E9E7E7;
}

.flex {
  flex: 1 1 auto;
}

.menu-title {
  font-weight: 500;
  text-align: left;
  padding: .5rem 1rem .5rem 0;
  display: flex;
  align-items: center;
}

.menu-title-left {
  display: flex;
  align-items: center;
}

.menu-title span {
  margin-right: .2rem;
  margin-left: .6rem;
}

.icon-item {
  width: 1.5rem;
  height: 1.5rem;
  transition: background-color .3s;
  margin-left: 0.4rem;
  display: flex;
  justify-items: center;
  border-radius: .15rem;
  color: var(--gray);
}

.icon-item > svg {
  fill: currentColor;
}

.icon-item:hover {
  background-color: rgba(231, 231, 231, .5);
  color: var(--black);
}

.flex-0 {
  flex: 0 0 auto;
}
</style>