<template>
  <div class="edit-task-swap">
    <!--    弹窗表头-->
    <div class="edit-header">
      <div :class="{'completed':currentTaskData.completed}" class="button cursor" @click="changeTask('completed')">
        <icon-base height=".75rem" width=".75rem">
          <Right/>
        </icon-base>
        <span v-if="!currentTaskData.completed">Mark complete</span>
        <span v-else>Completed</span>
      </div>
      <div class="icons">
        <tool-tip content="Like this">
          <div class="icon-item">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <Like/>
            </icon-base>
          </div>
        </tool-tip>
        <tool-tip content="Add a file to this task." header="Attachments">
          <div class="icon-item">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <Clip/>
            </icon-base>
          </div>
        </tool-tip>
        <tool-tip content="Add a task within this task. Subtasks can have different assignees and due dates." header="Subtasks">
          <div class="icon-item">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <SubTask/>
            </icon-base>
          </div>
        </tool-tip>
        <tool-tip content="Copy task link">
          <div class="icon-item">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <Link/>
            </icon-base>
          </div>
        </tool-tip>
        <tool-tip content="Full screen">
          <div class="icon-item">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <Expand/>
            </icon-base>
          </div>
        </tool-tip>
        <div class="icon-item">
          <popover>
            <template #main>
              <tool-tip content="More actions">
                <div class="icon-item">
                  <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                    <More/>
                  </icon-base>
                </div>
              </tool-tip>
            </template>
            <template #pop>
              <div class="pop-item">
                <icon-base box-view="0 0 32 32"><Project /></icon-base>
                <span>Add to another project</span>
              </div>
            </template>
          </popover>
        </div>
        <tool-tip content="Collapse task pane">
          <div class="icon-item" @click="close">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <XIcon/>
            </icon-base>
          </div>
        </tool-tip>
      </div>
    </div>
    <div class="public">
      <div class="public-left">
        <icon-base height=".75rem" icon-color="var(--gray)" width=".75rem">
          <Lock/>
        </icon-base>
        <span>This task is visible to members of My Workspace.</span>
      </div>
      <div class="public-right cursor">
        Make public
      </div>
    </div>
    <div class="task-main">
      <!--      task title-->
      <div class="task-title">
        <div class="title" @mouseenter="showTitleInput = true">
          {{ taskTitle }}
        </div>
        <new-input v-show="showTitleInput" v-model="taskTitle" class="title mrg-left" weight="500"
                   @blur="showTitleInput = titleInputFocus = false" @focus="showTitleInput = titleInputFocus = true"
                   @mouseleave="isShowTitle"
        ></new-input>
      </div>
      <!--      task Assignee-->
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
        <!--        task date-->
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
            <tool-tip content="Clear due date">
              <div v-if="showXIcon === 'date'" class="icon-item mrg-l cursor" @click="dateValue=null,updateDate(false)">
                <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                  <XIcon/>
                </icon-base>
              </div>
            </tool-tip>
          </div>
        </div>
        <!--        task project-->
        <div class="task-pane-item align">
          <div class="item-left mrg-top-5">
            <span>Projects</span>
          </div>
          <div>
            <div class="task-project">
              <div v-for="item in currentTaskData.project" class="dsp-flx" @mouseenter="showXIcon = item.id"
                   @mouseleave="showXIcon = false">
                <tool-tip content="Click to view all tasks in this project" style="height: 1.75rem">
                  <div class="item-right hover cursor">
                    <icon-base :icon-color="item.color" box-view="0 0 24 24" height=".75rem"
                               width=".75rem">
                      <Box/>
                    </icon-base>
                    <span class="mrg-l-5">{{ item.name }}</span>
                  </div>
                </tool-tip>
                <div style="height: 2.125rem" @click="changeCategory(item.id)">
                  <select-bar v-model="categorySelect[item.id]" :options="categoryList[item.id]"></select-bar>
                </div>
                <tool-tip content="Remove task from this project">
                  <div v-if="showXIcon === item.id" class="icon-item mrg-l" @click="removeProject(item.id)">
                    <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                      <XIcon/>
                    </icon-base>
                  </div>
                </tool-tip>
              </div>
            </div>
            <div v-show="!showAddInput" class="select-project" @click="showAdd">
              <span>Add to projects</span>
            </div>
            <new-input v-show="showAddInput" ref="projectInput" v-model="searchWords"
                       placeholder="Add task to a project..."
                       @blur="hiddenAddInput" @input="search"
                       @keydown="keySelectProject"></new-input>
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
              <div v-if="this.currentProjectList.length === 0" class="create-project" @click="createProject">
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
  Project,
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
import Popover from "@/components/common/Popover";
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
      oldCategorySelect: {},
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
    // 打开弹窗，数据更新
    async taskData(newValue) {
      this.currentTaskData = newValue
      this.taskTitle = newValue.title
      // 获取Section
      this.getSection()
      // 获取project对应的category
      let projectIDList = []
      if (newValue.project !== null) {
        for (let item of newValue.project) {
          projectIDList.push(item.id)
        }
        this.categoryList = await this.getCategory(projectIDList, 'many')
        this.categorySelectList = await this.getSelectCategory(projectIDList, 'many')
        for (let item of projectIDList) {
          for (let option of this.categoryList[item]) {
            if (this.categorySelectList[item] === option.id) {
              option.value = option.id
              this.oldCategorySelect[item] = this.categorySelect[item] = option
            }
          }
        }
      }
      // 日期更新
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
    // 日期更新
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
      // 日期格式更新
      task = formatTaskData()(task)
      this.currentTaskData.complete_date = this.completeDate = task.complete_date
      if (this.completeDate === '') {
        this.completeDate = 'No due date'
      }
    },
    // section选择
    sectionSelect(newValue) {
      const isEmptyObject = Object.keys(newValue).length === 0;
      if (newValue !== this.sectionSelectTemp && !isEmptyObject) {
        this.changeTask('section')
      }
    },
    // title更新
    showTitleInput(newValue) {
      if (!newValue && this.taskTitle !== this.currentTaskData.title) {
        this.changeTask('title')
      }
    }
  },
  methods: {
    async getSelectCategory(list, type) {
      const url = "/api/get_select_category/"
      let data;
      if (type === 'many') {
        data = {'task_id': this.currentTaskData.id, 'project_id': list, 'many': true}
      }
      let response;
      await apiHttpClient.post(url, data).then((res) => {
        response = res.data.results
      })
      return response
    },
    changeCategory(project_id) {
      const currentCategory = this.categorySelect[project_id]
      if (currentCategory !== this.oldCategorySelect[project_id]) {
        const url = "/api/update_select_category/"
        const data = {project_id: project_id, task_id: this.currentTaskData.id, category_id: currentCategory.id}
        apiHttpClient.post(url, data)
      }
    },
    async createProject() {
      const url = "/api/create_project/"
      let project_id;
      await apiHttpClient.post(url, {name: this.searchWords}).then((res) => {
        this.currentProjectList = this.projectList.push(res.data.results)
        const urlTwo = '/api/update_task/'
        project_id = res.data.results.id
        const data = {task_id: this.currentTaskData.id, project_id: [project_id]}
        apiHttpClient.post(urlTwo, data).then(() => {
          this.currentTaskData.project.push(res.data.results)
          this.showAddInput = false
        })
      })
      const categoryTemp = await this.getCategory(project_id, 'single')
      this.categoryList[project_id] = categoryTemp
      this.oldCategorySelect[project_id] = this.categorySelect[project_id] = categoryTemp[0]
    },
    // 删除project
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
    // 对比
    compare(item1, item2) {
      const _ = require('lodash');
      return !_.isEqual(item1, item2)
    },
    // 更新日期
    updateDate(item) {
      if (!item) {
        this.changeTask('date')
      }
    },
    // 变更task
    async changeTask(type) {
      const url = '/api/update_task/'
      // 完成或取消完成日期
      if (type === 'completed') {
        const data = {completed: !this.currentTaskData.completed, task_id: this.currentTaskData.id}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.completed = !this.currentTaskData.completed
        })
      } else if (type === 'section') {
        // 更改section
        const data = {section_id: this.sectionSelect.id, task_id: this.currentTaskData.id}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.section = this.sectionSelect.id
        })
      } else if (type === 'date') {
        // 更新日期
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
        // 更新title
        const data = {task_id: this.currentTaskData.id, title: this.taskTitle}
        await apiHttpClient.post(url, data).then(() => {
          this.currentTaskData.title = this.taskTitle
        })
      }
      // 更新日期格式
      this.currentTaskData = await formatTaskData()(this.currentTaskData)
      await this.$emit('updateTask', this.currentTaskData)
    },
    // 添加project
    showAdd() {
      this.searchWords = null
      this.showAddInput = true
      this.currentProjectList = this.projectList
      this.$nextTick(() => {
        this.$refs.projectInput.$refs.input.focus()
      })
    },
    // project搜索
    search() {
      setTimeout(() => {
        if (this.searchWords !== null) {
          this.currentProjectList = this.projectList.filter(item => item.name.toLowerCase().includes(this.searchWords.toLowerCase()))
        }
      }, 40)

    },
    // project 键盘操作
    keySelectProject() {
      if (event.keyCode) {
        switch (event.keyCode) {
            // 跳转到project选择
          case 9: // Tab键
          case 13: // Enter键
            if (this.currentProjectList.length !== 0) {
              this.addProject()
            } else {
              this.createProject()
            }

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
      setTimeout(() => {
        this.showAddInput = false
      }, 100)
    },
    // 添加project
    async addProject() {
      const url = '/api/update_task/'
      const project_id = this.currentProjectList[this.projectSelectIndex].id
      const data = {task_id: this.currentTaskData.id, project_id: [project_id]}
      apiHttpClient.post(url, data).then(() => {
        this.currentTaskData.project.push(this.currentProjectList[this.projectSelectIndex])
        this.showAddInput = false
      })
      // 获取刚添加的project的category
      const categoryTemp = await this.getCategory(project_id, 'single')
      this.categoryList[project_id] = categoryTemp
      this.oldCategorySelect[project_id] = this.categorySelect[project_id] = categoryTemp[0]
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
    // 获取section
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
    // 获取getCategory
    async getCategory(id, type) {
      const url = "/api/get_category/"
      let data;
      if (type === 'many') {
        data = {project_id: id, 'many': true}
      } else {
        data = {project_id: id}
      }
      let List;
      await apiHttpClient.post(url, data).then((response) => {
        List = response.data.results
        for (let index in List) {
          if (type === 'many') {
            for (let i in List[index]) {
              List[index][i].value = List[index][i].id
            }
          } else {
            List[index].value = List[index].id
          }
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
  height: 100%;
  max-width: 57rem;
  min-width: 30rem;
  width: 100%;
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
  font-size: .75rem;
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
  margin: 0 .25rem;
  cursor: pointer;
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
  font-size: .75rem;
}

.public-right {
  padding: 0 .5rem;
  transition: background-color .3s;
  border-radius: .3rem;
  font-size: .75rem;
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
  margin-top: .5rem;
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

.pop-item {
  display: flex;
}

.pop-item span{
  font-size: .875rem;
  margin-left: .5rem;
}
</style>