<template>
  <div ref="taskCard" class="task-card">
    <!--    header-->
    <div class="header">
      <ToolTip content="Add profile photo">
        <IconBase box-view="0 0 48 48" class="avatar cursor" height="3rem" width="3rem">
          <Avatar/>
        </IconBase>
      </ToolTip>
      <div class="tab-navigation-bar">
        <div class="d-flex header-title">
          <div class="title cursor mrg-r-5">My Tasks</div>
          <IconBase color="var(--gray)" height="0.75rem" width="0.75rem">
            <Lock/>
          </IconBase>
        </div>
        <TabBar v-model="tabValue" :options=tabOptions></TabBar>
      </div>
    </div>
    <!--    任务区-->
    <div ref="taskSwap" class="task-main">
      <!--      添加任务-->
      <div v-show="tabValue === 'upComing'" ref="taskCreate" class="create-item">
        <div class="mini-icon">
          <IconBase box-view="0 0 40 40" color="#afabac" height="1rem" width="1rem">
            <Done/>
          </IconBase>
        </div>
        <div class="task-input">
          <span ref="hiddenInput" class="hidden-input text-overflow">{{ taskValue }}</span>
          <input ref="taskValue" v-model="taskValue"
                 :class="{'isValue':taskValue !== ''}"
                 :placeholder=taskPlaceHolder
                 class="add-task-input"
                 @blur="taskPlaceHolder = 'Click here t o add a task...', isTaskActive = false"
                 @focus="taskPlaceHolder = 'What\'s the next thing on your plate?',isWhenActive = false,isProjectActive = false"
                 @input="taskTips"
                 @keydown="chooseWhen"
          />
        </div>
        <!--        when input-->
        <div v-show="isWhenActive" class="task-input mg-l-5">
          <input ref="taskWhenValue" v-model="taskWhenValue"
                 :class="{'isValue':taskWhenValue !== ''}"
                 class="add-task-input when-input"
                 placeholder="When?"
                 @blur="hiddenSelect('when')"
                 @focus="whenSelectShow = true,isProjectActive = false"
                 @input="searchWhen"
                 @keydown="selectWhen"
          />
        </div>
        <!--        project input-->
        <div v-show="isProjectActive" class="task-input mg-l-5">
          <input ref="taskProjectValue" v-model="taskProjectValue"
                 :class="{'isValue':taskProjectValue !== ''}"
                 class="add-task-input when-input"
                 placeholder="Which project?"
                 @blur="hiddenSelect('project')"
                 @focus="projectSelectShow = true"
                 @input="searchProject"
                 @keydown="selectProject"
          />
        </div>
      </div>
      <!--      任务列表-->
      <div ref="taskMain" class="item-main">
        <div v-for="(task,index) in taskList" :key="task.id"
             :class="{'completed-background':isDelete === index && tabValue !== 'completed'}"
             class="task-item"
             @mouseenter="isCalendar = index" @mouseleave="isCalendar = true">
          <div :class="{'completed-icon':tabValue === 'completed','mini-icon':tabValue !== 'completed'}" class="cursor"
               @click="completeTask(task,index)">
            <IconBase box-view="0 0 40 40" height="1rem" width="1rem">
              <Completed v-if="tabValue === 'completed'"/>
              <Done v-else/>
            </IconBase>
          </div>
          <div class="text-overflow w-100 text-start cursor" @click="currentTask = task,openTaskMessage = true">
            <span>{{ task.title }}</span>
          </div>
          <div v-if="task.project !== null" v-show="isDelete !== index" :style="{'color':task.project.color}"
               class="text-overflow flex-auto list-project">
            <span class="text-overflow complete-date project-color">{{ task.project.name }}</span>
          </div>
          <div v-show="isDelete !== index" :ref="'calendar'+task.id" class="flex-auto mrg-l-5"
               @click="showCalendar(task)">
            <div v-if="task.complete_date === ''" :class="{'vsb-visible':isCalendar === index}"
                 class="calendar vsb-hidden">
              <IconBase box-view="0 0 24 24" height=".75rem" width=".75rem">
                <Calendar/>
              </IconBase>
            </div>
            <span
                :class="{'overdue':tabValue === 'overDue','completed':tabValue === 'completed','green':task.complete_date.endsWith('Today')}"
                class="complete-date">{{
                task.complete_date
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--    show more-->
    <div v-show="isShowMore" class="show-more cursor" @click="overFlow = 'auto',isShowMore = false">
      <span>Show more</span>
    </div>
  </div>
  <!--    输入框提示-->
  <div v-show="isTaskActive" ref="tips" class="input-tips">
    <span>Tab</span>
    to set due date or
    <span class="return">↵ Return</span>
    to create
  </div>
  <!--  whenSelection-->
  <div v-show="whenSelectShow" class="when-select">
    <div v-for="(item,index) in currentWhenList"
         :class="{'when-active':whenSelectIndex === index,'borderTop':item.value === 'none'}"
         class="select-option cursor"
         @click="selectWhen" @mouseenter="whenSelectIndex = index">
      <div>
        <span>{{ item.name }}</span>
      </div>
      <div>
        <span class="return">↵ Return</span>
      </div>
    </div>
  </div>
  <!--  projectSelection-->
  <div v-show="projectSelectShow" ref="selectWrapper" class="project-select">
    <div v-for="(item,index) in currentProjectList" :key="item.id"
         :class="{'when-active':projectSelectIndex === index,'borderBottom':item.id === 0}"
         class="select-option cursor"
         @click="selectProject"
         @mouseenter="projectSelectIndex = index"
    >
      <div class="text-overflow dsp-flx">
        <icon-base v-if="item.id === 0" class="mrg-r-5" color="var(--gray)" height=".7rem" width=".7rem">
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
  <!--  date picker-->
  <div v-if="isShowCalendar" ref="datePickerSwap" class="date-swap1">
    <DatePick v-model="dateValue" :type="dateType" show-icon showDate>
      <div style="width: 2rem; height: 2rem "></div>
    </DatePick>
  </div>
  <message-box v-model="openTaskMessage" hiddenIcon>
    <edit-task  :taskData="currentTask" @close="test"></edit-task>
  </message-box>

</template>

<script>
import IconBase from "@/components/IconBase";
import {Avatar, Done, Lock, More, Completed, Calendar, Plus, Clock, Repeat} from "@/components/icons"
import TabBar from "@/components/common/TabBar";
import {apiHttpClient} from "@/app/app.service";
import DatePick from "@/components/common/DateTimePicker";
import ToolTip from "@/components/common/ToolTip";
import MessageBox from "@/components/common/MessageBox";
import EditTask from "@/components/homeCard/messageBox/editTask";

const now = new Date()
export default {
  name: "Tasks",
  components: {
    EditTask,
    MessageBox,
    Plus, DatePick, Calendar, Completed, TabBar, Avatar, IconBase, More, Done, Lock, Clock, Repeat, ToolTip},
  data() {
    return {
      openTaskMessage:false,
      dateValue: '',                                      // 选择的日期
      isShowCalendar: false,                              // 日历弹窗是否显示
      dateType: 'date',                                   // 日期单选还是区间
      tabValue: '',                                       // tab栏
      cache: {},                                          // 初始化的tab栏数据cache
      tabOptions: [
        {'name': 'Upcoming', 'value': 'upComing'},
        {'name': 'Overdue', 'value': 'overDue'},
        {'name': 'Completed', 'value': 'completed'}
      ],                                                  // tab栏option
      isShowMore: false,                                  // showMore角标是否出现
      overFlow: 'hidden',                                 // 和showMore配合用，控制是否可以滚动
      taskList: [],                                       // 当前的任务列表
      isCalendar: true,                                   // 控制日期icon是否出现
      taskPlaceHolder: 'Click here t o add a task...',    // 新增task placeholder1
      taskValue: '',                                      // 新增task的title value
      isDelete: '',                                       // 正在删除的任务，值是列表index
      isTaskActive: false,                                // 新增任务输入框focus
      tipsTop: 1,                                         // 新增任务输入框的tips 高
      tipsLeft: 0,                                        // 新增任务输入框的tips 左
      whenLeft: 0,                                        // 时间选择框的左
      calendarTop: 0,                                     // 日历框的高
      overDueCont: '',                                     // overDue 计数
      isWhenActive: false,                                // 新增task when input框是否展示
      whenSelectShow: false,                              // 新增task when selection框是否展示
      isProjectActive: false,                             // 新增task project input框是否展示
      taskWhenValue: '',                                  // 新增task 日期值
      taskProjectValue: '',                               // 新增task project值 两个list，
      whenList: [{'name': 'Today', 'value': 'Today'},
        {'name': 'Tomorrow', 'value': 'Tomorrow'},
        {'name': 'Next week', 'value': 'nextWeek'},
        {'name': 'Next month', 'value': 'nextMonth'},
        {'name': 'Monday', 'value': 'Monday'},
        {'name': 'TuesDay', 'value': 'Tuesday'},
        {'name': 'Wednesday', 'value': 'Wednesday'},
        {'name': 'Thursday', 'value': 'Thursday'},
        {'name': 'Friday', 'value': 'Friday'},
        {'name': 'Saturday', 'value': 'Saturday'},
        {'name': 'Sunday', 'value': 'Sunday'},
      ],
      defaultWhenList: [
        {'name': 'Today', 'value': 'Today'},
        {'name': 'Tomorrow', 'value': 'Tomorrow'},
        {'name': 'Next week', 'value': 'nextWeek'},
        {'name': 'Next month', 'value': 'nextMonth'},
        {'name': 'No Due date', 'value': 'none', 'date': null}
      ],
      currentWhenList: [],
      noneList: [{'name': 'No Due date', 'value': 'none', 'date': null}],
      whenSelectIndex: 0,                                     // 新增task 日期当前定位第几个
      projectSelectIndex: 0,                                  // 新增task project当前定位第几个
      projectSelectShow: false,                               // 新增task project selection框是否展示
      currentProjectList: [],                                 // 当前的project selection List
      isFirstClick: false,                                     // 是否是第一次点击，日历弹窗辅助用
      currentTask: '',                                        // 日历弹窗点击对应的task
      isDateChange: false,                                     // 日历弹窗的日期是否有change
      taskCompletedNumb: 0,
      analyzeTime: '',
      dateValueTemp: ''
    }
  },
  emits: ['task-completed'],
  props: {
    projectList: {
      type: Object,
      default: null
    },
    analyzeValue: {
      type: [String, Object],
      default: 'week'
    }
  },
  async created() {
    // 获取taskList
    // const now = new Date()
    const day = now.getDate() === 0 ? 7 : now.getDay()
    this.analyzeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1, 0, 0, 0)
    this.whenList = formatWhenOption(this.whenList)
    this.currentWhenList = this.defaultWhenList = formatWhenOption(this.defaultWhenList)
    const response = await apiHttpClient.post("/api/get_tasks/");
    const taskList = response.data.results.map(formatTaskData());
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
    this.currentTask =  this.taskList[0]
    // 修改OverdueTitle
    this.getCompletedTaskNumb(this.analyzeTime)
    this.changeOverdueTitle()
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
    },
    // 日历弹窗鼠标监听
    isShowCalendar(newValue) {
      if (newValue) {
        document.addEventListener("click", this.calendarOutsideClick);
        this.dateValueTemp = this.dateValue
        setTimeout(() => {
          this.isFirstClick = true
        }, 40)
      } else {
        document.removeEventListener("click", this.calendarOutsideClick);
      }
    },
    dateValue(newValue) {
      this.isDateChange = this.dateValue !== this.dateValueTemp
      this.dateType = typeof newValue === "string" ? 'date' : 'dateRange'
    },
    analyzeValue(newValue) {
      // const now = new Date()
      if (newValue.value === 'week') {
        const day = now.getDate() === 0 ? 7 : now.getDay()
        this.analyzeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1, 0, 0, 0)
      } else {
        this.analyzeTime = new Date(now.getFullYear(), 1, 1, 0, 0, 0)
      }
      this.getCompletedTaskNumb(this.analyzeTime)
    }
  },
  methods: {
    test(){
      this.openTaskMessage = false
      console.log(this.openTaskMessage)
    },
    getCompletedTaskNumb(time) {
      const completedList = this.cache.completed
      let i = 0
      for (let item of completedList) {
        const completedTime = new Date(item.completed_time)
        if (completedTime >= time) {
          i += 1
        }
      }
      if (i !== this.taskCompletedNumb) {
        this.taskCompletedNumb = i
        this.$emit('task-completed', this.taskCompletedNumb)
      }
    },
    // 更新overDue title
    changeOverdueTitle() {
      this.overDueCont = this.cache['overDue'].length !== 0 ? this.cache['overDue'].length : ''
      this.tabOptions[1].name = "Overdue (" + this.overDueCont + ")"
    },
    // 弹窗外点击，如有符合要求，直接请求更改信息
    calendarOutsideClick(e) {
      if (this.$refs.datePickerSwap && !this.$refs.datePickerSwap.contains(e.target) && this.isFirstClick) {
        this.isShowCalendar = false;
        this.isFirstClick = false
        const url = "/api/update_task/"
        if (typeof this.dateValue === "string" && this.isDateChange) {
          const data = {'task_id': this.currentTask.id, "complete_time": this.dateValue}
          apiHttpClient.post(url, data).then(() => {
            this.updateTaskLab()
            this.isDateChange = false
          })
        } else if (typeof this.dateValue === "object" && this.isDateChange) {
          const data = {
            'task_id': this.currentTask.id,
            "complete_time": this.dateValue[1],
            "start_time": this.dateValue[0]
          }
          apiHttpClient.post(url, data).then(() => {
            this.updateTaskLab()
            this.isDateChange = false
          })
        }
      }
    },
    // 日历弹窗
    showCalendar(item) {
      this.isShowCalendar = true
      this.currentTask = item
      const div = this.$refs[`calendar${item.id}`][0]
      const {top} = div.getBoundingClientRect()
      const main = this.$refs.taskCard.getBoundingClientRect()
      this.calendarTop = top - main.top + 5 + 'px'
      if (item.start_time !== null) {
        this.dateType = 'dateRange'
        this.dateValue = [item.start_time, item.complete_time]
      } else {
        this.dateType = 'date'
        this.dateValue = item.complete_time ===null? '':item.complete_time
      }
    },
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
      const main = this.$refs.taskCard.getBoundingClientRect()
      this.tipsTop = top - main.top + 41 + 'px'
      this.tipsLeft = left - main.left + Math.min(this.$refs.hiddenInput.offsetWidth, this.$refs.taskValue.offsetWidth) + 'px'
    },
    // 监听task input的按键，tab和回车时跳转到when的input框
    chooseWhen(event) {
      if (event.key === 'Tab' && this.taskValue !== '') { // 修改if语句的条件，使用key属性来判断按键
        this.isWhenActive = true
        this.taskWhenValue = this.defaultWhenList[0].name
        this.$nextTick(() => {
          const main = this.$refs.taskCard.getBoundingClientRect()
          const {left} = this.$refs.taskWhenValue.getBoundingClientRect()
          this.whenLeft = left - main.left + 'px'
        })
      }
    },
    // when输入框focus时,监听键盘和鼠标
    selectWhen() {
      this.handleProjectListChange()
      // 端盘时键盘输入触发，还是点击触发
      if (event.keyCode) {
        switch (event.keyCode) {
            // 跳转到project选择
          case 9: // Tab键
          case 13: // Enter键
            this.isProjectActive = true
            this.taskProjectValue = this.currentProjectList[0].name
            this.taskWhenValue = this.currentWhenList[this.whenSelectIndex].name
            event.preventDefault()
            this.$nextTick(() => {
              this.$refs.taskProjectValue.focus()
            })
            break;
          case 40: // 下箭头
            this.whenSelectIndex = (this.whenSelectIndex + 1) % this.currentWhenList.length
            this.taskWhenValue = this.currentWhenList[this.whenSelectIndex].name
            break;
          case 38: // 上箭头
            this.whenSelectIndex = (this.currentWhenList.length + this.whenSelectIndex - 1) % this.currentWhenList.length
            this.taskWhenValue = this.currentWhenList[this.whenSelectIndex].name
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
            this.addTask()
            break;
          case 40: // 下箭头
            this.projectSelectIndex = (this.projectSelectIndex + 1) % this.currentProjectList.length
            this.taskProjectValue = this.currentProjectList[this.projectSelectIndex].name
            this.scrollToActiveOption()
            break;
          case 38: // 上箭头
            this.projectSelectIndex = (this.currentProjectList.length + this.projectSelectIndex - 1) % this.currentProjectList.length
            this.taskProjectValue = this.currentProjectList[this.projectSelectIndex].name
            this.scrollToActiveOption()
            break;
          default:
            break;
        }
      } else { //鼠标点击选择
        this.taskProjectValue = this.currentProjectList[this.projectSelectIndex].name
      }
    },
    // 新增任务
    addTask() {
      const url = "/api/create_task/"
      const completeTime = this.currentWhenList[this.whenSelectIndex].date
      const projectId = this.currentProjectList[this.projectSelectIndex].id
      const data = {'title': this.taskValue, 'complete_time': completeTime, 'project_id': projectId,}
      apiHttpClient.post(url, data).then((response) => {
        const task = formatTaskData()(response.data.results)
        this.taskList.unshift(task)
        this.taskValue = this.taskProjectValue = this.taskWhenValue = ''
        this.currentWhenList = this.defaultWhenList
        this.currentProjectList = this.projectList
        this.projectSelectIndex = this.whenSelectIndex = 0
        this.isProjectActive = this.isWhenActive = false
        this.$refs.taskValue.focus()
      })
    },
    // project选择时，上下键附带滚动
    scrollToActiveOption() {
      const activeOption = this.$refs.selectWrapper.querySelector('.when-active')
      const selectWrapper = this.$refs.selectWrapper
      // 如果没有活动元素，则返回
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
        this.currentWhenList = this.defaultWhenList
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
      let type = this.tabValue !== 'completed'
      this.isDelete = index
      const url = "/api/update_task/"
      apiHttpClient.post(url, {'task_id': task.id, "completed": type}).then(() => {
        const task = this.taskList[index]
        const completeTime = new Date(task.complete_time)
        // const now = new Date()
        let outTime = 400
        let tab = "upComing"
        if (type) {
          tab = "completed"
          task.completed_time = now
          this.taskCompletedNumb = this.taskCompletedNumb + 1
          this.$emit('task-completed', this.taskCompletedNumb)
        } else {
          outTime = 0
          task.completed_time = null
          if (completeTime < now && task.complete_time !== null) {
            tab = "overDue"
          }
        }
        setTimeout(() => {
          this.taskList.splice(index, 1)
          this.cache[tab].unshift(task)
          this.isDelete = ''
          this.changeOverdueTitle()
        }, outTime)
        this.$nextTick(() => {
          if (!type) {
            this.getCompletedTaskNumb(this.analyzeTime)
          }
        })
      })
    },
    // 更新tab时间,前端展现更改
    async updateTaskLab() {
      // const now = new Date()
      const index = this.taskList.indexOf(this.currentTask)
      const [startTime, endTime] = this.dateType === 'date' ? [null, this.dateValue] : this.dateValue;
      const endDate = new Date(endTime)
      this.currentTask.complete_time = endTime
      this.currentTask.start_time = startTime
      this.taskList[index] = formatTaskData()(this.currentTask);
      if (endTime !== null && (endDate <= now && this.tabValue === 'upComing')) {
        this.cache['overDue'].unshift(this.taskList[index])
        this.taskList.splice(index, 1)
        this.changeOverdueTitle()
      } else if ((endDate > now || endTime === null) && this.tabValue === 'overDue') {
        this.cache['upComing'].unshift(this.taskList[index])
        this.taskList.splice(index, 1)
      }
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

// 更改时间格式
function getFormatDate(date, type) {
  const fullOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }
  const newDateTemp = new Date(date)
  let newDate;
  if (type === 'end') {
    newDate = new Date(newDateTemp.getFullYear(), newDateTemp.getMonth(), newDateTemp.getDate(), 23, 59, 59)
  } else {
    newDate = new Date(newDateTemp.getFullYear(), newDateTemp.getMonth(), newDateTemp.getDate(), 0, 0, 0)
  }
  return newDate.toLocaleString('zh-CH', fullOptions).replace(/\//g, '-')
}

// whenList格式化


//将when select option格式化
function formatWhenOption(whenList) {
  let now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0)
  const day = now.getDate() === 0 ? 7 : now.getDay()
  const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8 - day, 0, 0, 0)
  let optionList = []
  for (let i = 0; i <= 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0)
    const options = {weekday: 'long'};
    const dateString = new Intl.DateTimeFormat('en-US', options).format(date);
    optionList.push({
      date: getFormatDate(date, 'end'),
      value: dateString
    })
  }
  optionList = optionList.concat([{
    date: optionList[0].date,
    value: 'Today'
  }, {
    date: optionList[1].date,
    value: 'Tomorrow'
  }, {
    date: getFormatDate(nextMonth, 'end'),
    value: 'nextMonth'
  }, {
    date: getFormatDate(nextWeek, 'end'),
    value: 'nextWeek'
  }])
  for (let i = 0; i < whenList.length; i++) {
    const value = whenList[i].value;

    for (let j = 0; j < optionList.length; j++) {
      if (optionList[j].value === value) {
        whenList[i].date = optionList[j].date;
        break; // 停止内层循环
      }
    }
  }
  return whenList

}

