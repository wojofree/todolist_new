<template>
  <div class="task-card" @mouseenter="isHover = true" @mouseleave="isHover = false" ref="taskCard">
    <!--    header-->
    <div class="header">
      <IconBase width="3rem" height="3rem" box-view="0 0 48 48" class="avatar cursor">
        <Avatar/>
      </IconBase>
      <div class="tab-navigation-bar">
        <div class="d-flex header-title">
          <div class="title cursor mrg-r-5">My Tasks</div>
          <IconBase width="0.75rem" height="0.75rem" color="var(--gray)">
            <Lock/>
          </IconBase>
        </div>
        <TabBar v-model="tabValue" :options=tabOptions></TabBar>
      </div>
    </div>
    <!--    任务区-->
    <div class="task-main" ref="taskSwap">
      <!--      添加任务-->
      <div class="create-item" v-show="tabValue === 'upComing'" ref="taskCreate">
        <div class="mini-icon">
          <IconBase width="1rem" height="1rem" box-view="0 0 40 40" color="#afabac">
            <Done/>
          </IconBase>
        </div>
        <div class="task-input">
          <span class="hidden-input text-overflow" ref="hiddenInput">{{ taskValue }}</span>
          <input class="add-task-input" v-model="taskValue"
                 :placeholder=taskPlaceHolder
                 :class="{'isValue':taskValue !== ''}"
                 @focus="taskPlaceHolder = 'What\'s the next thing on your plate?',isWhenActive = false,isProjectActive = false"
                 @blur="taskPlaceHolder = 'Click here t o add a task...', isTaskActive = false"
                 @input="taskTips"
                 ref="taskValue"
                 @keydown="chooseWhen"
          />
        </div>
        <!--        when input-->
        <div class="task-input mg-l-5" v-show="isWhenActive">
          <input class="add-task-input when-input" v-model="taskWhenValue"
                 placeholder="When?"
                 :class="{'isValue':taskWhenValue !== ''}"
                 @keydown="selectWhen"
                 @input="searchWhen"
                 ref="taskWhenValue"
                 @focus="whenSelectShow = true,isProjectActive = false"
                 @blur="hiddenSelect('when')"
          />
        </div>
        <!--        project input-->
        <div class="task-input mg-l-5" v-show="isProjectActive">
          <input class="add-task-input when-input" v-model="taskProjectValue"
                 placeholder="Which project?"
                 :class="{'isValue':taskProjectValue !== ''}"
                 ref="taskProjectValue"
                 @focus="projectSelectShow = true"
                 @blur="hiddenSelect('project')"
                 @keydown="selectProject"
                 @input="searchProject"
          />
        </div>
      </div>
      <!--      任务列表-->
      <div class="item-main" ref="taskMain">
        <div class="task-item" v-for="(task,index) in taskList"
             :class="{'completed-background':isDelete === index && tabValue !== 'completed'}"
             @mouseenter="isCalendar = index" @mouseleave="isCalendar = true">
          <div class="cursor" @click="completeTask(task,index)"
               :class="{'completed-icon':tabValue === 'completed','mini-icon':tabValue !== 'completed'}">
            <IconBase width="1rem" height="1rem" box-view="0 0 40 40">
              <Completed v-if="tabValue === 'completed'"/>
              <Done v-else/>
            </IconBase>
          </div>
          <div class="text-overflow w-100 text-start">
            <span>{{ task.title }}</span>
          </div>
          <div v-if="task.project !== null" class="text-overflow flex-auto list-project" v-show="isDelete !== index">
            <span class="text-overflow">{{ task.project.name }}</span>
          </div>
          <div class="flex-auto mrg-l-5" v-show="isDelete !== index">
            <div class="calendar vsb-hidden" v-if="task.complete_date === null" :class="{'vsb-visible':isCalendar === index}">
              <IconBase width=".75rem" height=".75rem" box-view="0 0 24 24">
                <Calendar/>
              </IconBase>
            </div>
            <span :class="{'overdue':tabValue === 'overDue','completed':tabValue === 'completed'}">{{
                task.complete_date
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <DatePick></DatePick>
    </div>
    <!--    show more-->
    <div class="show-more cursor" v-show="isShowMore" @click="overFlow = 'auto',isShowMore = false">
      <span>Show more</span>
    </div>
    <!--    角标-->
    <div class="more cursor" v-show="isHover">
      <IconBase width="1.2rem" height="1.2rem" box-view="0 0 24 24" class="mag-auto">
        <More/>
      </IconBase>
    </div>
  </div>
  <!--    输入框提示-->
  <div class="input-tips" v-show="isTaskActive" ref="tips">
    <span>Tab</span>
    to set due date or
    <span class="return">↵ Return</span>
    to create
  </div>
  <!--  whenSelection-->
  <div class="when-select" v-show="whenSelectShow">
    <div class="select-option cursor" v-for="(item,index) in currentWhenList"
         :class="{'when-active':whenSelectIndex === index,'borderTop':item.value === 'none'}"
         @mouseenter="whenSelectIndex = index" @click="selectWhen">
      <div>
        <span>{{ item.name }}</span>
      </div>
      <div>
        <span class="return">↵ Return</span>
      </div>
    </div>
  </div>
  <!--  projectSelection-->
  <div class="project-select" v-show="projectSelectShow" ref="selectWrapper">
    <div class="select-option cursor" v-for="(item,index) in currentProjectList"
         :class="{'when-active':projectSelectIndex === index,'borderBottom':item.id === 0}"
         @mouseenter="projectSelectIndex = index"
         @click="selectProject"
    >
      <div class="text-overflow dsp-flx">
        <icon-base v-if="item.id === 0" color="var(--gray)" class="mrg-r-5" width=".7rem" height=".7rem">
          <Lock/>
        </icon-base>
        <span>{{ item.name }}</span>
        <span v-if="item.id === 0" class="small-span">Private to me</span>
      </div>
      <div class="flex-auto">
        <span class="return">↵ Return</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {Avatar, Done, Lock, More, Completed, Calendar} from "@/components/icons"
import TabBar from "@/components/TabBar";
import {apiHttpClient} from "@/app/app.service";
import DatePick from "@/components/DateTimePicker";

export default {
  name: "Tasks",
  components: {DatePick, Calendar, Completed, TabBar, Avatar, IconBase, More, Done, Lock},
  data() {
    return {
      tabValue: '',
      cache: {},
      tabOptions: [
        {'name': 'Upcoming', 'value': 'upComing'},
        {'name': 'Overdue', 'value': 'overDue'},
        {'name': 'Completed', 'value': 'completed'}
      ],
      isHover: false,
      isShowMore: false,
      overFlow: 'hidden',
      taskList: [],
      isCalendar: true,
      taskPlaceHolder: 'Click here t o add a task...',
      taskValue: '',
      isDelete: '',
      isTaskActive: false,
      tipsTop: 1,
      tipsLeft: 0,
      whenLeft: 0,
      projectRight: 0,
      whenTop: 0,
      isWhenActive: false,
      whenSelectShow: false,
      isProjectActive: false,
      taskWhenValue: '',
      taskProjectValue: '',
      whenList: [{'name': 'Today', 'value': 'today'},
        {'name': 'Tomorrow', 'value': 'tomorrow'},
        {'name': 'Next week', 'value': 'nextWeek'},
        {'name': 'Next month', 'value': 'nextMonth'},
        {'name': 'Monday', 'value': 'monday'},
        {'name': 'TuesDay', 'value': 'tuesday'},
        {'name': 'Wednesday', 'value': 'wednesday'},
        {'name': 'Thursday', 'value': 'thursday'},
        {'name': 'Friday', 'value': 'friday'},
        {'name': 'Saturday', 'value': 'saturday'},
        {'name': 'Sunday', 'value': 'sunday'},
      ],
      currentWhenList: [
        {'name': 'Today', 'value': 'today'},
        {'name': 'Tomorrow', 'value': 'tomorrow'},
        {'name': 'Next week', 'value': 'nextWeek'},
        {'name': 'Next month', 'value': 'nextMonth'},
        {'name': 'No Due date', 'value': 'none'}
      ],
      noneList: [{'name': 'No Due date', 'value': 'none'}],
      whenSelectIndex: 0,
      projectSelectIndex: 0,
      projectSelectShow: false,
      currentProjectList: []
    }
  },
  props: {
    projectList: {
      type: Object,
      default: null
    }
  },
  async created() {
    // 获取taskList
    const now = new Date();
    const response = await apiHttpClient.post("/api/get_tasks/");
    const taskList = response.data.results.map(formatTaskData(now));
    // 对全部任务按照 complete_time 升序排序，并让 null 放在最后
    const upComingListCopy = filterTasks(taskList, 'upComing', now).slice();
    upComingListCopy.sort((a, b) => {
      if (a.complete_time === null) {
        return 1;
      }
      if (b.complete_time === null) {
        return -1;
      }
      return new Date(a.complete_time) - new Date(b.complete_time);
    });
    // 缓存数据，tab切换用
    this.cache = {
      upComing: upComingListCopy,
      overDue: filterTasks(taskList, 'overDue', now).sort((a, b) => b.id - a.id),
      completed: filterTasks(taskList, 'completed', now).sort((a, b) => b.id - a.id)
    }
    // 初始化taskList
    this.taskList = this.cache.upComing
    this.tabOptions[1].name = "Overdue (" + this.cache['overDue'].length + ")"
    await this.$nextTick(() => {
      this.showMore()
    })
  },
  watch: {
    // 切换tab
    tabValue() {
      this.taskList = this.cache[this.tabValue]
      this.$nextTick(() => {
        this.showMore()
      })
    }
  },
  methods: {
    // projectList恢复默认值
    handleProjectListChange() {
      this.currentProjectList = [{'name': 'No project', 'id': 0}].concat(this.projectList)
    },
    // 隐藏输输入框
    hiddenSelect(type) {
      setTimeout(() => {
        if (type === 'when') {
          this.whenSelectShow = false
        } else {
          this.projectSelectShow = false
        }
      }, 100)
    },
    // 新增任务input的提示框，跟随文字移动
    taskTips() {
      this.isTaskActive = true
      const {top, left} = this.$refs.hiddenInput.getBoundingClientRect()
      this.tipsTop = top + 39 + 'px'
      this.tipsLeft = left + Math.min(this.$refs.hiddenInput.offsetWidth, this.$refs.taskValue.offsetWidth) + 'px'
    },
    // 监听task input的按键，tab和回车时跳转到when的input框
    chooseWhen(event) {
      if (event.key === 'Tab' && this.taskValue !== '') { // 修改if语句的条件，使用key属性来判断按键
        this.isWhenActive = true
        this.$nextTick(() => {
          const {left} = this.$refs.taskWhenValue.getBoundingClientRect()
          const {top} = this.$refs.hiddenInput.getBoundingClientRect()
          this.whenLeft = left + 'px'
          this.whenTop = top + 41 + 'px'
        })
      }
    },
    // when输入框focus时,监听键盘和鼠标
    selectWhen() {
      const {right} = this.$refs.taskCard.getBoundingClientRect()
      this.projectRight = window.innerWidth - right + 'px'
      this.handleProjectListChange()
      // 端盘时键盘输入触发，还是点击触发
      if (event.keyCode) {
        switch (event.keyCode) {
            // 跳转到project选择
          case 9: // Tab键
          case 13: // Enter键
            this.isProjectActive = true
            this.taskWhenValue = this.currentWhenList[this.whenSelectIndex].name
            event.preventDefault()
            this.$nextTick(() => {
              this.$refs.taskProjectValue.focus()
            })
            break;
          case 40: // 下箭头
            this.whenSelectIndex = (this.whenSelectIndex + 1) % this.currentWhenList.length
            break;
          case 38: // 上箭头
            this.whenSelectIndex = (this.currentWhenList.length + this.whenSelectIndex - 1) % this.currentWhenList.length
            break;
          default:
            break;
        }
      } else { //鼠标点击选择when
        this.isProjectActive = true
        this.taskWhenValue = this.currentWhenList[this.whenSelectIndex].name
        this.$nextTick(() => {
          this.$refs.taskProjectValue.focus()
        })
      }
    },
    // 选择project，监听键盘和鼠标
    selectProject() {
      // 键盘时
      if (event.keyCode) {
        switch (event.keyCode) {
          case 9: // Tab键
          case 13: // Enter键
            // 创建任务，待完成
            this.taskProjectValue = this.currentProjectList[this.projectSelectIndex].name
            break;
          case 40: // 下箭头
            this.projectSelectIndex = (this.projectSelectIndex + 1) % this.currentProjectList.length
            this.scrollToActiveOption()
            break;
          case 38: // 上箭头
            this.projectSelectIndex = (this.currentProjectList.length + this.projectSelectIndex - 1) % this.currentProjectList.length
            this.scrollToActiveOption()
            break;
          default:
            break;
        }
      } else { //鼠标点击选择
        this.taskProjectValue = this.currentProjectList[this.projectSelectIndex].name
      }
    },
    // project选择时，上下键附带滚动
    scrollToActiveOption() {
      const activeOption = this.$refs.selectWrapper.querySelector('.when-active')
      const selectWrapper = this.$refs.selectWrapper
      // 如果没有活动元素，则返回
      if (!activeOption) return
      // 计算选项的偏移量和容器滚动的距离
      const optionTop = activeOption.offsetTop
      const optionHeight = activeOption.offsetHeight
      const wrapperHeight = selectWrapper.clientHeight
      // 将页面滚动到正确的位置
      selectWrapper.scrollTop = optionTop - (wrapperHeight - optionHeight) / 2
    },
    // when搜索，更新列表
    searchWhen() {
      let WhenListTemp = this.whenList.filter(item => item.name.toLowerCase().includes(this.taskWhenValue.toLowerCase()))
      this.currentWhenList = WhenListTemp.concat(this.noneList)
      this.whenSelectIndex = 0
      if (this.taskWhenValue === '') {
        this.currentWhenList = [
          {'name': 'Today', 'value': 'today'},
          {'name': 'Tomorrow', 'value': 'tomorrow'},
          {'name': 'Next week', 'value': 'nextWeek'},
          {'name': 'Next month', 'value': 'nextMonth'},
          {'name': 'No Due date', 'value': 'none'}
        ]
      }
    },
    // project搜索，更新列表
    searchProject() {
      let projectListTemp = this.projectList.filter(item => item.name.toLowerCase().includes(this.taskProjectValue.toLowerCase()))
      this.currentProjectList = [{'name': 'No project', 'id': 0}].concat(projectListTemp)
      this.projectSelectIndex = 0
    },
    // 任务完成或取消完成
    async completeTask(task, index) {
      this.isDelete = index
      let type = true
      if (this.tabValue === 'completed') {
        type = false
      }
      const url = "/api/update_task/"
      apiHttpClient.post(url, {'task_id': task.id, "completed": type}).then(() => {
        const task = this.taskList[index]
        const completeTime = new Date(task.complete_time)
        const now = new Date()
        let outTime = 400
        let tab = "upComing"
        if (type) {
          tab = "completed"
        } else {
          outTime = 0
          if (completeTime < now) {
            tab = "overDue"
          }
        }
        setTimeout(() => {
          this.taskList.splice(index, 1)
          this.cache[tab].unshift(task)
          this.isDelete = ''
        }, outTime)
      })
    },
    // 是否显示show more
    showMore() {
      const swapHeight = this.$refs.taskSwap.offsetHeight
      const createHeight = this.$refs.taskCreate.offsetHeight
      const mainHeight = this.$refs.taskMain.offsetHeight
      if (swapHeight < createHeight + mainHeight) {
        this.isShowMore = true
        this.overFlow = 'hidden'
      } else {
        this.isShowMore = false
      }
    }
  },
};

// 将原始taskList数据格式化，修改到期时间的格式
function formatTaskData(now) {
  return (task) => {
    const completeTime = new Date(task.complete_time);
    const diffDays = Math.round((completeTime - now) / (1000 * 60 * 60 * 24));
    let completeDate;
    if (diffDays === 0) {
      completeDate = 'Today';
    } else if (diffDays === 1) {
      completeDate = 'Tomorrow';
    } else if (diffDays >= 2 && diffDays <= 6) {
      const options = {weekday: 'short'};
      completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
    } else {
      const options = {month: 'short', day: 'numeric'};
      completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
    }
    if (task.complete_time === null) {
      completeDate = null
    }
    return {
      ...task,
      complete_date: completeDate,
    };
  };
}

// 根据类型过滤任务
function filterTasks(taskList, type, now) {
  const filterMap = {
    upComing: (task) => (new Date(task.complete_time) >= now || task.complete_time === null) && task.completed === false,
    overDue: (task) => new Date(task.complete_time) < now && task.complete_time !== null,
    completed: (task) => task.completed === true,
  };
  return taskList.filter(filterMap[type]);
}


</script>
<style scoped>
.task-card {
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
}

.overdue {
  color: #c92f54;
}

.task-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}

.small-span {
  color: var(--gray);
  font-size: .7rem;
  margin-left: .5rem;
}

.avatar {
  border: 1px dashed var(--gray);
  border-radius: 3rem;
}

.calendar {
  border: 1px dashed var(--gray);
  border-radius: 3rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray);

}

