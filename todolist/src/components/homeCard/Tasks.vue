<template>
  <div class="task-card" ref="taskCard">
    <!--    header-->
    <div class="header">
      <ToolTip content="Add profile photo">
        <IconBase width="3rem" height="3rem" box-view="0 0 48 48" class="avatar cursor">
          <Avatar/>
        </IconBase>
      </ToolTip>
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
        <div class="task-item" v-for="(task,index) in taskList" :key="task.id"
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
          <div v-if="task.project !== null" class="text-overflow flex-auto list-project" v-show="isDelete !== index"  :style="{'color':task.project.color}">
            <span class="text-overflow complete-date project-color">{{ task.project.name }}</span>
          </div>
          <div class="flex-auto mrg-l-5" v-show="isDelete !== index" @click="showCalendar(task,index)" ref="calendar">
            <div class="calendar vsb-hidden" v-if="task.complete_date === null"
                 :class="{'vsb-visible':isCalendar === index}">
              <IconBase width=".75rem" height=".75rem" box-view="0 0 24 24">
                <Calendar/>
              </IconBase>
            </div>
            <span class="complete-date"
                  :class="{'overdue':tabValue === 'overDue','completed':tabValue === 'completed','green':task.complete_date.endsWith('Today')}">{{
                task.complete_date
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--    show more-->
    <div class="show-more cursor" v-show="isShowMore" @click="overFlow = 'auto',isShowMore = false">
      <span>Show more</span>
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
    <div class="select-option cursor" v-for="(item,index) in currentProjectList" :key="item.id"
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
  <!--  date picker-->
  <div v-if="isShowCalendar" class="date-swap" ref="datePickerSwap">
    <div class="triangle"></div>
    <div class="date-picker">
      <div class="date-title">
        <div class="start-input">
          <div class="start-date" @click="addStartDate" v-show="dateType === 'date'">
            <IconBase width=".75rem" height=".75rem" box-view=" 0 0 24 24">
              <Plus/>
            </IconBase>
            <span>Start date</span>
          </div>
          <input placeholder="Start date" class="date-input" v-show="dateType === 'dateRange'" v-model="startDate"
                 @input="changeDate()" :class="{'error':isStartError}">
        </div>
        <input placeholder="Due date" class="date-input" v-model="endDate" @input="changeDate()"
               :class="{'error':isEndError}">
      </div>
      <DatePick :type="dateType" v-model="dateValue"></DatePick>
      <div class="date-foot">
        <ToolTip content="Add time">
          <div class="time-picker">
            <IconBase box-view="0 0 32 32">
              <Clock/>
            </IconBase>
          </div>
        </ToolTip>
        <ToolTip content="Set to repeat">
          <div class="time-picker">
            <IconBase box-view="0 0 32 32">
              <Repeat/>
            </IconBase>
          </div>
        </ToolTip>
        <div class="clear" @click="clearAll"> Clear all</div>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {Avatar, Done, Lock, More, Completed, Calendar, Plus, Clock, Repeat} from "@/components/icons"
import TabBar from "@/components/common/TabBar";
import {apiHttpClient} from "@/app/app.service";
import DatePick from "@/components/common/DateTimePicker";
import ToolTip from "@/components/common/ToolTip";

const now = new Date()
export default {
  name: "Tasks",
  components: {Plus, DatePick, Calendar, Completed, TabBar, Avatar, IconBase, More, Done, Lock, Clock, Repeat,ToolTip},
  data() {
    return {
      triangle:['column','rotate(45deg)','0'],
      dateValue: '',                                      // 选择的日期
      isShowCalendar: false,                              // 日历弹窗是否显示
      dateType: 'date',                                   // 日期单选还是区间
      isStartError: false,                                // 开始日期报错
      isEndError: false,                                  // 结束日期报错
      startDate: '',                                      // input 开始日期
      endDate: '',                                        // input 结束日期
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
      isFirstClick: true,                                     // 是否是第一次点击，日历弹窗辅助用
      currentTask: '',                                        // 日历弹窗点击对应的task
      isDateChange: false,                                     // 日历弹窗的日期是否有change
      taskCompletedNumb: 0,
      analyzeTime: ''
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
    // 日期变化
    dateValue(newValue) {
      this.isDateChange = true
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      if (this.dateType === 'date') {
        const date = newValue && new Date(newValue);
        this.endDate = date ? date.toLocaleDateString("zh-CN", options) : '';
      } else {
        const date1 = newValue[0] && new Date(newValue[0]);
        this.startDate = date1 ? date1.toLocaleDateString("zh-CN", options) : '';
        const date2 = newValue[1] && new Date(newValue[1]);
        this.endDate = date2 ? date2.toLocaleDateString("zh-CN", options) : '';
      }
    },
    // 日历弹窗鼠标监听
    isShowCalendar(newValue) {
      if (newValue) {
        document.addEventListener("click", this.calendarOutsideClick);
      } else {
        document.removeEventListener("click", this.calendarOutsideClick);
      }
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
    // 添加开始日期
    addStartDate() {
      this.dateType = 'dateRange'
      this.startDate = null
      this.dateValue = this.dateValue !== '' ? [null, this.dateValue] : ['', '']
    },
    // 弹窗外点击，如有符合要求，直接请求更改信息
    calendarOutsideClick(e) {
      if (this.$refs.datePickerSwap && !this.$refs.datePickerSwap.contains(e.target) && !this.isFirstClick) {
        this.isShowCalendar = false;
        this.isFirstClick = true
        const url = "/api/update_task/"
        if (this.dateType === 'date' && this.isDateChange) {
          const data = {'task_id': this.currentTask.id, "complete_time": this.dateValue}
          apiHttpClient.post(url, data).then(() => {
            this.updateTaskLab()
            this.isDateChange = false
          })
        } else if (this.dateType === 'dateRange' && this.isDateChange) {
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
    showCalendar(item, index) {
      this.isShowCalendar = true
      this.currentTask = item
      this.isFirstClick = true
      this.isStartError = this.isEndError = false
      setTimeout(() => {
        this.isFirstClick = false
        this.isDateChange = false
      }, 400)
      const {top} = this.$refs.calendar[index].getBoundingClientRect()
      const main = this.$refs.taskCard.getBoundingClientRect()
      if (window.innerHeight-428-top >= 10) {
        this.triangle = ['column','rotate(45deg)','0']
        this.calendarTop = top  - main.top + 38 + 'px'
      } else {
        this.triangle = ['column-reverse','rotate(225deg)','-.5rem']
        this.calendarTop = top -390 - main.top + 'px'
      }
      if (item.start_time !== null) {
        this.dateType = 'dateRange'
        this.dateValue = [item.start_time, item.complete_time]
      } else {
        this.dateType = 'date'
        this.dateValue = item.complete_time
      }
    },
    //  清除日期
    clearAll() {
      this.dateValue = this.dateType === 'dateRange' ? this.dateValue = ['', ''] : this.dateValue = ''
    },
    // input变更日期
    async changeDate() {
      this.startDate = this.startDate || null;
      this.endDate = this.endDate || null
      let endDateIsValid = this.endDate !== null ? this.isValidDate(this.endDate) : true;
      let startDateIsValid = this.startDate !== null ? this.isValidDate(this.startDate) : true;
      if (endDateIsValid && startDateIsValid) {
        if (this.compareTime(this.startDate, this.endDate)) {
          endDateIsValid = false
          startDateIsValid = false
        } else {
          this.endDate = this.endDate ? getFormatDate(this.endDate, 'end') : this.endDate
          this.startDate = this.startDate ? getFormatDate(this.startDate, 'start') : this.startDate
          this.dateValue = this.dateType === 'date' ? this.endDate : [this.startDate, this.endDate]
        }
        this.isStartError = this.isEndError = false
      }
      this.isStartError = !startDateIsValid
      this.isEndError = !endDateIsValid
    },
    // 日期比对，changeDate函数用
    compareTime(dateStart, dateEnd) {
      if (dateEnd === null || dateStart === null) {
        return false
      } else {
        return new Date(dateStart) > new Date(dateEnd)
      }
    },
    // input验证是否是日期
    isValidDate(value) {
      const dateList = value.split('/')
      if (dateList.length !== 3) {
        return false
      } else if (dateList[1] <= 0 || dateList[1] > 12) {
        return false
      } else if (dateList[2] <= 0 || dateList[1] > 31) {
        return false
      } else if (dateList[0] <= 0) {
        return false
      } else {
        return new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))
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
    overDue: (task) => new Date(task.complete_time) < now && task.complete_time !== null && task.completed === false,
    completed: (task) => task.completed === true,
  };
  return taskList.filter(filterMap[type]);
}


</script>
<style scoped>
.start-input {
  display: flex;
}

.date-foot {
  height: 3.75rem;
  padding: .75rem 1rem;
  border-top: 1px solid #EDEAE9;
  display: flex;
  align-items: center;
}

.date-picker {
  background-color: white;
  width: fit-content;
  display: flex;
  flex-direction: column;
  border: 1px solid #EDEAE9;
  border-radius: .4rem;
}

.date-swap {
  position: absolute;
  top: v-bind(calendarTop);
  right: 2rem;
  /*top: 0;*/
  /*right: 0;*/
  display: flex;
  align-items: flex-end;
  flex-direction: v-bind(triangle[0]);
  z-index: 1001;
}

.triangle {
  width: 1rem;
  height: 1rem;
  background-color: white;
  transform: v-bind(triangle[1]);
  margin-bottom: -.5rem;
  margin-top: v-bind(triangle[2]);
  margin-right: 1rem;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: #EDEAE9;
  border-radius: .1rem;
}

.clear {
  margin-left: auto;
  height: 2.25rem;
  width: max-content;
  padding: 0 1rem;
  transition: background-color .3s;
  line-height: 2.25rem;
  border-radius: .4rem;
  font-weight: 500;
}

.clear:hover {
  background-color: rgb(248, 246, 246);
}

.green {
  color: #0d7f56;
}

.time-picker {
  height: 100%;
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .3s;
  border-radius: .4rem;
  margin-right: .5rem;
}

.time-picker:hover {
  background-color: rgb(248, 246, 246);
}

.date-input {
  background: none;
  padding: 0 0 0 .7rem;
  border-radius: .4rem;
  border: 1px solid #D0CBCB;
  width: 7.2rem;
  color: var(--black);
}

.date-input:focus {
  border: 2px solid #4673D3;
  outline: none;
}

.date-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.2rem 0 1.2rem;
  height: 3.3rem;
}

.start-date {
  font-weight: 600;
  color: var(--gray);
  display: flex;
  align-items: center;
  font-size: .875rem;
  padding: .5rem .75rem;
  border-radius: .4rem;
  transition: background-color .3s;
}

.start-date:hover {
  background-color: rgb(248, 246, 246);
}

.start-date span {
  margin-left: .2rem;
}

.task-card {
  color:var(--black);
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

.error {
  color: red;
}

.error:focus {
  color: red;
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
  text-decoration-thickness:1px;
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