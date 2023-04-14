<template>
<!--  页面导航-->
  <div class="Menu">
<!--    home-->
    <div class="menu-top ml-7">
      <div class="menu-item" @click="isActive = 'home'" :class="{'hover-bg':isActive === 'home'}">
        <el-icon size="1.2rem">
        <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M37.9,15L22.2,3.8c-1.3-1-3.1-1-4.4-0.1L2.2,14.4c-0.7,0.5-0.9,1.4-0.4,2.1c0.5,0.7,1.4,0.9,2.1,0.4L6,15.4v12.3c0,4.6,3.7,8.3,8.3,8.3h11.4c4.6,0,8.3-3.7,8.3-8.3V15.9l2.1,1.5c0.3,0.2,0.6,0.3,0.9,0.3c0.5,0,0.9-0.2,1.2-0.6C38.7,16.4,38.5,15.5,37.9,15z M31,27.7c0,2.9-2.4,5.3-5.3,5.3H14.3C11.4,33,9,30.6,9,27.7V13.3l10.6-7.2c0.2-0.2,0.5-0.2,0.8,0L31,13.7V27.7z"></path></svg>
        </el-icon>
          <span>Home</span>
      </div>
<!--      my tasks-->
      <div class="menu-item" @click="isActive = 'tasks'" :class="{'hover-bg':isActive === 'tasks'}">
        <el-icon size="1.2rem">
        <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M20,2.5C10.4,2.5,2.5,10.4,2.5,20S10.4,37.5,20,37.5S37.5,29.6,37.5,20S29.6,2.5,20,2.5z M20,34.5C12,34.5,5.5,28,5.5,20S12,5.5,20,5.5S34.5,12,34.5,20S28,34.5,20,34.5z M27.7,15c0.6,0.6,0.6,1.5,0,2.1l-10,10c-0.2,0.2-0.6,0.3-1,0.3c-0.4,0-0.8-0.1-1.1-0.4l-4.1-4.1c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l3.1,3.1l8.9-8.9C26.2,14.4,27.1,14.4,27.7,15z"></path></svg>
        </el-icon>
          <span>My Tasks</span>
      </div>
<!--      inbox-->
      <div class="menu-item" @click="isActive = 'inbox'" :class="{'hover-bg':isActive === 'inbox'}">
        <el-icon size="1.2rem">
        <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M7.5,32L7.5,32h-1c-1.5,0-2.8-0.8-3.4-2c-0.8-1.5-0.4-3.4,0.9-4.5c1.2-1,1.9-2.4,2-3.9v-6.1C6,8.1,12.3,2,20,2s14,6.1,14,13.5V22c0.2,1.4,0.9,2.6,2,3.5c1.3,1.1,1.7,2.9,0.9,4.5c-0.6,1.2-2,2-3.4,2h-0.9H7.5z M7.6,29h25.8c0.3,0,0.7-0.2,0.8-0.4c0.2-0.4,0-0.7-0.2-0.8l0,0c-1.6-1.4-2.7-3.3-3-5.5c0-0.1,0-0.1,0-0.2v-6.6C31,9.7,26.1,5,20,5S9,9.7,9,15.5v6.1v0.1c-0.2,2.4-1.3,4.5-3.1,6c-0.2,0.2-0.3,0.5-0.2,0.8C5.9,28.8,6.2,29,6.5,29H7.6L7.6,29z M24.7,34c-0.7,1.9-2.5,3.2-4.7,3.2s-4-1.3-4.7-3.2H24.7z"></path></svg>
        </el-icon>
          <span>Inbox</span>
      </div>
      <!--      my workspace-->
      <div class="menu-item" @click="isActive = 'workspace'" :class="{'hover-bg':isActive === 'workspace'}">
        <el-icon size="1.2rem">
        <svg viewBox="0 0 1024 1024" width="200" height="200"><path d="M828 799.956c0 39.766-22.61 94.878-130.316 131.6C632.554 953.77 545.658 966 453 966s-179.556-12.23-244.682-34.438C100.6 894.834 78 839.722 78 799.956c0-147.182 97.876-273.42 236.07-325.046a229 229 0 1 1 277.86 0C730.124 526.536 828 652.774 828 799.956zM610 293a157 157 0 1 0-157 157 157.178 157.178 0 0 0 157-157zM453.376 522h-0.752C285.722 522.184 150 646.8 150 799.956c0 45.42 121.752 94.054 303 94.054s303-48.634 303-94.054C756 646.8 620.278 522.184 453.376 522zM942 659.726c0 20.2-9 56-65.538 80.474a329.238 329.238 0 0 0-21-69.538c8.484-4.294 13.342-8.31 14.544-11.152-0.118-67.688-56.122-123.69-128.424-132.374a382.328 382.328 0 0 0-95.646-52.226 231.182 231.182 0 0 0 35.336-33.552 68.982 68.982 0 1 0 53.422-123.99 227.628 227.628 0 0 0-3.934-73 140.866 140.866 0 0 1 95.55 234.252C895.136 513.436 942 581.558 942 659.726z"></path></svg>
        </el-icon>
          <span>My Workspace</span>
      </div>
    </div>