.completed-background {
  background-color: transparent;
  background-image: linear-gradient(to right, #b6fbff, #83a4d4);
  background-size: 0% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  animation: fillBG 400ms ease-in-out forwards;
}

.completed-background:hover {
  background-color: transparent;
  background-image: linear-gradient(to right, #b6fbff, #83a4d4);
  background-size: 0% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  animation: fillBG 400ms ease-in-out forwards;
}

@keyframes fillBG {
  from {
    background-size: 0% 100%;
  }
  to {
    background-size: 100% 100%;
  }
}

.header {
  display: flex;
  padding: 1rem 1.5rem 0 1.5rem;
  border-bottom: 2px solid #F6F5F4;
}

.tab-navigation-bar {
  margin-left: 1rem;
}

.tab-navigation-bar .title {
  text-align: left;
  font-size: 1.25rem;
  font-weight: 500;
}

.header-title {
  margin-top: .5rem;
  align-items: center;
}

.completed {
  color: #afabac;
}

.tab-navigation-bar .title:hover {
  text-decoration: underline;
}

.more {
  color: var(--gray);
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: .2rem;
  padding: .5rem;
  transition: background-color .3s;
}

.return {
  font-family: Menlo;
}

.show-more {
  text-align: left;
  color: var(--gray);
  margin: .2rem 1.5rem .5rem 1.5rem;
  padding: .2rem .5rem;
  width: fit-content;
  font-weight: 500;
}

.show-more:hover {
  color: var(--black);
  background-color: #F9F8F8;
  border-radius: .2rem;
}

.more:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}

.task-main {
  overflow-y: v-bind(overFlow);
}

.mini-icon {
  color: var(--gray);
  flex: 0 0 auto;
  margin-right: .5rem;
  border-radius: 2rem;
}

.task-item .mini-icon:hover {
  color: #6A9F84;
  background-color: #E9F7F1;
}

.completed-icon {
  color: #58A181;
  flex: 0 0 auto;
  margin-right: .5rem;
  border-radius: 2rem;
}

.completed-icon:hover {
  color: #368E69;
}

.create-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ECEAE9;
  width: 100%;
  padding: .5rem 1.5rem 0 1.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ECEAE9;
  width: 100%;
  transition: background-color .3s;
  padding: 0 1.5rem 0 1.5rem;
}

