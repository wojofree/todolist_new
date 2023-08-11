<template>
  <!--  表头-->
  <div class="main-header">
    <span>Last task completed on Tuesday</span>
    <div class="main-header-right">
      <div class="right-button">
        <icon-base box-view="0 0 24 24" height=".75rem" width=".75rem">
          <RingRight/>
        </icon-base>
        <span>Incomplete tasks</span>
      </div>
      <newSelectBar v-model="this.sortSelect" :options="this.sortList" class="height-175" flex-end="flex-end">
        <div class="right-button">
          <icon-base box-view="0 0 24 24" height=".75rem" width=".75rem">
            <SortMiniIcon/>
          </icon-base>
          <span>Sort {{ this.sortSelect.name }}</span>
        </div>
      </newSelectBar>
    </div>
  </div>
  <!--  内容区-->
  <div class="section-swap">
    <draggable v-model="this.sectionList" class="home-card" v-bind="dragOptions">
      <transition-group type="transition">
        <div v-for="(section, index) in this.sectionList" :key="section.id" class="list-card">
          <!--          表头-->
          <div class="section-header">
            <new-input v-show="this.sectionActive === section.id" :ref="'section'+section.id"
                       v-model="this.activeSectionName" class="title-input" weight="700"
                       @blur="updateSection(section,index)" @keydown="watchKey(section,index, $event)"></new-input>
            <span v-show="this.sectionActive !== section.id" class="text-overflow" @click="activeSection(section)">{{
                section.name
              }}</span>
            <div class="section-header-right">
              <!--              新增task-->
              <tool-tip content="Add task">
                <div class="section-header-icon cursor" @click="this.addTask(section)">
                  <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                    <PlusThin/>
                  </icon-base>
                </div>
              </tool-tip>
              <!--              more actions-->
              <div class="section-header-icon cursor">
                <popover :ref="'headerPopOver'+section.id" direction="flex-start" popPosition="under">
                  <template #main>
                    <tool-tip content="More actions">
                      <icon-base box-view="0 0 32 32">
                        <More/>
                      </icon-base>
                    </tool-tip>
                  </template>
                  <template #pop>
                    <div class="pop-main">
                      <div class="pop-item">
                        <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                          <AddRule/>
                        </icon-base>
                        <span>Add rule to section</span>
                      </div>
                      <div class="pop-item" @click="activeSection(section)">
                        <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                          <Pencil/>
                        </icon-base>
                        <span>Rename section</span>
                      </div>
                      <popover direction="flex-start" hover-control pop-position="side"
                               @clickClose="handleClosePop(section.id)">
                        <template #main>
                          <div class="pop-item">
                            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                              <Section/>
                            </icon-base>
                            <span>Add section</span>
                            <icon-base style="transform: rotate(-90deg)">
                              <Arrow/>
                            </icon-base>
                          </div>
                        </template>
                        <template #pop>
                          <div class="pop-item" @click="addSection(index,'left')">
                            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                              <LeftArrow/>
                            </icon-base>
                            <span>Add section to left</span>
                          </div>
                          <div class="pop-item" @click="addSection(index,'right')">
                            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                              <RightArrow/>
                            </icon-base>
                            <span>Add section to right</span>
                          </div>
                        </template>
                      </popover>
                      <tool-tip v-if="section.id === this.firstSection"
                                content="This section can't be deleted because new tasks assigned to you appear here">
                        <div class="pop-item trash-icon">
                          <icon-base box-view="0 0 32 32" height="1rem" icon-color="#AFABAC" width="1rem">
                            <Trash/>
                          </icon-base>
                          <span style="color: #AFABAC;">Delete section</span>
                        </div>
                      </tool-tip>
                      <div v-if="section.id !== this.firstSection" class="pop-item trash-icon"
                           @click="deleteSelect(section.id, index)">
                        <icon-base box-view="0 0 32 32" height="1rem" icon-color="#DF5F73" width="1rem">
                          <Trash/>
                        </icon-base>
                        <span>Delete section</span>
                      </div>
                    </div>
                  </template>
                </popover>
              </div>
            </div>
          </div>
          <!--                新增task card-->
          <div v-if="this.showAddTaskSectionID === section.id" :ref="'newCard'+section.id" class="task-card new-card">
            <div v-if="this.showAddTaskSectionID === section.id && this.showAddTask">
              <div class="task-title">
                <div class="task-complete">
                  <icon-base box-view="0 0 24 24" height="1rem" width="1rem">
                    <ring-right/>
                  </icon-base>
                </div>
                <div class="vsb-hidden-div">{{ this.addTaskName }}</div>
                <textarea :ref="'addTask'+section.id" v-model="this.addTaskName" class="add-task-input"
                          placeholder="Write a task name" @input="this.changeHeight()"></textarea>
              </div>
              <date-pick v-model="this.dateValue" :type="this.dateType" class="width-5" show-icon
                         startPosition="flex_end">
                <div class="date-due">
                  <tool-tip v-if="this.dateValue === '' || this.dateValue === null || this.dateValue === [null,null]"
                            content="Add due date">
                    <div class="calendar cursor">
                      <IconBase box-view="0 0 24 24" height=".75rem" width=".75rem">
                        <Calendar/>
                      </IconBase>
                    </div>
                  </tool-tip>
                  <span :class="{'green':this.addCompletedDate.endsWith('Today'),'green1':this.addCompletedDate.endsWith('Tomorrow'),
                  'overdue':!this.compareTime(this.addCompletedTime)}">{{ this.addCompletedDate }}</span>
                </div>
              </date-pick>
            </div>
          </div>
          <!--          tasks列表-->
          <div class="task-list">
            <draggable v-model="this.sectionTaskList[section.id]"
                       :class="{'grayBackgroundColor': sectionLength(section.id) === 0}"
                       class="draggable-group" v-bind="taskDragOptions"
                       @change="changeTask">
              <transition-group type="transition">
                <!--                add task按钮-->
                <div v-if="sectionLength(section.id) === 0" class="add-task" @click="addTask(section)">
                  <icon-base box-view="0 0 24 24" class="add-color" height=".625rem"
                             width=".625rem">
                    <Plus/>
                  </icon-base>
                  <span>Add task</span>
                </div>
                <!--                task列表-->
                <div v-for="task in this.sectionTaskList[section.id]" :key="task.id" class="task-card">
                  <div v-if="task.project.length !== 0" class="task-project">
                    <div v-for="project in task.project" :style="{backgroundColor:project.color}" class="project-color">
                    </div>
                  </div>
                  <div class="task-title">
                    <div class="task-complete" @click="this.completeTask(task.id,section.id,index)">
                      <icon-base box-view="0 0 24 24" height="1rem" width="1rem">
                        <ring-right/>
                      </icon-base>
                    </div>
                    <span>{{ task.title }}</span>
                  </div>

                  <div :class="{'green':task.complete_date.endsWith('Today'),'green1':task.complete_date.endsWith('Tomorrow'),
                  'overdue':!this.compareTime(task.complete_time)}" class="task-complete-date">
                    {{ task.complete_date }}
                    <tool-tip v-if="task.complete_date === ''" class="" content="Add due date">
                      <div class="calendar cursor">
                        <IconBase box-view="0 0 24 24" height=".75rem" width=".75rem">
                          <Calendar/>
                        </IconBase>
                      </div>
                    </tool-tip>
                  </div>
                </div>
              </transition-group>
            </draggable>
            <!--            新增task-->
            <div v-if="sectionLength(section.id) !== 0" class="add-task" @click="addTask(section)">
              <icon-base box-view="0 0 24 24" class="add-color" height=".625rem" width=".625rem">
                <Plus/>
              </icon-base>
              <span>Add task</span>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <!--    新增section-->
    <div class="list-card-noHover">
      <div class="section-header">
        <new-input v-show="this.sectionActive === 'addSection'" ref="addSection"
                   v-model="this.activeSectionName" class="title-input width-100" placeholder="New section"
                   weight="700" @blur="updateSection('addSection',1)"
                   @keydown="watchKey('addSection',1, $event)"
        ></new-input>
        <div v-show="this.sectionActive !== 'addSection'" class="add-section" @click="activeSection('addSection')">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <PlusThin/>
          </icon-base>
          <span>Add section</span>
        </div>
      </div>
      <div class="grayBackgroundColor"></div>
    </div>
  </div>
  <!--  删除确认信息框-->
  <message-box v-model="this.showDeleteMessage" card-height="30%" card-width="32%" hiddenIcon
               justifyContent="flex-start"
               max-width="60rem" mrgTop="10rem">
    <div class="delete-message">
      <div class="delete-header">
        <span>Are you sure you want to delete this section?</span>
        <tool-tip content="Close this dialog">
          <div class="header-close" @click="showDeleteMessage = false">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <XIcon/>
            </icon-base>
          </div>
        </tool-tip>
      </div>
      <div class="delete-main">
        <span class="delete-option">This section {{
            this.currentSection.name
          }} includes {{ this.currentSection.completed }} completed tasks and {{ this.currentSection.incomplete }} incomplete tasks.</span>
        <div class="delete-option cursor" @click="this.deleteType = 'keep'">
          <div v-if="this.deleteType !== 'keep'" class="radio-custom-uncheck">
          </div>
          <div v-if="this.deleteType === 'keep'" class="radio-custom">
            <div class="radio-custom-inner"></div>
          </div>
          <span>Delete this section and keep all tasks</span>
        </div>
        <div class="delete-option cursor" @click="this.deleteType = 'delete'">
          <div v-if="this.deleteType === 'keep'" class="radio-custom-uncheck">
          </div>
          <div v-if="this.deleteType !== 'keep'" class="radio-custom">
            <div class="radio-custom-inner"></div>
          </div>
          <span>Delete this section and delete all tasks</span>
        </div>
      </div>
      <div class="delete-button">
        <new-button border-style="1px solid #E6E5E5" @click="showDeleteMessage = false">Cancel</new-button>
        <new-button background-style="#DE5F73" font-color="#ffffff" hover-color="#D84F67"
                    @click="deleteSection(this.currentSection.id,this.currentSection.index,this.deleteType)">Delete
          section
        </new-button>
      </div>
    </div>
  </message-box>
