<template>
  <div class="edit-task-swap">
    <div class="edit-header">
      <div :class="{'completed':currentTaskData.completed}" class="button" @click="changeTask('completed')">
        <icon-base height=".75rem" width=".75rem">
          <Right/>
        </icon-base>
        <span v-if="!currentTaskData.completed">Mark complete</span>
        <span v-else>Completed</span>
      </div>
      <div class="icons">
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Like/>
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Clip/>
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <SubTask/>
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Link/>
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Expand/>
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <More/>
          </icon-base>
        </div>
        <div class="icon-item" @click="close">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <XIcon/>
          </icon-base>
        </div>
      </div>
    </div>
    <div class="public">
      <div class="public-left">
        <icon-base height=".75rem" icon-color="var(--gray)" width=".75rem">
          <Lock/>
        </icon-base>
        <span>This task is visible to members of My Workspace.</span>
      </div>
      <div class="public-right">
        Make public
      </div>
    </div>
    <div class="task-main">
      <div class="task-title">
        <div class="title" @mouseenter="showTitleInput = true">
          {{ taskTitle }}
        </div>
        <new-input v-show="showTitleInput" v-model="taskTitle" class="title mrg-left" weight="500"
                   @blur="showTitleInput = titleInputFocus = false" @focus="showTitleInput = titleInputFocus = true"
                   @mouseleave="isShowTitle"
        ></new-input>
      </div>
      <div class="task-pane">
        <div class="task-pane-item">
          <div class="item-left">
            <span>Assignee</span>
          </div>
          <div class="item-right" @mouseenter="showXIcon = 'assignee'" @mouseleave="showXIcon = false">
            <div class="item-info">
              <div class="user-icon">{{ currentTaskData.assigned_to.username[0] }}</div>
              <span>{{ currentTaskData.assigned_to.username }}</span>
            </div>
            <div class="icon-item mrg-l">
              <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                <XIcon/>
              </icon-base>
            </div>
            <div style="height: 2.125rem">
              <select-bar v-model="sectionSelect" :options="sectionList" option-title="My task"></select-bar>
            </div>
          </div>
        </div>
        <div class="task-pane-item">
          <div class="item-left">
            <span>Due date</span>
          </div>
          <div class="item-right" @mouseenter="showXIcon = 'date'" @mouseleave="showXIcon = false">
            <date-pick v-model="dateValue" startPosition="flex-start" @show="updateDate">
              <div class="item-info">
                <div class="calendar-icon">
                  <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                    <BigCalendar/>
                  </icon-base>
                </div>
                <span v-if="currentTaskData.complete_date !== ''" class="date-color">{{ completeDate }}</span>
                <span v-else>No due date</span>
              </div>
            </date-pick>
            <div v-if="showXIcon === 'date'" class="icon-item mrg-l" @click="dateValue=null,updateDate(false)">
              <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                <XIcon/>
              </icon-base>
            </div>
          </div>
        </div>
        <div class="task-pane-item align">
          <div class="item-left mrg-top-5">
            <span>Projects</span>
          </div>
          <div>
            <div class="task-project">
              <div v-for="item in currentTaskData.project" class="dsp-flx" @mouseenter="showXIcon = item.id"
                   @mouseleave="showXIcon = false">
                <tool-tip content="Click to view all tasks in this project" style="height: 1.75rem">
                  <div class="item-right hover">
                    <icon-base :icon-color="item.color" box-view="0 0 24 24" height=".75rem"
                               width=".75rem">
                      <Box/>
                    </icon-base>
                    <span class="mrg-l-5">{{ item.name }}</span>
                  </div>
                </tool-tip>
                <div v-if="compare(categoryList[item.id],[])" style="height: 2.125rem">
                  <select-bar v-model="categorySelect[item.id]" :options="categoryList[item.id]"></select-bar>
                </div>
                <div v-if="showXIcon === item.id" class="icon-item mrg-l" @click="removeProject(item.id)">
                  <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                    <XIcon/>
                  </icon-base>
                </div>
              </div>
            </div>
            <div class="select-project" @click="showAdd" v-show="!showAddInput">
              <span>Add to projects</span>
            </div>
            <new-input v-show="showAddInput" ref="projectInput" v-model="searchWords" @input="search"
                       @keydown="keySelectProject" @blur="hiddenAddInput" placeholder="Add task to a project..."></new-input>
            <div v-show="showAddInput" ref="projectWrapper" class="project-select">
              <div v-for="(item,index) in currentProjectList" :key="item.id"
                   :class="{'when-active':projectSelectIndex === index,'borderBottom':item.id === 0}"
                   class="select-option cursor"
                   @click="keySelectProject"
                   @mouseenter="projectSelectIndex = index"
              >
                <div class="text-overflow dsp-flx">
                  <span>{{ item.name }}</span>
                  <div v-if="item.archive" class="archived">
                    <icon-base box-view="0 0 24 24" height=".75rem" width=".75rem">
                      <SolidArchived/>
                    </icon-base>
                    <span>Archived</span>
                  </div>
                </div>
              </div>
              <div v-if="this.currentProjectList.length === 0" class="create-project">
                <icon-base box-view=" 0 0 32 32" icon-color="#4069C3">
                  <MiniPlus/>
                </icon-base>
                <span>Create project for '{{ searchWords }}'</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconBase from "@/components/IconBase";