.task-item span {
  line-height: 2.25rem;
}

.flex-auto {
  flex: 0 0 auto;
}

.item-main {
  width: 100%;
  overflow-x: hidden;
}

.add-task-input {
  font-weight: 600;
  color: var(--gray);
  font-size: 1rem;
  line-height: 2.25rem;
  background: none;
  border: none;
  width: 100%;
}

.add-task-input:focus {
  outline: none;
}

.task-input {
  width: 100%;
  text-align: left;
}

.isValue {
  color: var(--black)
}

.hidden-input {
  visibility: hidden;
  position: absolute;
}

.vsb-hidden {
  visibility: hidden;
}

.vsb-visible {
  visibility: visible;
}

.input-tips {
  color: var(--gray);
  font-weight: 700;
  font-size: 1rem;
  background-color: white;
  border-radius: .5rem;
  border: 1px solid #ECEAE9;
  width: fit-content;
  padding: .7rem 1rem;
  position: absolute;
  top: v-bind(tipsTop);
  left: v-bind(tipsLeft);
  z-index: 1000;
  word-break: keep-all;
}

.input-tips span {
  background-color: #F9F8F8;
  font-weight: normal;
  border-radius: .2rem;
  padding: 0 .5rem;
  border: 1px solid #F6F5F4;
  text-align: end;
}

