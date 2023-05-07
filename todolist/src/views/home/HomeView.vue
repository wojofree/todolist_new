<template>
  <div class="home">
    <div class="width-12">
      <div class="title">
        <div class="date">{{ date }}</div>
        <div class="welcome">{{ welcome }} {{ user.nickname }}</div>
      </div>
      <!--    统计-->
      <div class="analyze-swap">
        <div class="analyze grid">
          <div class="select">
            <SelectBar class="select-bar" v-model="analyzeValue" :options=options></SelectBar>
            <div class="segmentation"></div>
          </div>
          <div class="analyze-item">
            <IconBase width="1rem" height="1rem">
              <Right/>
            </IconBase>
            <div class="completed-numb task-numb">
              <div v-for="item in taskNumb" class="numb" :style="{'transform':'translateY(-'+item*10+'%)'}">
                <div v-for="i of 10"><span>{{ i - 1 }}</span></div>
              </div>
            </div>
            <span> tasks completed</span>
          </div>
          <div class="analyze-item">
            <IconBase width="1rem" height="1rem" boxView="0 0 32 32">
              <WorkSpace/>
            </IconBase>
            <span class="task-numb">{{ taskNumb[0] }}</span>
            <span>collaborators</span>
          </div>
        </div>
        <new-button backgroundStyle="#f9f8f8" class="grid home-button" @click="isOpenDrawer = true">
          <IconBase box-view="0 0 32 32">
            <Apps/>
          </IconBase>
          <span>Customize</span>
        </new-button>
      </div>
      <!--    卡片-->
      <draggable v-model="list" v-bind="dragOptions" class="home-card">
        <transition-group type="transition">
          <div v-for="(element,index) in list" :key="element.id" class="card-item" @mouseenter="isHover = index"
               @mouseleave="isHover = false" :style="{'flex':this.flex[element.name]}">
            <component :is="element.name" v-if="element.name === 'Tasks'" :projectList="projectList"
                       :analyzeValue="analyzeValue" @task-completed="taskCompletedNumb"></component>
            <component :is="element.name" v-else-if="element.name === 'Projects'"
                       :projectList="projectList"></component>
            <component :is="element.name" v-else></component>
            <!--    角标-->
            <div class="more-swap">
              <Popover direction="flex-end" popPosition="under">
                <template #main>
                  <div class="more">
                    <ToolTip content="Actions">
                      <div class="cursor more-item">
                        <IconBase width="1.2rem" height="1.2rem" box-view="0 0 24 24" class="mag-auto">
                          <More/>
                        </IconBase>
                      </div>
                    </ToolTip>
                  </div>
                </template>
                <template #pop>
                  <!--                  task 角标菜单-->
                  <div class="pop-main">
                    <div class="task-pop" @click="changeSize(element.name,'half')">
                      <IconBase width=".8rem" height=".8rem" icon-color="var(--gray)"
                                :class="{'vis-hidden':this.MenuSelect[element.name] === 'full'}">
                        <Right/>
                      </IconBase>
                      <span class="size-control">Half size</span>
                    </div>
                    <div class="task-pop brd-bottom"
                         @click="changeSize(element.name,'full')">
                      <IconBase width=".8rem" height=".8rem" icon-color="var(--gray)"
                                :class="{'vis-hidden':this.MenuSelect[element.name] === 'half'}">
                        <Right/>
                      </IconBase>
                      <span class="size-control">Full size</span>
                    </div>
                    <div class="task-pop brd-bottom" v-if="element.name === 'Tasks'">
                      <IconBase width="1rem" height="1rem" icon-color="var(--gray)" box-view="0 0 32 32">
                        <Eye/>
                      </IconBase>
                      <span>View all my tasks</span>
                    </div>
                    <div class="task-pop trash">
                      <IconBase width="1rem" height="1rem" box-view="0 0 32 32">
                        <Trash/>
                      </IconBase>
                      <span>Remove widget</span>
                    </div>
                  </div>
                </template>
              </Popover>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <CustomizeHome @backColor="backColor" v-model="isOpenDrawer"></CustomizeHome>
  </div>
</template>
<script setup>
import ToolTip from "@/components/common/ToolTip";
import NewButton from "@/components/common/NewButton";
import CustomizeHome from "@/components/homePage/CustomizeHome";
import {More, Trash, Eye, WorkSpace, Right, Apps} from "@/components/icons"
import IconBase from "@/components/IconBase";
</script>
<script>
import {VueDraggableNext} from 'vue-draggable-next'
import SelectBar from "@/components/common/SelectBar";
import Tasks from "@/components/homeCard/Tasks"
import People from "@/components/homeCard/People"
import Projects from "@/components/homeCard/Projects"
import Goals from "@/components/homeCard/Goals"
import {apiHttpClient} from "@/app/app.service";
import Popover from "@/components/common/Popover"

