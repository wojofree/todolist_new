<template>
  <div class="home">
    <div class="width-12">
      <div class="title">
        <div class="date">{{ date }}</div>
        <div class="welcome">{{ welcome }} {{ user.nickname }}</div>
      </div>
      <!--    统计-->
      <div class="analyze">
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
      <!--    卡片-->
      <div class="">
        <draggable v-model="list" v-bind="dragOptions" class="home-card">
          <transition-group type="transition">
            <div v-for="(element,index) in list" :key="element.id" class="card-item" @mouseenter="isHover = index"
                 @mouseleave="isHover = false">
              <component :is="element.name" v-if="element.name === 'Tasks'" :projectList="projectList"
                         :analyzeValue="analyzeValue" @task-completed="taskCompletedNumb"></component>
              <component :is="element.name" v-else-if="element.name === 'Projects'"
                         :projectList="projectList"></component>
              <component :is="element.name" v-else></component>
              <!--    角标-->
              <Popover>
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
                  <div class="pop-main">
                    <div class="task-pop">
                      <IconBase width=".8rem" height=".8rem" icon-color="var(--gray)"
                                :class="{'vis-hidden':taskMenuSelect === 'half'}">
                        <Right/>
                      </IconBase>
                      <span class="size-control">Half size</span>
                    </div>
                    <div class="task-pop brd-bottom">
                      <IconBase width=".8rem" height=".8rem" icon-color="var(--gray)"
                                :class="{'vis-hidden':taskMenuSelect === 'full'}">
                        <Right/>
                      </IconBase>
                      <span class="size-control">Full size</span>
                    </div>
                    <div class="task-pop brd-bottom">
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
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script setup>
import ToolTip from "@/components/ToolTip";
</script>
<script>
import {VueDraggableNext} from 'vue-draggable-next'
import SelectBar from "@/components/SelectBar";
import IconBase from "@/components/IconBase";
import Tasks from "@/components/homeCard/Tasks"
import People from "@/components/homeCard/People"
import Projects from "@/components/homeCard/Projects"
import Goals from "@/components/homeCard/Goals"
import {More, Trash, Eye, WorkSpace, Right} from "@/components/icons"
import Popover from "@/components/Popover"

export default {
  name: "HomeView",
  components: {
    IconBase,
    SelectBar,
    draggable: VueDraggableNext,
    Tasks,
    People,
    Projects,
    Goals,
    More,
    Popover,
    Trash,
    Eye,
    WorkSpace,
    Right
  },
  data() {
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
    return {
      date: date.toLocaleDateString('en-US', options),
      welcome: welcome,
      analyzeValue: '',
      options: [
        {'value': 'week', "name": 'My week'},
        {'value': 'month', "name": 'My month'},
      ],
      taskNumb: [0],
      list: [{'name': "Tasks", 'id': 1}, {'name': "Projects", 'id': 2}, {'name': "People", 'id': 3}, {
        'name': "Goals",
        'id': 4
      }],
      drag: false,
      isHover: false,
      taskMenuSelect: 'full'
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
  methods: {
    taskCompletedNumb(numb) {
      this.taskNumb = numb.toString().split('')
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
  background-color: #fff3cd;
  width: 100%;
  padding: 4rem 1rem 0 1rem;
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

.title .date {
  font-size: 1rem;
}

.title .welcome {
  font-size: 2rem;
}

.pop-main {
  width: max-content;
  display: flex;
  flex-direction: column;
}

.task-pop {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  padding: .8rem 3rem .8rem .8rem;
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
  margin: 1rem auto;
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
}

.card-item {
  position: relative;
  width: 100%;
  flex: 0 0 50%;
  border-radius: .5rem;
}

.width-12 {
  max-width: 75rem;
  margin: auto;
}

.more {
  position: absolute;
  top: 1.5rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
}

.more-item {
  padding: .5rem;
  border-radius: .2rem;
  transition: background-color .3s;
  color: var(--gray);
}

.more-item:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}
</style>