// 将原始taskList数据格式化，修改到期时间的格式
function formatTaskData() {
  return (task) => {
    const completeTime = new Date(task.complete_time);
    const startTime = new Date(task.start_time);
    // 判断是否同一个月
    const isSameMonth = (new Date(completeTime.getFullYear(), completeTime.getMonth(), 1, 0, 0, 0) - new Date(startTime.getFullYear(), startTime.getMonth(), 1, 0, 0, 0)) === 0
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const nowEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    // 和当前时间做比较用
    const completeDiffDays = Math.round((completeTime - nowEndDate) / (1000 * 60 * 60 * 24));
    const startDiffDays = Math.round((startTime - nowDate) / (1000 * 60 * 60 * 24));
    let completeDate;
    if ((task.start_time === null && task.complete_time !== null) || completeDiffDays === startDiffDays) {
      //开始时间空，或者 开始结束同一天，不用显示范围
      if (completeDiffDays === 0) {
        completeDate = 'Today';
      } else if (completeDiffDays === 1) {
        completeDate = 'Tomorrow';
      } else if (completeDiffDays >= 2 && completeDiffDays <= 6) {
        const options = {weekday: 'short'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
      } else {
        const options = {month: 'short', day: 'numeric'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
      }
    } else if (task.start_time !== null && task.complete_time !== null && completeDiffDays !== startDiffDays) {
      //显示范围
      if (startDiffDays === 0) {
        const options = {month: 'short', day: 'numeric'};
        const completeDate2 = new Intl.DateTimeFormat('en-US', options).format(completeTime);
        completeDate = 'Today-' + completeDate2
      } else if (completeDiffDays === 0) {
        const options = {month: 'short', day: 'numeric'};
        const completeDate1 = new Intl.DateTimeFormat('en-US', options).format(startTime);
        completeDate = completeDate1 + '-Today'
      } else if (isSameMonth) {
        // 同一个月
        const options = {month: 'short', day: 'numeric'};
        const options2 = {day: 'numeric'};
        const completeDate1 = new Intl.DateTimeFormat('en-US', options).format(startTime);
        const completeDate2 = new Intl.DateTimeFormat('en-US', options2).format(completeTime);
        completeDate = completeDate1 + '-' + completeDate2
      } else {
        const options = {month: 'short', day: 'numeric'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(startTime) + '-' + new Intl.DateTimeFormat('en-US', options).format(completeTime);
      }
    } else {
      completeDate = ''
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
    overDue: (task) => new Date(task.complete_time) < now && task.complete_time !== null && task.completed === false,
    completed: (task) => task.completed === true,
  };
  return taskList.filter(filterMap[type]);
}


</script>
<style scoped>
.date-swap1 {
  position: absolute;
  top: v-bind(calendarTop);
  right: 2rem;
  /*top: 0;*/
  /*right: 0;*/
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  z-index: 1001;
}

.green {
  color: #0d7f56;
}

.task-card {
  color: var(--black);
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

.project-color {
  filter: grayscale(1) contrast(999) invert(1)
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
  text-decoration-color: var(--gray);
  text-decoration-thickness: 1px;
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
  top: v-bind(tipsTop);
  left: v-bind(whenLeft);
  z-index: 1000;
}

.complete-date {
  font-size: .75rem;
}

.project-select {
  width: 27.5rem;
  border-radius: .5rem;
  max-height: 15rem;
  overflow-y: auto;
  border: 2px solid #F3F1F1;
  background-color: white;
  position: absolute;
  top: v-bind(tipsTop);
  right: 30px;
  z-index: 1000;
  box-shadow: 0 1px 4px 0 rgba(109, 110, 111, 0.08);
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
  background-color: currentColor;
  border-radius: .9rem;
  height: 1.5rem;
  padding: .3rem .7rem;
  display: flex;
  align-items: center;
  color: #4351B1;
}
</style>