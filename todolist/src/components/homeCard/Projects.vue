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
      <!--       创建project-->
      <div class="item-option add-project cursor">
        <div class="item-icon icon-plus">
          <IconBase width="3rem" height="3rem" icon-color="#6d6e6f" box-view="0 0 48 48">
            <TinyPlus/>
          </IconBase>
        </div>
        <span>Create project</span>
      </div>
      <!--      projectList-->
      <div class="item-option cursor" v-for="item in projectListCache" :key="item.id" @mouseenter="projectHover = item"
           @mouseleave="this.projectHover = ''">
        <div class="item-icon no-border" :style="{'backgroundColor':item.color}">
          <IconBase width="1.5rem" height="1.5rem" box-view="0 0 24 24" class="mag-auto">
            <component :is="this.projectIconList[item.icon]"></component>
          </IconBase>
        </div>
        <div class="project-title text-overflow">
          <span class="project-name">{{ item.name }}</span>
          <div class="archived" v-if="item.archive">
            <icon-base box-view="0 0 24 24" width=".75rem" height=".75rem">
              <SolidArchived/>
            </icon-base>
            <span>Archived</span>
          </div>
        </div>
        <!--        projcect选项-->
        <Popover>
          <template #main>
            <div class="project-more" :class="{'vsb-hidden':projectHover !== item}">
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
            <div class="share pop-item cursor">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <WorkSpace/>
              </icon-base>
              <span>Share...</span>
            </div>
            <div class="favorite pop-item cursor" @click="changeProject(item,{'favorite':!item.favorite})">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32" v-if="!item.favorite">
                <Star/>
              </icon-base>
              <icon-base icon-color="#F06A6A" box-view="0 0 1000 1000" v-else>
                <SolidStar/>
              </icon-base>
              <span v-if="!item.favorite">Add to favorites</span>
              <span v-else>Remove from favorites</span>
            </div>
            <!--            颜色设置-->
            <popover pop-position="side" hover-control :click-close="false" direction="flex-start">
              <template #main>
                <div class="set-color pop-item cursor" @mouseenter="this.colorSelect = item.color">
                  <div class="color-icon" :style="{'backgroundColor':item.color}"></div>
                  <span>Set color&icon</span>
                  <icon-base style="transform: rotate(-90deg)">
                    <Arrow/>
                  </icon-base>
                </div>
              </template>
              <template #pop>
                <div class="set-color">
                  <div class="color-selection brd-bottom">
                    <label v-for="color in colorList" :style="{'color':color}" class="color-item cursor"
                           @click="changeColor(item,{'color':color})">
                      <icon-base width=".7rem" height=".7rem" class="color-right" v-show="colorSelect === color">
                        <Right/>
                      </icon-base>
                    </label>
                  </div>
                  <div class="icon-selection">
                    <div v-for="icon in iconList" class="icon-option cursor"
                         :class="{'icon-back':icon.name === item.icon}" @click="changeProject(item,{'icon':icon.name})">
                      <icon-base width="1.5rem" height="1.5rem" box-view="0 0 24 24">
                        <component :is="icon.value"></component>
                      </icon-base>
                    </div>
                  </div>
                </div>
              </template>
            </popover>
            <div class="edit pop-item cursor" @click="editProject(item)">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Pencil/>
              </icon-base>
              <span>Edit project details</span>
            </div>
            <div class="copy pop-item cursor">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32">
                <Link/>
              </icon-base>
              <span>Copy project link</span>
            </div>
            <div class="archive pop-item cursor" @click="changeProject(item,{'archive':!item.archive})">
              <icon-base icon-color="var(--gray)" box-view="0 0 32 32" v-if="!item.archive">
                <Archive/>
              </icon-base>
              <icon-base icon-color="var(--gray)" box-view="0 0 24 24" v-else>
                <SolidArchived/>
              </icon-base>
              <span v-if="!item.archive">Archive</span>
              <span v-else>Unarchive</span>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </div>
  <new-button @click="openMessage = true">test</new-button>
  <message-box v-model="openMessage" :icon-position="{top:'1rem',right:'1rem'}">
    <div class="project-detail">
      <div class="detail-title brd-bottom">
        <span>Project details</span>
      </div>
      <div class="detail-main">
        <div class="input">
          <label>Name</label>
          <new-input v-model="projectName"></new-input>
        </div>
        <div class="project-info brd-bottom">
          <div class="input">
            <label>Owner</label>
            <div class="item-info">
            <div class="user-icon">{{this.currentProject['created_by'].username[0]}}</div>
              <span>{{this.currentProject['created_by'].username}}</span>
            </div>
          </div>
          <div class="input">
            <label>Due date</label>
            <div>
              <date-pick v-model="dateValue">
                <div class="due-date">
                  <icon-base width="1rem" height="1rem" box-view="0 0 32 32">
                    <Calendar />
                  </icon-base>
                  <span>No due date</span>
                </div>
              </date-pick>
            </div>
          </div>
        </div>
      </div>
    </div>
  </message-box>
  <DatePick v-model="dateValue"></DatePick>