export default {
  name: "HomeView",
  components: {
    SelectBar,
    draggable: VueDraggableNext,
    Tasks,
    People,
    Projects,
    Goals,
    Popover,
  },
  data() {
    return {
      date: '',
      welcome: '',
      analyzeValue: '',
      options: [
        {'value': 'week', "name": 'My week'},
        {'value': 'month', "name": 'My month'},
      ],
      taskNumb: [0],
      list: [{'name': 'Tasks', 'id': 1},{'name': 'Projects', 'id': 2},{'name': 'People', 'id': 3},{'name': 'Goals', 'id': 4}],
      drag: false,
      isHover: false,
      MenuSelect: {Tasks:'half',People:'half',Projects:'half',Goals:'half'},
      flex: {"Goals": "0 0 50%", "People": "0 0 50%", "Projects": "0 0 50%", "Tasks": "0 0 50%"},
      backgroundColor: '#AD7CC4',
      isOpenDrawer: false,
    }
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    projectList: {
      type: Object,
      default: null
    }
  },
  created() {
    this.getUserSetting()
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }
    const date = new Date()
    const hour = date.getHours()
    let welcome = ''
    if (hour <= 12 && hour >= 4) {
      welcome = 'Good Morning,'
    } else if (hour <= 18) {
      welcome = 'Good Afternoon,'
    } else {
      welcome = 'Good Evening,'
    }
    this.date = date.toLocaleDateString('en-US', options)
    this.welcome = welcome
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  watch:{
    list(newValue){
      const url = "/api/update_setting/"
      const data = {"home_card":JSON.stringify(newValue)}
      apiHttpClient.post(url,data)
    },
  },
  methods: {
    changeSize(card,type){
      this.MenuSelect[card] = type
      this.flex[card] = type==='half'?'0 0 50%':'0 0 100%'
      const url = "/api/update_setting/"
      const data = {"card_size":JSON.stringify(this.flex)}
      apiHttpClient.post(url,data)
    },
    taskCompletedNumb(numb) {
      this.taskNumb = numb.toString().split('')
    },
    backColor(item) {
      this.backgroundColor = item
    },
    getUserSetting() {
      const url = "/api/user_setting"
      apiHttpClient.get(url).then((response) => {
        this.backgroundColor = response.data.results.background_color
        this.list = response.data.results.home_card
        this.flex = response.data.results.card_size
        const FLEX_FULL = '0 0 100%'
        for(let key in this.flex){
          this.MenuSelect[key] = this.flex[key] === FLEX_FULL?'full':'half'
        }
      })
    }
  }
}
</script>
<style scoped>
.completed-numb {
  display: flex;
  height: 2rem;
  overflow-y: hidden;
}

.home {
  background-color: v-bind(backgroundColor);
  color: v-bind(backgroundColor);
  width: 100%;
  padding: 4rem 1rem 0 1rem;
  height: calc(100vh - 3.4rem);
  overflow-y: auto;
  overflow-x: hidden;
}

.trash {
  color: #c92f54;
}

.numb {
  display: inline-block;
  height: fit-content;
  transition: transform .5s ease-in-out;
}

.title {
  font-weight: 500;
}

.title::selection {
  background-color: #BCD6FB;
}

.title .date {
  font-size: 1rem;
  filter: grayscale(1) contrast(999) invert(1);
}

.analyze-swap {
  color: var(--gray);
  display: grid;
  margin: 1rem auto;
  align-items: end;
}

.grid {
  grid-column-start: 1;
  grid-row-start: 1
}

.title .welcome {
  font-size: 2rem;
  filter: grayscale(1) contrast(999) invert(1)
}

*::selection {
  background-color: #BCD6FB !important; /* 高优先级，设置选中文字的背景色 */
  color: #000 !important; /* 高优先级，设置选中的文字颜色 */
}

.pop-main {

}

.task-pop {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  padding: .7rem 3rem .7rem .8rem;
}

.task-pop:hover {
  background-color: #F9F8F8;
}

.brd-bottom {
  border-bottom: 1px solid #ECEAE9;
}

.size-control {
  margin-left: 1.2rem !important;
}

.task-pop span {
  margin-left: 1rem;
}

.analyze {
  background-color: #f9f8f8;
  height: 3rem;
  border-radius: 3rem;
  max-width: 40rem;
  width: max-content;
  margin: 0 auto;
  padding: .425rem 1.5rem;
  display: flex;
  align-items: center;
  font-size: .75rem;
  justify-content: space-between;
}

.analyze .select {
  display: flex;
  flex: 1;
  align-items: center;
}

.analyze .select .select-bar {
  height: 2rem;
  width: 5.5rem;
}

.segmentation {
  border-right: 1px solid rgba(0, 0, 0, .2);
  height: 1.5rem;
}

.analyze-item {
  display: flex;
  align-items: center;
  color: var(--gray);
  flex: 1;
  justify-content: flex-end;
  margin-left: 1rem;
}

.analyze-item span {
  white-space: nowrap;
  transition: all 0.5s ease-in-out;
}

.vis-hidden {
  visibility: hidden;
}

.task-numb {
  font-size: 1.25rem;
  margin: 0 .5rem;
  font-weight: 500;
}

.home-card {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  color: var(--black);
}

.card-item {
  position: relative;
  width: 100%;
  border-radius: .5rem;
  transition: flex .3s;
}

.width-12 {
  max-width: 75rem;
  margin: auto;
}

.more-swap {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.more {
  width: 2rem;
  height: 2rem;
}

.more-item {
  padding: .5rem;
  border-radius: .2rem;
  transition: background-color .3s;
  color: var(--gray);
}

.home-button {
  margin-right: .5rem;
  display: flex;
  align-items: center;
}

.home-button span {
  margin-left: .5rem;
}

.more-item:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}
</style>