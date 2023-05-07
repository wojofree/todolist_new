<template>
  <div class="projects-card" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <!--      卡片header-->
    <div class="header" :class="{'header-shadow':isShadowed}">
      <div class="title">
        Projects
      </div>
      <div class="select">
        <SelectBar :options=options v-model="selectValue"></SelectBar>
      </div>
    </div>
    <!--      内容-->
    <div class="item" @scroll="handleScroll" ref="projectItem">
      <div class="item-option">
        <div class="item-icon">
          <IconBase width="3rem" height="3rem" icon-color="--gray" box-view="1 1 48 48">
            <TinyPlus/>
          </IconBase>
        </div>
        <span>Create project</span>
      </div>
      <div class="item-option" v-for="item in projectList">
        <div class="item-icon no-border" :style="{'backgroundColor':item.color}">
          <IconBase width="1.5rem" height="1.5rem" box-view="0 0 24 24" class="mag-auto">
            <List/>
          </IconBase>
        </div>
        <span class="text-overflow project-name">{{ item.name }}</span>
        <Popover>
          <template #main>
            <div class="project-more">
              <ToolTip content="Show options">
                <div class="more cursor">
                  <icon-base box-view="0 0 24 24">
                    <More/>
                  </icon-base>
                </div>
              </ToolTip>
            </div>
          </template>
          <template #pop>
            <div class="share pop-item">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <WorkSpace/>
              </icon-base>
              <span>Share...</span>
            </div>
            <div class="favorite pop-item">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Star/>
              </icon-base>
              <span>Add to favorites</span>
            </div>
            <popover pop-position="side" hover-control direction="flex-start">
              <template #main>
                <div class="set-color pop-item">
                  <div class="color-item"></div>
                  <span style="margin-right: auto">Set color&icon</span>
                  <icon-base style="transform: rotate(-90deg)">
                    <Arrow/>
                  </icon-base>
                </div>
              </template>
              <template #pop>
                <div style="width: 5rem;height: 15rem;background-color: #fff3cd">etsetrset</div>
              </template>
            </popover>
            <div class="edit pop-item">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Pencil/>
              </icon-base>
              <span>Edit project details</span>
            </div>
            <div class="copy pop-item">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Link/>
              </icon-base>
              <span>Copy project link</span>
            </div>
            <div class="archive pop-item">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Archive/>
              </icon-base>
              <span>Archive</span>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </div>
</template>
<script setup>
import {More, TinyPlus, List, WorkSpace, Link, Star, Pencil, Archive, Arrow} from "@/components/icons"
</script>
<script>
import IconBase from "@/components/IconBase";
import SelectBar from "@/components/common/SelectBar";
import {apiHttpClient} from "@/app/app.service";
import Popover from "@/components/common/Popover";
import ToolTip from "@/components/common/ToolTip";

export default {
  name: "Projects",
  components: {ToolTip, Popover, SelectBar, IconBase},
  data() {
    return {
      isHover: false,
      isShadowed: false,
      options: [
        {'value': 'recents', "name": 'Recents'},
        {'value': 'favorites', "name": 'Favorites'},
      ],
      selectValue: '',
    }
  },
  props: {
    projectList: {
      type: Object,
      default: null
    }
  },
  created() {
  },
  methods: {
    handleScroll() {
      const item = this.$refs.projectItem
      this.isShadowed = item.scrollTop > 2;
    }
  }
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
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: .5rem;
  color: var(--black);
}

.header {
  display: flex;
  padding: 1.5rem 1.5rem 0 1.5rem;
  justify-content: flex-start;
  margin-bottom: .5rem;
}

.projects-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}

.header-shadow {
  box-shadow: 0 2px 10px 0 rgba(109, 110, 111, 0.1);
}

.projects-card .title {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
}

.no-border {
  border: none !important;
}

.project-name {
  font-weight: 600;
  margin-right: auto;
}

.select {
  margin-left: 1rem;
  height: 2rem;
  z-index: 1000;
}

.more {
  color: var(--gray);
  border-radius: .3rem;
  padding: .5rem;
  transition: background-color .3s;
  /*border: 1px solid rgba(0,0,0,.05);*/
}

.more:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}

.item {
  margin: 0 1rem;
  display: grid;
  width: calc(100% - 2rem);
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  overflow-y: auto;
  align-items: start;
}

.item-icon {
  border: 1px dashed var(--gray);;
  border-radius: 1rem;
  height: 3rem;
  width: 3rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  color: white;
  flex: 0 0 auto;
}

.item-option {
  display: flex;
  color: var(--gray);
  align-items: center;
  transition: background-color .3s;
  padding: .5rem .5rem;
  border-radius: .5rem;
  margin-bottom: .75rem;
}

.item-option:hover {
  background-color: #F9F8F8;
}

.pop-item {
  width: 14rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  background-color: white;
  padding: .7rem .7rem .7rem .7rem;
}

.pop-item:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}

.pop-item span {
  margin-left: 1rem;
}

.project-more {
  width: 2rem;
  height: 2rem;
}

.color-item {
  width: 1rem;
  height: 1rem;
  background-color: #fff3cd;
}
</style>