</template>
<script setup>
import {
  More, TinyPlus, List, WorkSpace, Link, Star, Pencil, Archive, Arrow, People,
  Graph,
  DarkStar,
  Gear,
  Chat,
  Symbols,
  TimeLine,
  Bord,
  SolidStar,
  Right,
  SolidArchived
} from "@/components/icons"
import MessageBox from "@/components/common/MessageBox";
import NewButton from "@/components/common/NewButton";
import NewInput from "@/components/common/NewInput";
import DatePick from "@/components/common/DateTimePicker";
import Calendar from "@/components/icons/Calendar";
</script>
<script>
import {markRaw} from 'vue'
import IconBase from "@/components/IconBase";
import SelectBar from "@/components/common/SelectBar";
import {apiHttpClient} from "@/app/app.service";
import Popover from "@/components/common/Popover";
import ToolTip from "@/components/common/ToolTip";

export default {
  dateValue:'',
  name: "Projects",
  components: {ToolTip, Popover, SelectBar, IconBase},
  data() {
    return {
      dateValue:'2023-05-01',
      currentProject:{'created_by':{username:'test'}},
      projectName: 'test',
      openMessage: false,
      isHover: false,
      isShadowed: false,
      options: [{'value': 'recents', "name": 'Recents'}, {'value': 'favorites', "name": 'Favorites'},],
      selectValue: '',
      colorList: ['#C6C4C4', '#F06A6A', '#EC8E71', '#E9BF78', '#F8DF72', '#B4CE67', '#6D9F84', '#6CBEB9', '#AEE5E2', '#5072CB', '#8B84E1', '#A96ECE', '#EDADEB', '#E277B0', '#ED9B9B', '#68696A'],
      iconList: [{name: 'List', value: markRaw(List)}, {name: 'Bord', value: markRaw(Bord)}, {name: 'TimeLine', value: markRaw(TimeLine)}, {name: 'People', value: markRaw(People)}, {name: 'Graph', value: markRaw(Graph)}, {name: 'DarkStar', value: markRaw(DarkStar)}, {name: 'Gear', value: markRaw(Gear)}, {name: 'Chat', value: markRaw(Chat)}, {name: 'Symbols', value: markRaw(Symbols)}],
      projectIconList: {List: markRaw(List), Bord: markRaw(Bord), TimeLine: markRaw(TimeLine), People: markRaw(People), Graph: markRaw(Graph), DarkStar: markRaw(DarkStar), Gear: markRaw(Gear), Chat: markRaw(Chat), Symbols: markRaw(Symbols)
      },
      colorSelect: '',
      projectHover: '',
      projectListCache: []
    }
  },
  props: {
    projectList: {
      type: Object,
      default: null
    }
  },
  watch: {
    projectList(item) {
      this.projectListCache = item
    },
    selectValue(newValue) {
      if (newValue.value === 'recents') {
        this.projectListCache = this.projectList;
      } else if (newValue.value === 'favorites') {
        this.projectListCache = this.projectList.filter(item => item.favorite);
      }
    }

  },
  methods: {
    handleScroll() {
      const item = this.$refs.projectItem
      this.isShadowed = item.scrollTop > 2;
    },
    changeColor(project, data) {
      const oldColor = this.colorSelect
      this.colorSelect = data.color
      if (oldColor !== this.colorSelect) {
        this.changeProject(project, data)
      }
    },
    changeProject(project, data) {
      if (!data.favorite && this.selectValue.value === 'favorites') {
        this.projectListCache = this.projectListCache.filter(item => item !== project);
      }
      const url = "/api/update_project/"
      data['project_id'] = project.id
      apiHttpClient.post(url, data).then((response) => {
        const index = this.projectListCache.indexOf(project)
        this.projectListCache[index] = response.data.results
      })
    },
    editProject(item) {
      this.currentProject = item
      this.projectName = item.name
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

.archived {
  display: flex;
  align-items: center;
  margin-bottom: .25rem;
  color: var(--gray);
}

.archived span {
  font-size: .75rem;
  margin-left: .25rem;
}

.header-shadow {
  box-shadow: 0 2px 10px 0 rgba(109, 110, 111, 0.1);
}

.projects-card .title {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
}

.project-title {
  text-align: left;
  margin-right: auto;
}

.no-border {
  border: none !important;
}

.project-name {
  font-weight: 500;
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
  color: var(--black);
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
  width: 15rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  background-color: white;
  padding: .7rem .5rem .7rem .7rem;
}

.pop-item:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}

.pop-item span {
  margin-left: .7rem;
}

.project-more {
  width: 2rem;
  height: 2rem;
}

.color-icon {
  width: 1rem;
  height: 1rem;
  background-color: #fff3cd;
  color: #AFABAC;
}

.color-icon:hover {
  background-color: ;
}

.color-selection {
  display: flex;
  flex-wrap: wrap;
  width: 15rem;
  padding: 1.5rem;
  justify-content: space-around;
}

.icon-selection {
  height: 14.25rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.brd-bottom {
  border-bottom: 1px solid #ECEAE9;
}

.color-item {
  background-color: currentColor;
  width: 1.25rem;
  height: 1.25rem;
  margin: .125rem;
  border-radius: .25rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-item:hover {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08));
}

.color-right {
  filter: grayscale(1) contrast(999) invert(1);
}

.icon-option {
  width: 2.75rem;
  height: 2.75rem;
  /*background-color: #fff3cd;*/
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .625rem;
}

.icon-back {
  background-color: v-bind(colorSelect);
  color: white;
}

.icon-back {
  background-color: v-bind(colorSelect) !important;
  color: white;
}

.icon-option:hover {
  background-color: v-bind(colorSelect+50);
}

.set-color {
  width: 15rem;
}

.set-color span {
  margin-right: auto
}

.vsb-hidden {
  visibility: hidden;
}

.add-project {
  font-weight: 500;
  color: var(--gray);
}

.add-project:hover {
  color: var(--black);
}

.icon-plus {
  color: var(--gray);
}

.project-detail {
  width: 33rem;
  height: 31rem;
  background-color: white;
  border-radius: 1rem;
  text-align: left;
}

.detail-title {
  padding: 1rem 1.6rem;
}

.detail-title span {
  font-size: 1.25rem;
  color: var(--black);
  text-align: left;
  font-weight: 500;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input label {
  color: var(--gray);
  margin-bottom: .5rem;
  font-size: .75rem;
}

.detail-main {
  padding: 1.5rem;
}

.project-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.user-icon {
  width: 1.75rem;
  height: 1.75rem;
  background-color: #f8df72;
  border-radius: 2rem;
  text-align: center;
  font-weight: 500;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: .2rem .6rem;
  border-radius: .3rem;
}

.item-info:hover {
  background-color: rgb(248, 246, 246);
}

.item-info span {
  margin-left: .5rem;
}

.due-date{
  display: flex;
  flex-direction: row;
  width: 10rem;
  color:var(--gray);
}
</style>