<!--    项目导航-->
<!--    project title-->
    <div class="menu-top">
      <div class="menu-title" @mouseenter="isTitleHover = true" @mouseleave="isTitleHover = false">
        <div class="menu-title-left" @click="isSeen = !isSeen">
          <el-icon size="1rem" color="#6d6e6f" class="rotate-90" :class="{'hover-color':isTitleHover === true,'rotate-0':isSeen === false}">
            <svg class="right-triangle-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M13.707,6.707L23,16l-9.293,9.293C13.077,25.923,12,25.477,12,24.586V7.414C12,6.523,13.077,6.077,13.707,6.707z"></path></svg>
          </el-icon>
          <span>Projects</span>
        </div>
        <div class="icon-item">
          <svg class="mini-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5,12c0,1.4-1.1,2.5-2.5,2.5S0,13.4,0,12s1.1-2.5,2.5-2.5S5,10.6,5,12z M12,9.5c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.5,12,9.5z M21.5,9.5c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5S24,13.4,24,12S22.9,9.5,21.5,9.5z"></path></svg>
        </div>
        <div class="icon-item">
          <svg class="mini-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z"></path></svg>
      </div>
      </div>
<!--      project list-->
      <div class="project" v-for="project in projectList" :class="{'dsp-none':isSeen === false}">
        <div class="menu-item" :class="{'hover-bg':isActive === project.id}" @click="isActive = project.id">
          <div class="project-color"></div>
            <span>{{ project.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiHttpClient} from "@/app/app.service";

export default {
  name: "Menu",
  data() {
    return {
      isTitleHover: false,
      projectList:{},
      isSeen:true,
      isActive:true,
    };
  },
  created() {
    this.getProject()
  },
  methods:{
    getProject(){
      let url = "/api/get_all_category"
      apiHttpClient.get(url).then((response) => {
        console.log(response)
        let data = response.data.results
        data.sort((a, b) => b.id - a.id)
        this.projectList = data
      })
    }
  }
}
</script>
<script setup>
</script>
<style scoped>
.Menu{
  width: 15rem;
  background-color: #F9F8F8;
  height: calc(100vh - 3.9rem);
}

.hover-color {
  color: #1e1f21;
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
}

.rotate-0 {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
}

.project span{
  margin-left: .8rem;
}

.ml-7 {
  margin-left: .7rem;
}

.menu-top {
  padding: .5rem 1rem .45rem .5rem;
  border-bottom: .08rem solid #E9E7E7;
}

.menu-title {
  font-weight: 500;
  text-align: left;
  padding:  .5rem 1rem .5rem 0rem;
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
  margin-left: 0.1rem;
  display: flex;
  justify-items: center;
  border-radius: .15rem;
  color: #6d6e6f;
}

.icon-item > svg { fill: currentColor; }

.icon-item:hover {
  background-color: rgba(231,231,231,.5);
  color: #1e1f21;
}

.mini-icon {
  width: .6rem;
  height: .6rem;
  display: block;
  margin: auto;
}

.project-color {
  width: 1rem;
  height: 1rem;
  background-color: #1a1e21;
  border-radius: .35rem;
}

.dsp-none {
  display: none;
}

.dsp-block {
  display: block;
}
</style>