.dsp-flx {
  display: flex;
  align-items: center;
}

.mrg-r-5 {
  margin-right: .5rem;
}

.mrg-l-5 {
  margin-left: .5rem;
}

.item-main .task-item:hover {
  background-color: #F9F8F8;
}

.when-input {
  border-bottom: 2px solid #E6E5E5;
}

.when-input:focus {
  border: 1px solid blue;
}

.mg-l-5 {
  margin-left: .5rem;
}

.when-select {
  width: 17.5rem;
  border-radius: .5rem;
  border: 2px solid #F3F1F1;
  background-color: white;
  position: absolute;
  top: v-bind(whenTop);
  left: v-bind(whenLeft);
  z-index: 1000;
}

.project-select {
  width: 27.5rem;
  border-radius: .5rem;
  height: 15rem;
  overflow-y: auto;
  border: 2px solid #F3F1F1;
  background-color: white;
  position: absolute;
  top: v-bind(whenTop);
  right: v-bind(projectRight);
  z-index: 1000;
}

.select-option {
  display: flex;
  justify-content: space-between;
  padding: .5rem 1rem;
  transition: background-color .3s;
}

.when-active {
  background-color: #F9F8F8;
}

.borderTop {
  border-top: 1px solid #F3F1F1;
}

.borderBottom {
  border-bottom: 1px solid #F3F1F1;
}

.list-project {
  max-width: 6rem;
  background-color: #fff3cd;
  border-radius: .9rem;
  height: 1.5rem;
  padding: .3rem .7rem;
  display: flex;
  align-items: center;
}
</style>