</template>

<script setup>
import {
  Calendar,
  XIcon,
  RingRight,
  SortMiniIcon,
  PlusThin,
  More,
  Plus,
  Pencil,
  AddRule,
  Section,
  Trash,
  Arrow,
  RightArrow,
  LeftArrow
} from "@/components/icons"
import NewInput from "@/components/common/NewInput";
import Popover from "@/components/common/Popover";
import ToolTip from "@/components/common/ToolTip";
import MessageBox from "@/components/common/MessageBox";
import NewButton from "@/components/common/NewButton";
import DatePick from "@/components/common/DateTimePicker";
import NewSelectBar from "@/components/common/newSelectBar";
</script>

<script>
import IconBase from "@/components/IconBase";
import {VueDraggableNext} from "vue-draggable-next";
import {apiHttpClient} from "@/app/app.service";
import formatTaskData from "@/components/homeCard/js/formatTaskData";

export default {
  name: "myTasksBoard",
  components: {IconBase, draggable: VueDraggableNext},
  data() {
    return {
      sectionTaskList: {},
      sectionActive: '',
      activeSectionName: '',
      isShadowed: false,
      firstSection: '',
      showDeleteMessage: false,
      currentSection: {},
      deleteType: 'keep',
      showAddTask: false,
      showAddTaskSectionID: '',
      addTaskName: '',
      addCardHeight: '0',
      firstClick: false,
      dateValue: '',
      dateType: 'date',
      addCompletedDate: '',
      addCompletedTime: '',
      sortList:[
        {'value': 'none', "name": 'None'},
        {'value': 'startDate', "name": 'Start date'},
        {'value': 'dueDate', "name": 'Due date'},
        {'value': 'createBy', "name": 'Create by'},
        {'value': 'createOn', "name": 'Create on'},
        {'value': 'modified', "name": 'Last modified on'},
        {'value': 'likes', "name": 'Likes'},
        {'value': 'alphabetical', "name": 'Alphabetical'},
      ],
      sortSelect:''
    }
  },
  mounted() {
    this.sectionTaskList = formatTasksList(this.tasksList, this.sectionList, 'incomplete')
    this.firstSection = this.sectionList[0].id
  },
  props: {
    tasksList: {
      type: Object,
      default: {}
    },
    sectionList: {
      type: Object,
      default: {}
    },
  },
  watch: {
    tasksList(newVal) {
      this.sectionTaskList = formatTasksList(newVal, this.sectionList, 'incomplete')
    },
    sectionList(newVal) {
      this.firstSection = newVal[0].id
    },
    showAddTask(newVal) {
      if (newVal) {
        document.addEventListener("click", this.closeAddTask)
      } else {
        document.removeEventListener("click", this.closeAddTask)
      }
    },
    dateValue(newVal) {
      let task;
      if (newVal === null) {
        task = {start_time: null, complete_time: null}
      } else if (typeof newVal === 'string') {
        task = {start_time: null, complete_time: newVal}
        this.addCompletedTime = newVal
      } else {
        task = {start_time: newVal[0], complete_time: newVal[1]}
        this.addCompletedTime = newVal[1]
      }
      task = formatTaskData()(task)
      this.addCompletedDate = task.complete_date
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "section",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    taskDragOptions() {
      return {
        animation: 200,
        group: "tasks",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    addSection(index, type) {
      let url = '/api/add_section/'
      let data = {'name': 'Untitled Section'}
      apiHttpClient.post(url, data).then((res) => {
        let num = type === 'left' ? index:index+1
        this.sectionList.splice(num, 0, res.data.results)
        this.sectionTaskList[res.data.results.id] = []
        this.activeSection(res.data.results)
      })
    },
    changeTask(event) {
      console.log(event)
    },
    closeAddTask(e) {
      if (this.$refs[`newCard${this.showAddTaskSectionID}`] && !this.$refs[`newCard${this.showAddTaskSectionID}`][0].contains(e.target) && this.firstClick) {
        this.closeTask()
      }
    },
    changeHeight() {
      this.addCardHeight = this.$refs[`addTask${this.showAddTaskSectionID}`][0].offsetHeight + 48 + 'px'
    },
    async closeTask() {
      if (this.showAddTask) {
        this.addCardHeight = '0px'
        this.showAddTask = false
        this.firstClick = false
        let sectionId = this.showAddTaskSectionID
        let taskName = this.addTaskName
        let date = this.dateValue
        if (taskName !== '') {
          let url = '/api/create_task/'
          let data;
          if (typeof date === 'string') {
            data = {title: taskName, complete_time: this.dateValue, section_id: sectionId}
          } else if (date === null) {
            data = {title: taskName, section_id: sectionId}
          } else {
            data = {
              title: taskName,
              complete_time: date[1],
              start_time: date[0],
              section_id: sectionId
            }
          }
          apiHttpClient.post(url, data).then((res) => {
            let task = formatTaskData()(res.data.results)
            this.sectionTaskList[sectionId].unshift(task)
          })
        }
        setTimeout(() => {
          this.showAddTaskSectionID = ''
          this.addTaskName = ''
          this.dateValue = null
        }, 100)
      }
    },
    async addTask(section) {
      if (!this.showAddTask) {
        this.addCardHeight = '100px'
        this.showAddTaskSectionID = section.id
        setTimeout(() => {
          this.showAddTask = true
          this.firstClick = true
        }, 100)
        setTimeout(() => {
          this.$refs[`addTask${this.showAddTaskSectionID}`][0].focus()
        }, 150)
      } else {
        setTimeout(() => {
          this.addTask(section)
        }, 200)

      }
    },
    completeTask(taskID, sectionID, index) {
      let url = '/api/update_task/'
      apiHttpClient.post(url, {'task_id': taskID, 'completed': true}).then(() => {
        this.sectionTaskList[sectionID].splice(index, 1)
      })
    },
    watchKey(section, index, event) {
      if (event.key === 'Enter' && !event.isComposing) {
        event.stopPropagation()
        event.preventDefault()
        this.updateSection(section, index)
      }
    },
    handleClosePop(sectionID) {
      this.$refs[`headerPopOver${sectionID}`][0].isPopShow = false
    },
    compareTime(time) {
      let now = new Date()
      let result = true
      let completeTime = new Date(time)
      if (completeTime - now < 0) {
        result = false
      }
      return result
    },
    sectionLength(sectionID) {
      let section = this.sectionTaskList[sectionID]
      if (section !== undefined) {
        return section.length
      }
    },
    activeSection(section) {
      if (section !== 'addSection') {
        this.sectionActive = section.id
        this.activeSectionName = section.name
        this.$nextTick(() => {
          this.$refs[`section${section.id}`][0].$refs.input.focus()
        })
      } else {
        this.sectionActive = 'addSection'
        this.$nextTick(() => {
          this.$refs.addSection.$refs.input.focus()
        })
      }
    },
    updateSection(section, index) {
      if (this.activeSectionName !== section.name && section !== 'addSection') {
        let url = 'api/change_section/'
        let data = {'section_id': section.id, 'name': this.activeSectionName}
        apiHttpClient.post(url, data).then((res) => {
          this.sectionList[index].name = res.data.results.name
        })
      } else if (section === 'addSection' && this.activeSectionName !== '') {
        let url = 'api/add_section/'
        let data = {'name': this.activeSectionName}
        apiHttpClient.post(url, data).then((res) => {
          this.sectionList.push(res.data.results)
          this.sectionTaskList[res.data.results.id] = []
        })
      }
      this.sectionActive = ''
      this.activeSectionName = ''
    },
    deleteSection(sectionID, index, type) {
      let url = 'api/delete_section/'
      let data = {'section_id': sectionID, 'delete_type': type}
      apiHttpClient.post(url, data).then(() => {
        this.sectionList.splice(index, 1)
        this.showDeleteMessage = false
        if (type === 'keep') {
          this.sectionTaskList[this.firstSection].unshift(...this.sectionTaskList[sectionID])
        }
      })
    },
    deleteSelect(sectionID, index) {
      if (this.sectionLength(sectionID) === 0) {
        this.deleteSection(sectionID, index, 'delete')
      } else {
        this.showDeleteMessage = true
        this.currentSection['name'] = this.sectionList[index].name
        this.currentSection['id'] = sectionID
        this.currentSection['index'] = index
        let completedList = formatTasksList(this.tasksList, this.sectionList, 'completed')
        this.currentSection['incomplete'] = this.sectionLength(sectionID)
        this.currentSection['completed'] = completedList[sectionID].length
        this.showDeleteMessage = true
      }
    }
  }
}

// 修改tasksList格式
function formatTasksList(tasksList, sectionList, type) {
  const newTasksList = {};
  const completedTaskList = {}
  for (let section of sectionList) {
    newTasksList[section.id] = []
    completedTaskList[section.id] = []
    for (let task of tasksList) {
      if (task.section === section.id && task.completed !== true && type === 'incomplete') {
        newTasksList[section.id].push(task)
      } else if (task.section === section.id && task.completed === true && type === 'completed') {
        completedTaskList[section.id].push(task)
      }
    }
  }
  return newTasksList
}

</script>

<style scoped>
.home-card {
  display: flex;
}

.main-header {
  display: flex;
  justify-content: space-between;
  font-size: .75rem;
  color: var(--gray);
  height: 2.5rem;
  align-items: center;
  padding: 0 1.5rem;
  font-weight: 500;
  border-bottom: 1px solid #EDE9E8;
}

.right-button {
  display: flex;
  align-items: center;
  font-weight: 600;
  height: 1.75rem;
  padding: 0 .5rem;
  border-radius: .5rem;
  margin-left: .5rem;
  cursor: pointer;
}

.right-button:hover {
  background-color: #F9F8F8;
  color: var(--black);
}

.right-button span {
  margin-left: .25rem;
}

.main-header-right {
  display: flex;
  align-items: center;
}

.section-swap {
  display: flex;
  padding: 1rem .75rem 0 .75rem;
  height: 100%;
  background-color: white;
  overflow-y: hidden;
}

.task-list {
  height: 100%;
  overflow-y: auto;
}

.list-card {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 19rem;
  padding: 0 .75rem;
  /*background-color: #fff3cd;*/
  border-radius: .375rem;
  height: 100%;
  transition: border .3s;
  /*overflow-y: auto;*/
  position: relative;
}

.list-card-noHover {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 19rem;
  padding: 0 .75rem;
  /*background-color: #fff3cd;*/
  border-radius: .375rem;
  height: 100%;
  transition: border .3s;
  /*overflow-y: auto;*/
  position: relative;
}

.list-card:hover {
  box-shadow: 0 0 0 1px #edeae9, 0 1px 4px 0 rgba(109, 110, 111, 0.08);
}

.height-175 {
  height: 1.75rem;
  width: 4.0625rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
  margin-top: .25rem;
  position: relative;
}

.section-header span {
  position: relative;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  text-align: left;
  cursor: pointer;
  height: 2.25rem;
  line-height: 2.25rem;
}

.section-header-right {
  display: flex;
  align-items: center;
}

.section-header-icon {
  color: var(--gray);
  display: flex;
  align-items: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-left: .25rem;
  justify-content: center;
  transition: color .3s, background-color .3s;
}

.section-header-icon:hover {
  color: var(--black);
  background-color: #F9F8F8;
}

.title-input {
  width: 13.5rem;
}

.task-card {
  display: flex;
  background-color: white;
  width: 100%;
  margin-bottom: .5rem;
  border-radius: .5rem;
  border: 1px solid #edeae9;
  flex-direction: column;
  align-items: flex-start;
  transition: height .3s, border .3s;
}

.task-card:hover {
  border: 1px solid #6D6E6F;
}

.new-card {
  border: 1px solid #6D6E6F;
  display: flex;
  height: v-bind(addCardHeight);
  transition: height .3s;
  position: relative;
  padding: 0 0 1rem 0;
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

.task-title {
  padding: .75rem 1rem;
  position: relative;
  display: flex;
  align-items: center;
}

.task-title span {
  font-size: .875rem;
  text-indent: 1.5rem;
  font-weight: 500;
  word-break: break-word;
  text-align: left;
}

.task-complete {
  color: var(--gray);
  position: absolute;
  cursor: pointer;
  z-index: 11;
  top: .95rem
}

.task-complete:hover {
  color: #6A9F84;
  background-color: #E9F7F1;
}

.task-project {
  display: flex;
  padding: 1rem .9rem .25rem .9rem;
  justify-content: left;
  flex-wrap: wrap;
}

.project-color {
  width: 2.625rem;
  height: .375rem;
  margin: .25rem .25rem 0 .25rem;
  border-radius: 1rem;
}

.task-complete-date {
  padding: 0 1rem 1rem 1rem;
  font-size: .75rem;
  color: var(--gray);
}

.green {
  color: #0d7f56;
}

.green1 {
  color: #0d7f56;
}

.overdue {
  color: #c92f54;
}

.grayBackgroundColor {
  /*margin-top: .5rem;*/
  padding: 1rem;
  height: 100%;
  border-radius: .375rem;
  background: linear-gradient(180deg, #f9f8f8, rgba(249, 248, 248, 0) 100%);
}

.add-task {
  display: flex;
  align-items: center;
  width: 100%;
  transition: background-color .3s;
  justify-content: center;
  height: 2.25rem;
  border-radius: .375rem;
  margin-bottom: 1rem;
  cursor: pointer;
  color: var(--gray);
  fill: var(--gray);
}

.add-task:hover {
  background-color: #F4F2F2;
  color: var(--black);
  fill: var(--black);
}

.add-task span {
  font-weight: 700;
  font-size: .875rem;
  margin-left: .25rem;
}

.add-color {
  color: currentColor;
}

.pop-item {
  display: flex;
  height: 2.375rem;
  padding: .5rem .75rem;
  align-items: center;
  cursor: pointer;
  width: 11.5rem;
}

.pop-item:hover {
  background-color: #F5F3F3;
}

.pop-item svg {
  min-width: 1rem;
}

.pop-item span {
  margin-left: .5rem;
  font-size: .875rem;
  font-weight: 400;
  color: var(--black);
}

.add-section {
  display: flex;
  align-items: center;
  color: var(--gray);
  transition: background-color .3s;
  height: 2.25rem;
  padding: 0 .5rem;
  border-radius: .3rem;
}

.add-section:hover {
  background-color: #F9F8F8;
  color: var(--black);
}

.add-section svg {
  min-width: 1rem;
}

.add-section span {
  margin-left: .5rem;
  font-size: 1rem;
  font-weight: 600;
}

.width-100 {
  width: 100% !important;
}

.delete-message {
  background-color: white;
  min-width: 35rem;
  max-height: 19.7rem;
  border-radius: .75rem;

}

.delete-header {
  height: 4rem;
  display: flex;
  font-size: 1.25rem;
  font-weight: 600;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid #ECEAE9;
}

.radio-custom {
  border-radius: .88rem;
  height: .88rem;
  width: .88rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0275FF;
}

.radio-custom-uncheck {
  border-radius: .88rem;
  height: .88rem;
  width: .88rem;
  border: 1px solid #797979;
}

.radio-custom-inner {
  border-radius: 1rem;
  height: .44rem;
  width: .44rem;
  background-color: #0275FF;
}

.delete-main {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  border-bottom: 1px solid #ECEAE9;
}

.delete-option {
  margin-top: .75rem;
  display: flex;
  align-items: center;
}

.delete-option span {
  margin-left: .5rem;
}

.header-close {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: .3rem;
  transition: background-color .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-close:hover {
  background-color: #F9F8F8;
}

.delete-button {
  height: 4rem;
  display: flex;
  align-items: center;
  gap: .75rem;
  justify-content: flex-end;
  padding: 0 1.5rem;
}

.add-task-input {
  background-color: white;
  text-indent: 1.5rem;
  color: var(--black);
  border: none;
  resize: none;
  height: 100%;
  position: absolute;
  width: 15.375rem;
  padding: .75rem 0;
}

.vsb-hidden-div {
  visibility: hidden;
  word-break: break-word;
  text-indent: 1.5rem;
  min-height: 1.35rem;
}

.add-task-input:focus {
  border: none;
  outline: none;
}

.date-due {
  display: flex;
  align-items: center;
  margin: .5rem 1rem 0 1rem;
}

.date-due span {
  word-break: keep-all;
}

.width-5 {
  width: 10rem !important;

}
</style>