import {
  SolidArchived,
  Right,
  Like,
  Clip,
  SubTask,
  Link,
  Expand,
  More,
  XIcon,
  Lock,
  BigCalendar,
  Box,
  MiniPlus
} from "@/components/icons";
import NewInput from "@/components/common/NewInput";
import SelectBar from "@/components/common/SelectBar";
import ToolTip from "@/components/common/ToolTip";
import DatePick from "@/components/common/DateTimePicker";
</script>

<script>
import formatTaskData from "@/components/homeCard/js/formatTaskData"
import {apiHttpClient} from "@/app/app.service";

export default {
  name: "editTask",
  data() {
    return {
      dateColor: 'var(--gray)',
      showAddInput: false,
      searchWords: '',
      projectSelectIndex: 0,
      currentProjectList: [],
      projectSelectShow: true,
      completeDate: '',
      showXIcon: false,
      categorySelect: {},
      sectionSelect: '',
      taskTitle: '',
      showTitleInput: false,
      titleInputFocus: false,
      sectionList: [{}],
      categoryList: {},
      dateValue: '',
      sectionSelectTemp: {},
      showDate: '',
      currentTaskData: {assigned_to: {username: ''}, project: {color: '', name: '', id: ''}}
    }
  },
  props: {
    taskData: {
      type: [String, Object, Boolean],
      default: ''
    },
    projectList: {
      type: Object,
      default: {}
    }
  },
  watch: {
    async taskData(newValue) {
      this.currentTaskData = newValue
      this.taskTitle = newValue.title
      this.getSection()
      if (newValue.project !== null) {
        for (let item of newValue.project) {
          const categoryTemp = await this.getCategory(item.id)
          const project_id = item.id
          this.categoryList[project_id] = categoryTemp
          this.categorySelect[project_id] = categoryTemp[0]
        }
      }

      if (newValue.complete_time !== null) {
        if (newValue.start_time !== null) {
          this.dateValue = [newValue.start_time, newValue.complete_time]
        } else {
          this.dateValue = newValue.complete_time
        }
      } else {
        if (newValue.start_time !== null) {
          this.dateValue = [newValue.start_time, newValue.complete_time]
        } else {
          this.dateValue = newValue.complete_time
        }
      }
      this.completeDate = newValue.complete_date
      this.currentProjectList = this.projectList
    },
    dateValue(newValue) {
      let task;
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      if (newValue === null) {
        task = {complete_time: null, start_time: null}
      } else if (typeof newValue === "string") {
        task = {complete_time: newValue, start_time: null}
        this.dateColor = new Date(newValue) < today ? '#c92f54' : 'var(--black)'
        this.dateColor = new Date(newValue).getTime() === todayEnd.getTime() ? '#0d7f56' : this.dateColor
      } else {
        task = {complete_time: newValue[1], start_time: newValue[0]}
        this.dateColor = new Date(newValue[1]) < today ? '#c92f54' : 'var(--black)'
        this.dateColor = new Date(newValue[1]).getTime() === todayEnd.getTime() ? '#0d7f56' : this.dateColor
      }
      task = formatTaskData()(task)
      this.completeDate = task.complete_date
      if (this.completeDate === '') {
        this.completeDate = 'No due date'
      }
    },
    sectionSelect(newValue) {
      const isEmptyObject = Object.keys(newValue).length === 0;
      if (newValue !== this.sectionSelectTemp && !isEmptyObject) {
        this.changeTask('section')
      }
    },
    showTitleInput(newValue) {
      if (!newValue && this.taskTitle !== this.currentTaskData.title) {
        this.changeTask('title')
      }
    }
  },
  created() {
  },
  methods: {
    removeProject(project_id) {
      const url = '/api/update_task/'
      const data = {task_id: this.currentTaskData.id, project_id: project_id, remove: true}
      apiHttpClient.post(url, data).then(() => {
        for (let index in this.currentTaskData.project) {
          if (this.currentTaskData.project[index].id === project_id) {
            this.currentTaskData.project.splice(index, 1)
          }
        }
      })
    },
    compare(item1, item2) {
      const _ = require('lodash');
      return !_.isEqual(item1, item2)
    },
    updateDate(item) {
      if (!item) {
        this.changeTask('date')
      }
    },
    async changeTask(type) {
      const url = '/api/update_task/'
      if (type === 'completed') {
        const data = {completed: !this.currentTaskData.completed, task_id: this.currentTaskData.id}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.completed = !this.currentTaskData.completed
        })
      } else if (type === 'section') {
        const data = {section_id: this.sectionSelect.id, task_id: this.currentTaskData.id}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.section = this.sectionSelect.id
        })
      } else if (type === 'date') {
        let data = {task_id: this.currentTaskData.id}
        if (typeof this.dateValue === "string" || this.dateValue === null) {
          data = {task_id: this.currentTaskData.id, complete_time: this.dateValue, start_time: null}
        } else {
          data = {task_id: this.currentTaskData.id, complete_time: this.dateValue[1], start_time: this.dateValue[0]}
        }
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.complete_time = data.complete_time
          this.currentTaskData.start_time = data.start_time
        })
      } else if (type === 'title') {
        const data = {task_id: this.currentTaskData.id, title: this.taskTitle}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.title = this.taskTitle
        })
      }
      this.currentTaskData = await formatTaskData()(this.currentTaskData)
      await this.$emit('updateTask', this.currentTaskData)
    },
    showAdd() {
      this.searchWords = null
      this.showAddInput = true
      this.currentProjectList =  this.projectList
      this.$nextTick(() => {
        this.$refs.projectInput.$refs.input.focus()
      })
    },
    search() {
      this.currentProjectList = this.projectList.filter(item => item.name.toLowerCase().includes(this.searchWords.toLowerCase()))
    },
    keySelectProject() {
      if (event.keyCode) {
        switch (event.keyCode) {
            // 跳转到project选择
          case 9: // Tab键
          case 13: // Enter键
              this.addProject()
            break;
          case 40: // 下箭头
            this.projectSelectIndex = (this.projectSelectIndex + 1) % this.currentProjectList.length
            this.searchWords = this.currentProjectList[this.projectSelectIndex].name
            this.scrollToActiveOption()
            break;
          case 38: // 上箭头
            this.projectSelectIndex = (this.currentProjectList.length + this.projectSelectIndex - 1) % this.currentProjectList.length
            this.searchWords = this.currentProjectList[this.projectSelectIndex].name
            this.scrollToActiveOption()
            break;
          default:
            break;
        }
      } else { //鼠标点击选择
        this.addProject()
      }
    },
    hiddenAddInput() {
      setTimeout(()=>{
        this.showAddInput = false
      },100)
    },
    addProject() {
      const url = '/api/update_task/'
              const data = {task_id:this.currentTaskData.id,project_id:[this.currentProjectList[this.projectSelectIndex].id]}
              apiHttpClient.post(url,data).then(()=>{
                this.currentTaskData.project.push(this.currentProjectList[this.projectSelectIndex])
                this.showAddInput = false
              })
    },
    // project选择时，上下键附带滚动
    scrollToActiveOption() {
      const selectWrapper = this.$refs.projectWrapper
      const activeOption = this.$refs.projectWrapper.querySelector('.when-active')
      const optionHeight = activeOption.offsetHeight
      if (this.projectSelectIndex > 5) {
        selectWrapper.scrollTop = optionHeight * (this.projectSelectIndex - 5)
      } else if (this.projectSelectIndex === 0) {
        selectWrapper.scrollTop = 0
      }
    },
    getSection() {
      const url = "/api/get_all_section/"
      apiHttpClient.get(url).then((response) => {
        this.sectionList = response.data.results
        for (let index in this.sectionList) {
          this.sectionList[index].value = this.sectionList[index].id
          if (this.sectionList[index].id === this.currentTaskData.section) {
            this.sectionSelect = this.sectionList[index]
          }
        }
        this.sectionSelectTemp = this.sectionSelect
      })
    },
    async getCategory(id) {
      const url = "/api/get_category/"
      const data = {project_id: id}
      let List;
      await apiHttpClient.post(url, data).then((response) => {
        List = response.data.results
        for (let index in List) {
          List[index].value = List[index].id
        }
      })
      return await List
    },
    isShowTitle() {
      if (!this.titleInputFocus) {
        this.showTitleInput = false
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-task-swap {
  background-color: white;
  height: 40rem;
  width: 40rem;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  padding: .875rem 1.5rem;
  border-bottom: 1px solid #ECE9E8;
}

.button {
  display: flex;
  align-items: center;
  padding: 0 .5rem;
  height: 1.75rem;
  background-color: white;
  border: 1px solid #EEEAE9;
  border-radius: .4rem;
  transition: background-color .3s, border-color .3s;
  color: var(--black);
}

.button:hover {
  background-color: #E0F5ED;
  border-color: #58A182;
  color: #11724D;
}

.completed {
  background-color: #E0F5ED;
  border-color: #58A182;
  color: #11724D;
}

.button span {
  margin-left: .3rem;
}

.icons {
  display: flex;
}

.icon-item {
  width: 1.625rem;
  height: 1.625rem;
  transition: background-color .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .3rem;
  color: var(--gray);
  margin-left: .5rem;
}

.icon-item:hover {
  background-color: rgba(231, 231, 231, .5)
}

.public {
  display: flex;
  padding: .5rem 1.5rem;
  background-color: #F9F8F8;
  justify-content: space-between;
}

.public-left {
  display: flex;
  align-items: center;
}

.public-left span {
  margin-left: .5rem;
}

.public-right {
  padding: 0 .5rem;
  transition: background-color .3s;
  border-radius: .3rem;
}

.public-right:hover {
  background-color: rgba(231, 231, 231, .7)
}

.task-main {
  padding: 0 1.5rem;
}

.task-title {
  position: relative;
  margin: .5rem 0;
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
  padding: .375rem .75rem;
  text-align: left;
  margin-left: -0.8rem;
  border: 1px solid white;
}

.mrg-left {
  margin-left: -1.55rem !important;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 .75rem !important;
  border: none;
}

.task-pane {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.task-pane-item {
  display: flex;
  align-items: center;
  margin: .3rem 0;
}

.item-left {
  width: 7.5rem;
  text-align: left;
  margin-right: .5rem;
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
  width: max-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: .2rem .6rem;
  border-radius: .3rem;
  transition: background-color .3s;
}

.item-info:hover {
  background-color: rgb(248, 246, 246);
}

.item-info span {
  margin-left: .5rem;
}

.date-color {
  color: v-bind(dateColor);
}

.item-right {
  display: flex;
  align-items: center;
}

.mrg-l-5 {
  margin-left: .5rem;
}

.mrg-l {
  margin-left: 0;
}

.calendar-icon {
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid v-bind(dateColor);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: v-bind(dateColor);
}

.hover {
  padding: .2rem .6rem;
  border-radius: .3rem;
  transition: background-color .3s;
}

.hover:hover {
  background-color: rgb(248, 246, 246);
}

.task-project {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.select-project {
  max-width: max-content;
  font-size: .75rem;
  font-weight: 600;
  padding: .2rem .6rem;
  border-radius: .3rem;
  color: var(--gray);
}

.select-project:hover {
  background-color: rgb(248, 246, 246);
  color: var(--black);
}

.project-select {
  width: 27.5rem;
  border-radius: .5rem;
  max-height: 15rem;
  overflow-y: auto;
  border: 2px solid #F3F1F1;
  background-color: white;
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

.dsp-flx {
  display: flex;
  align-items: center;
}

.create-project {
  display: flex;
  align-items: center;
  padding: .5rem 1.5rem;
  color: #4069C3;
}

.create-project span {
  margin-left: .5rem;
}

.align {
  align-items: flex-start;
}

.mrg-top-5 {
  margin-top: .5rem;
}

.archived {
  display: flex;
  align-items: center;
  color: var(--gray);
  margin-left: 1.5rem;
}

.archived span {
  font-size: .75rem;
  margin-left: .25rem;
}
</style>