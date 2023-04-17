<template>
  <div class="home">
    <div class="title">
      <div class="date">{{ date }}</div>
      <div class="welcome">{{ welcome }} {{ user.nickname }}</div>
    </div>
<!--    统计-->
    <div class="analyze">
      <div class="select">
        <SelectBar class="select-bar" v-model="optionValue" :options=options :set-value=options[0]></SelectBar>
        <div class="segmentation"></div>
      </div>
      <div class="analyze-item">
        <IconBase width="1rem" height="1rem"><Right /></IconBase>
        <span class="task-numb">{{ taskNumb }}</span>
        <span> tasks completed</span>
      </div>
      <div class="analyze-item">
        <IconBase width="1rem" height="1rem" boxView="0 0 1020 1020"><WorkSpace /></IconBase>
        <span class="task-numb">{{ taskNumb }}</span>
        <span>collaborators</span>
      </div>
    </div>
<!--    卡片-->
    <div class="">
      <draggable v-model="list"  v-bind="dragOptions" class="home-card">
        <transition-group type="transition">
        <div v-for="element in list" :key="element.id" class="card-item">
            <component :is="element.name"></component>
        </div>
        </transition-group>
    </draggable>
    </div>
  </div>
</template>
<script setup>
import {Right,WorkSpace} from "@/components/icons"
</script>
<script>
import { VueDraggableNext } from 'vue-draggable-next'
import SelectBar from "@/components/SelectBar";
import IconBase from "@/components/IconBase";
import Tasks from "@/components/homeCard/Tasks"
import People from "@/components/homeCard/People"
import Projects from "@/components/homeCard/Projects"
import Goals from "@/components/homeCard/Goals"
export default {
  name: "HomeView",
  components: {IconBase, SelectBar, draggable: VueDraggableNext,Tasks,People,Projects,Goals},
  data() {
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }
    const date = new Date()
    const hour = date.getHours()
    let welcome = ''
    if(hour <= 12 && hour >= 4){
      welcome = 'Good Morning,'
    } else if (hour <= 18) {
      welcome = 'Good Afternoon,'
    } else {
      welcome = 'Good Evening,'
    }
    return {
      'date': date.toLocaleDateString('en-US', options),
      'welcome':welcome,
      'optionValue':'',
      'options':[
        {'value': 'week', "name": 'My week'},
        {'value': 'month', "name": 'My month'},
      ],
      'taskNumb':'4',
      'list':[{'name':"Tasks",'id':1},{'name':"People",'id':2},{'name':"Projects",'id':3},{'name':"Goals",'id':4}],
      drag: false
    }
  },
  props: {
    user: {
      type:Object,
      default:null
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
  }
}
</script>
<style scoped>
.home {
  background-color: #fff3cd;
  width: 100%;
  height: 100%;
  padding: 4rem 1rem 0 1rem;
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

.analyze {
  background-color: #f9f8f8;
  height: 3rem;
  border-radius: 3rem;
  width: 30rem;
  margin: 1rem auto;
  padding: .425rem 1.5rem;
  display: flex;
  align-items: center;
  font-size: .75rem;
  justify-content: space-between;
}

.analyze .select{
  display: flex;
  flex: 1;
  align-items: center;
}
.analyze .select .select-bar {
  height: 2rem;
  width: 7rem;
}
.segmentation {
  border-right: 1px solid rgba(0,0,0,.2 );
  height: 1.5rem;
}

.analyze-item {
  display: flex;
  align-items: center;
  color:#6d6e6f;
  flex: 1;
  justify-content: flex-end;
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
  width: auto;
  flex: 0 0 50%;
  border-radius: .5rem;
}


</style>