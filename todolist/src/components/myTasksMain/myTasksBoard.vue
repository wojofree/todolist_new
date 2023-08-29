<template>
  <!--  表头-->
  <div class="main-header">
    <span>Last task completed on Tuesday</span>
    <div class="main-header-right">
      <popover ref="filterPop">
        <template #main>
          <div class="right-button">
            <icon-base box-view="0 0 24 24" height=".75rem" width=".75rem">
              <RingRight/>
            </icon-base>
            <span v-if="this.taskFilter === 'incomplete'">Incomplete tasks</span>
            <span v-else-if="this.taskFilter === 'all'">All tasks</span>
            <span v-else>Completed tasks</span>
          </div>
        </template>
        <template #pop>
          <div class="pop-main">
            <div class="pop-item" @click="this.taskFilter = 'incomplete'">
              <icon-base :class="{'vsb-hidden':this.taskFilter !== 'incomplete'}" box-view="0 0 32 32" height=".75rem"
                         width=".75rem">
                <right/>
              </icon-base>
              <span>Incomplete tasks</span>
            </div>
            <popover direction="flex-start" hover-control pop-position="side" @clickClose="handleClosePop('filter')">
              <template #main>
                <div class="pop-item" @click="handleClosePop('allCompletedTasks')">
                  <icon-base :class="{'vsb-hidden':this.taskFilter !== 'allCompleted'}" box-view="0 0 32 32"
                             height=".75rem"
                             width=".75rem">
                    <right/>
                  </icon-base>
                  <span>Completed tasks</span>
                  <icon-base box-view="0 0 24 24" height="1rem" style="transform: rotate(-90deg); margin-left: 2rem;"
                             width="1rem">
                    <Arrow/>
                  </icon-base>
                </div>
              </template>
              <template #pop>
                <div class="pop-main">
                  <div class="pop-item" @click="this.taskFilter = 'allCompleted'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== 'allCompleted'}" box-view="0 0 32 32"
                               height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>All completed tasks</span>
                  </div>
                  <div class="pop-span">
                    <span>Marked complete since:</span>
                  </div>
                  <div class="pop-item" @click="this.taskFilter = 'today'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== 'today'}" box-view="0 0 32 32" height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>Today</span>
                  </div>
                  <div class="pop-item" @click="this.taskFilter = 'yesterday'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== 'yesterday'}" box-view="0 0 32 32"
                               height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>Yesterday</span>
                  </div>
                  <div class="pop-item" @click="this.taskFilter = '1weeks'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== '1weeks'}" box-view="0 0 32 32" height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>1 weeks</span>
                  </div>
                  <div class="pop-item" @click="this.taskFilter = '2weeks'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== '2weeks'}" box-view="0 0 32 32" height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>2 weeks</span>
                  </div>
                  <div class="pop-item" @click="this.taskFilter = '3weeks'">
                    <icon-base :class="{'vsb-hidden':this.taskFilter !== '3weeks'}" box-view="0 0 32 32" height=".75rem"
                               width=".75rem">
                      <right/>
                    </icon-base>
                    <span>3 weeks</span>
                  </div>
                </div>
              </template>
            </popover>
            <div class="pop-item" @click="this.taskFilter = 'all'">
              <icon-base :class="{'vsb-hidden':this.taskFilter !== 'all'}" box-view="0 0 32 32" height=".75rem"
                         width=".75rem">
                <right/>
              </icon-base>
              <span>All tasks</span>
            </div>
          </div>
        </template>
      </popover>
      <newSelectBar v-model="this.sortSelect" :options="this.sortList" class="height-175" flex-end="flex-end">
        <div class="right-button">
          <icon-base box-view="0 0 24 24" height=".75rem" width=".75rem">
            <SortMiniIcon/>
          </icon-base>
          <span v-if="this.sortSelect.value !== 'none'">Sort: {{ this.sortSelect.name }}</span>
          <span v-else>Sort</span>
        </div>
      </newSelectBar>
    </div>
  </div>
  <!--  内容区-->
  <div class="section-swap">
    <draggable v-model="this.sectionListTemp" class="home-card" v-bind="dragOptions" @change="this.handleSection">
      <transition-group type="transition">
        <div v-for="(section, index) in this.sectionListTemp" :key="section.id" class="list-card">
          <!--          表头-->
          <div class="section-header">
            <new-input v-show="this.sectionActive === section.id" :ref="'section'+section.id"
                       v-model="this.activeSectionName" class="title-input" weight="700"
                       @blur="updateSection(section)" @keydown="watchKey(section,index, $event)"></new-input>
            <span v-show="this.sectionActive !== section.id" class="text-overflow" @click="activeSection(section)">{{
                section.name
              }}</span>
            <div class="section-header-right">
              <!--              新增task-->
              <tool-tip class="plus-icon" content="Add task">
                <div class="section-header-icon cursor" @click="this.showAddTask(section,'top')">
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
                            <icon-base style="transform: rotate(-90deg); margin-left: 2rem;">
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
          <!--          tasks列表-->
          <div :class="{'grayBackgroundColor': sectionLength(section.id)['incomplete'] === 0}" class="task-list">
            <!--                add task按钮-->
            <div v-if="sectionLength(section.id)['incomplete'] === 0" class="add-task"
                 @click="showAddTask(section,'bottom')">
              <icon-base box-view="0 0 24 24" class="add-color" height=".625rem"
                         width=".625rem">
                <Plus/>
              </icon-base>
              <span>Add task</span>
            </div>
            <draggable v-model="this.sectionTaskList[section.id]"
                       :class="{'height-50':sectionLength(section.id)['incomplete'] === 0}" class="draggable-group"
                       v-bind="taskDragOptions"
                       :sort="this.sortSelect.value === 'none'"
                       @change="this.handleTask(section.id,$event)">
                <!--                task列表-->
                <div v-for="(task,innerIndex) in this.sectionTaskList[section.id]" :key="innerIndex"
                     :ref="'task'+task.id"
                     :class="{ 'fade-enter-active': this.addTaskConfirm === true && task.id === 'new' && task.title === '', 'height-0':task.id === 'new'&& task.title === ''}"
                     class="task-card" @mouseenter="this.showMore = task.id"
                     @mouseleave="this.showMore = false">
                  <div v-if="task.project.length !== 0" class="task-project">
                    <div v-for="project in task.project" :style="{backgroundColor:project.color}"
                         class="project-color">
                    </div>
                  </div>
                  <div class="task-title">
                    <div class="task-complete" @click="this.completeTask(task.id,section.id,innerIndex)">
                      <icon-base box-view="0 0 24 24" height="1rem" width="1rem">
                        <ring-right/>
                      </icon-base>
                    </div>
                    <div :class="{'vsb-hidden':task.id === 'new' || this.currentEditTask.id === task.id}"
                         class="task-title-div">{{ task.title }}
                    </div>
                    <textarea :ref="'textarea'+task.id" v-model="this.addTaskName"
                              :class="{'vsb-hidden':task.id !== 'new' && this.currentEditTask.id !== task.id}"
                              class="add-task-input" placeholder="Write a task name"
                              @keydown="this.titleInput($event)" @keyup="this.changeHeight()"></textarea>
                  </div>
                  <div class="task-bottom">
                    <div v-if="this.addTaskConfirm || task.id !== 'new'" class="task-calendar">
                      <date-pick v-model="this.dateValue" :type="this.dateType" class="width-5" show-icon
                                 startPosition="flex_end" @show="updateDate">
                        <div class="task-complete-date" @click="confirmDate(task)">
                          <div v-if="task.complete_date !== ''" class="complete-date cursor">
                        <span :class="{'green':task.complete_date.endsWith('Today'),'green1':task.complete_date.endsWith('Tomorrow'),
                      'overdue':!this.compareTime(task.complete_time)}">{{
                            task.complete_date
                          }}</span>
                          </div>
                          <tool-tip v-if="task.complete_date === ''"
                                    :class="{'vsb-hidden':this.showMore !== task.id && task.id !=='new'}"
                                    class="height-28" content="Add due date">
                            <div class="calendar cursor">
                              <IconBase box-view="0 0 24 24" height=".75rem" width=".75rem">
                                <Calendar/>
                              </IconBase>
                            </div>
                          </tool-tip>
                        </div>
                      </date-pick>
                    </div>
                    <tool-tip v-if="this.showMore === task.id && task.id !== 'new'" class="task-like"
                              content="Like this">
                      <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                        <Like/>
                      </icon-base>
                    </tool-tip>
                  </div>
                  <!--                    更多按钮-->
                  <tool-tip v-if="this.showMore === task.id && this.currentTask.id !== task.id"
                            class="more-action-position"
                            content="More actions"
                            @click="this.showTaskMoreAction(task,section,innerIndex)">
                    <div class="task-more cursor">
                      <div class="more-icon">
                        <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                          <More/>
                        </icon-base>
                      </div>
                    </div>
                  </tool-tip>
                </div>
              </transition-group>
            </draggable>
            <!--            新增task-->
            <div v-if="sectionLength(section.id)['incomplete'] !== 0" class="add-task"
                 @click="showAddTask(section,'bottom')">
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
                   weight="700" @blur="updateSection('addSection')"
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
        <div class="delete-option">
          <span>This section&nbsp </span>
          <span class="delete-section-name">{{ this.currentSection.name }}</span>
          <span>&nbsp includes {{ this.currentSection.completed }} completed tasks and {{
              this.currentSection.incomplete
            }} incomplete tasks.</span>
        </div>
        <div class="delete-option option-item cursor" @click="this.deleteType = 'keep'">
          <div v-if="this.deleteType !== 'keep'" class="radio-custom-uncheck">
          </div>
          <div v-if="this.deleteType === 'keep'" class="radio-custom">
            <div class="radio-custom-inner"></div>
          </div>
          <span>Delete this section and keep these {{ this.currentSection.all }} tasks</span>
        </div>
        <div class="delete-option option-item cursor" @click="this.deleteType = 'delete'">
          <div v-if="this.deleteType === 'keep'" class="radio-custom-uncheck">
          </div>
          <div v-if="this.deleteType !== 'keep'" class="radio-custom">
            <div class="radio-custom-inner"></div>
          </div>
          <span>Delete this section and delete these {{ this.currentSection.all }} tasks</span>
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
  <!--  task more action菜单-->
  <popover ref="taskMorePop" class="more-action" direction="flex-start" @close="handleClosePop('task')">
    <template #main>
      <!--      <div style="width: 42px;height: 42px"></div>-->
      <tool-tip content="More actions">
        <div class="task-more cursor">
          <div class="more-icon">
            <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
              <More/>
            </icon-base>
          </div>
        </div>
      </tool-tip>
    </template>
    <template #pop>
      <div class="pop-main">
        <div class="pop-item" @click="this.editTask()">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Pencil/>
          </icon-base>
          <span>Edit task name</span>
        </div>
        <popover direction="flex-start" hover-control pop-position="side">
          <template #main>
            <div class="pop-item">
              <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
                <Image/>
              </icon-base>
              <span>Add cover image</span>
              <icon-base style="transform: rotate(-90deg); margin-left: 2rem;">
                <Arrow/>
              </icon-base>
            </div>
          </template>
          <template #pop>
            <div class="pop-main">
              <div class="pop-item">
                <span>Your Computer</span>
              </div>
              <div class="pop-item">
                <span>Dropbox</span>
              </div>
              <div class="pop-item">
                <span>Google Drive</span>
              </div>
              <div class="pop-item">
                <span>Box</span>
              </div>
              <div class="pop-item">
                <span>OneDrive/SharePoint</span>
              </div>
            </div>
          </template>
        </popover>
        <div class="separate"></div>
        <div class="pop-item"
             @click="this.completeTask(this.currentTask.id, this.currentSection.id, this.currentSection.innerIndex)">
          <icon-base box-view="0 0 23 23" height="1rem" width="1rem">
            <RingRight/>
          </icon-base>
          <span>Mark complete</span>
        </div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <View/>
          </icon-base>
          <span>View details</span>
        </div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Open/>
          </icon-base>
          <span>Open in new tab</span>
        </div>
        <div class="separate"></div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Duplicate/>
          </icon-base>
          <span>Duplicate task</span>
        </div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Link/>
          </icon-base>
          <span>Copy task link</span>
        </div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <FollowUp/>
          </icon-base>
          <span>Create follow-up task</span>
        </div>
        <div class="separate"></div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Milestone/>
          </icon-base>
          <span>Mark as milestone</span>
        </div>
        <div class="pop-item">
          <icon-base box-view="0 0 32 32" class="pending-icon" height="1rem" width="1rem">
            <Pending/>
          </icon-base>
          <span>Mark as approval</span>
        </div>
        <div class="separate"></div>
        <div class="pop-item red-color"
             @click="this.deleteTask(this.currentTask.id, this.currentSection.id, this.currentSection.innerIndex)">
          <icon-base box-view="0 0 32 32" height="1rem" width="1rem">
            <Trash/>
          </icon-base>
          <span class="red-color">Delete task</span>
        </div>
      </div>
    </template>
  </popover>
</template>

<script setup>
import {
  Like,
  FollowUp,
  Duplicate,
  Open,
  View,
  Image,
  Link,
  Milestone,
  Pending,
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
import Right from "@/components/icons/Right";
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
      addTaskConfirm: false,
      showAddTaskSectionID: '',
      addTaskName: '',
      addCardHeight: '0',
      firstClick: false,
      dateValue: '',
      dateType: 'date',
      addCompletedDate: '',
      sortList: [
        {'value': 'none', "name": 'None'},
        {'value': 'startDate', "name": 'Start date'},
        {'value': 'dueDate', "name": 'Due date'},
        {'value': 'createBy', "name": 'Create by'},
        {'value': 'createOn', "name": 'Create on'},
        {'value': 'modified', "name": 'Last modified on'},
        {'value': 'likes', "name": 'Likes'},
        {'value': 'alphabetical', "name": 'Alphabetical'},
      ],
      sortSelect: '',
      taskFilter: 'incomplete',
      sectionListTemp: [],
      currentTask: '',
      taskChange: false,
      moreActionPosition: {top: '-100px', left: '-100px'},
      showMore: false,
      orgDateValue: '',
      addType: '',
      currentEditTask: {id: ''}
    }
  },
  mounted() {
    this.sectionTaskList = formatTasksList(this.tasksList, this.sectionList, 'incomplete')
    this.sectionListTemp = this.sectionList
    this.firstSection = this.sectionList[0].id
  },
  props: {
    tasksList: {
      type: [String, Object, Array],
      default: ""
    },
    sectionList: {
      type: [String, Object, Array],
      default: ""
    },
  },
  watch: {
    tasksList(newVal) {
      this.sectionTaskList = formatTasksList(newVal, this.sectionList, 'incomplete')
    },
    sectionList(newVal) {
      this.sectionListTemp = newVal
    },
    dateValue(newVal) {
      let task;
      let start_time = null;
      let complete_time = null;
      if (newVal === null) {
        task = {start_time: null, complete_time: null}
      } else if (typeof newVal === 'string') {
        task = {start_time: null, complete_time: newVal}
        complete_time = newVal
      } else {
        task = {start_time: newVal[0], complete_time: newVal[1]}
        complete_time = newVal[1]
        start_time = newVal[0]
      }
      task = formatTaskData()(task)
      this.currentTask.complete_date = task.complete_date
      this.currentTask.complete_time = complete_time
      this.currentTask.start_time = start_time
    },
    addTaskConfirm(newVal) {
      newVal ? document.addEventListener("click", this.handleAddTask) : document.removeEventListener("click", this.handleAddTask);
    },
    taskFilter(newVal) {
      console.log(newVal)
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
    // 修改任务名
    editTask() {
      this.currentTask['orgTitle'] = this.addTaskName = this.currentTask.title
      this.firstClick = this.addTaskConfirm = true
      this.currentEditTask = this.currentTask
      this.$nextTick(() => {
        this.$refs[`textarea${this.currentEditTask.id}`][0].select()
      })
    },
    // 修改task title
    editTaskConfirm() {
      let url = '/api/update_task/'
      let data = {task_id: this.currentTask.id, title: this.addTaskName}
      this.currentTask.orgTitle !== this.currentTask.title ? apiHttpClient.post(url, data) : null;
      this.currentTask = ''
      this.currentEditTask = {id: ''}
      this.addTaskConfirm = this.firstClick = false
      this.addTaskName = ''
    },
    // 鼠标监听
    handleAddTask(e) {
      let div = this.$refs[`task${this.currentTask.id}`]
      if (div && !div[0].contains(e.target) && this.firstClick) {
        this.currentTask.id === 'new' ? this.closeAddTask() : this.editTaskConfirm();
      }
    },
    // 打开新建任务 card
    showAddTask(section, type) {
      this.currentTask = {id: 'new'}
      let blankTask = {id: 'new', title: '', project: [], complete_time: null, start_time: null, complete_date: ""}
      if (!this.addTaskConfirm) {
        this.addType = type
        this.sectionTaskList[section.id][type === 'top' ? 'unshift' : 'push'](blankTask);
        this.showAddTaskSectionID = section.id
        setTimeout(() => {
          this.addTaskConfirm = true
          this.firstClick = true
        }, 1);
      } else if (this.addTaskConfirm && type === 'top') {
        this.addTaskConfirm = false
        setTimeout(() => {
          this.addTaskConfirm = true
        }, 200)
      } else {
        setTimeout(() => {
          this.addTaskConfirm = false
        }, 40)
      }
      this.$nextTick(() => {
        this.$refs['textareanew'][0].focus()
      })
    },
    // 新建任务
    async addTask() {
      let url = '/api/create_task/'
      let data;
      let sectionId = this.showAddTaskSectionID
      let taskName = this.addTaskName
      let date = this.dateValue
      let task;
      if (date === null || date === '') {
        data = {title: taskName, section_id: sectionId}
      } else if (typeof date === 'string') {
        data = {title: taskName, complete_time: this.dateValue, section_id: sectionId}
      } else {
        data = {
          title: taskName,
          complete_time: date[1],
          start_time: date[0],
          section_id: sectionId
        }
      }
      await apiHttpClient.post(url, data).then((res) => {
        task = formatTaskData()(res.data.results)
      })
      this.addTaskName = ''
      this.dateValue = ''
      this.dateType = 'date'
      return task
    },
    // 关闭task card
    async closeAddTask() {
      this.firstClick = false
      let arrIndex = this.addType === 'top' ? 0 : this.sectionTaskList[this.showAddTaskSectionID].length - 1
      if (this.addTaskName !== '') {
        let res = await this.addTask()
        this.sectionTaskList[this.showAddTaskSectionID][arrIndex].id = res.id
        this.sectionTaskList[this.showAddTaskSectionID][arrIndex].complete_date = res.complete_date
        this.addTaskConfirm = false
        this.showAddTaskSectionID = ''
        this.addType = ''
      } else {
        this.addTaskConfirm = false
        this.addType = ''
        setTimeout(() => {
          this.sectionTaskList[this.showAddTaskSectionID].splice(arrIndex, 1)
        }, 100)
      }
    },
    // 改变高度
    changeHeight() {
      if (this.currentTask.id === 'new') {
        let arrIndex = this.addType === 'top' ? 0 : this.sectionTaskList[this.showAddTaskSectionID].length - 1
        this.sectionTaskList[this.showAddTaskSectionID][arrIndex].title = this.addTaskName
      } else {
        this.currentTask.title = this.addTaskName
      }
      this.addCardHeight = this.$refs[`task${this.currentTask.id}`][0].offsetHeight + 48 + 'px'
    },
    // 输入框改变高度
    titleInput(event) {
      if ((event.key === 'Enter' || event.key === 'Tab') && !event.isComposing) {
        event.stopPropagation()
        event.preventDefault()
        this.currentTask.id === 'new' ? this.closeAddTask() : this.editTaskConfirm();
      }
    },
    // task more 按钮定位
    showTaskMoreAction(task, section, innerIndex) {
      const taskDIV = this.$refs[`task${task.id}`][0]
      const {top, x} = taskDIV.getBoundingClientRect()
      setTimeout(() => {
        this.moreActionPosition['top'] = top + 10 + 'px'
        this.moreActionPosition['left'] = x + 233.5 + 'px'
        this.addTaskConfirm = this.firstClick = false
        this.currentTask = task
        this.currentSection['id'] = section.id
        this.currentSection['innerIndex'] = innerIndex
      }, 40)

      setTimeout(() => {
        this.$refs.taskMorePop.isPopShow = true
      }, 100)
    },
    // task拖拽调整
    handleTask(sectionID, event) {
      let task;
      if (event.added !== undefined) {
        task = event.added.element
        task.section = sectionID
        let newIndex = event.added.newIndex
        this.changeTask(sectionID, newIndex, task)
      } else if (event.moved !== undefined) {
        task = event.moved.element
        let newIndex = event.moved.newIndex
        this.changeTask(sectionID, newIndex, task)
      }
    },
    // 更新task
    changeTask(sectionID, newIndex, task) {
      let url = '/api/update_task/'
      let frontRank = newIndex === 0 ? null : this.sectionTaskList[sectionID][newIndex - 1]['rank']
      let lastSection = newIndex + 1 === this.sectionTaskList[sectionID].length
      let nextRank = lastSection ? null : this.sectionTaskList[sectionID][newIndex + 1]['rank']
      let newRank = getNewRank(frontRank, nextRank)
      console.log(newRank)
      task.rank = newRank
      apiHttpClient.post(url, {task_id: task.id, section_id: sectionID, rank: newRank})
    },
    // 打开日期选择弹窗
    confirmDate(task) {
      this.dateType = (task.start_time === null) ? "date" : "dateRange";
      this.dateValue = (task.start_time === null) ? task.complete_time : [task.start_time, task.complete_time];
      this.currentTask = task;
      this.orgDateValue = this.dateValue
    },
    // 更新日期
    updateDate(item) {
      if (!item && this.orgDateValue !== this.dateValue) {
        let data = {};
        if (this.dateValue === null || typeof this.dateValue === 'string') {
          data = {complete_time: this.dateValue, start_time: null}
        } else if (typeof this.dateValue === 'object') {
          data = {start_time: this.dateValue[0], complete_time: this.dateValue[1]}
        }
        let url = '/api/update_task/'
        data['task_id'] = this.currentTask.id
        apiHttpClient.post(url, data).then(() => {
          this.currentTask = {id: ''}
        })
      } else {
        this.currentTask = {id: ''}
      }
    },
    // section 排序权重更新
    handleSection(event) {
      let newIndex = event.moved.newIndex
      let section = event.moved.element
      let lastSection = newIndex + 1 === this.sectionListTemp.length
      let frontRank = newIndex === 0 ? null : this.sectionListTemp[newIndex - 1]['rank']
      let nextRank = lastSection ? null : this.sectionListTemp[newIndex + 1]['rank']
      let newRank = getNewRank(frontRank, nextRank)
      let url = '/api/change_section/'
      apiHttpClient.post(url, {section_id: section.id, rank: newRank}).then(() => {
        section['rank'] = newRank
      })
    },
    // section title 输入框激活
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
    // 新增section
    addSection(index, type) {
      let url = '/api/add_section/'
      let data = {'name': 'Untitled Section'}
      apiHttpClient.post(url, data).then((res) => {
        let num = type === 'left' ? index : index + 1
        this.sectionListTemp.splice(num, 0, res.data.results)
        this.sectionTaskList[res.data.results.id] = []
        this.activeSection(res.data.results)
      })
    },
    //  section input按键监控
    watchKey(section, index, event) {
      if (event.key === 'Enter' && !event.isComposing) {
        event.stopPropagation()
        event.preventDefault()
        this.updateSection(section, index)
      }
    },
    // 提交section更新
    updateSection(section) {
      if (this.activeSectionName !== section.name && section !== 'addSection') {
        let url = 'api/change_section/'
        let data = {'section_id': section.id, 'name': this.activeSectionName}
        apiHttpClient.post(url, data).then((res) => {
          section.name = res.data.results.name
        })
      } else if (section === 'addSection' && this.activeSectionName !== '') {
        let url = 'api/add_section/'
        let data = {'name': this.activeSectionName}
        apiHttpClient.post(url, data).then((res) => {
          this.sectionListTemp.push(res.data.results)
          this.sectionTaskList[res.data.results.id] = []
        })
      }
      this.sectionActive = ''
      this.activeSectionName = ''
    },
    // 完成任务
    completeTask(taskID, sectionID, index) {
      let url = '/api/update_task/'
      apiHttpClient.post(url, {'task_id': taskID, 'completed': true}).then(() => {
        this.sectionTaskList[sectionID].splice(index, 1)
      })
    },
    // 删除任务
    deleteTask(taskID, sectionID, index) {
      let url = '/api/delete_tasks/'
      apiHttpClient.post(url, {'task_id': taskID}).then(() => {
        this.sectionTaskList[sectionID].splice(index, 1)
      })
    },
    // 各菜单栏关闭动作
    handleClosePop(sectionID) {
      switch (sectionID) {
        case 'filter':
          this.$refs.filterPop.isPopShow = false;
          break;
        case 'allCompletedTasks':
          this.$refs.filterPop.isPopShow = false;
          this.taskFilter = 'allCompleted';
          break;
        case 'task':
          this.showMore = false
          this.moreActionPosition = {top: '-100px', left: '-100px'}
          if (!this.addTaskConfirm) {
            this.currentTask = ''
            this.currentEditTask = {id: ''}
            this.addTaskName = ''
          }
          break;
        default:
          this.$refs[`headerPopOver${sectionID}`][0].isPopShow = false;
          break;
      }
    },
    // 时间比较，变色用
    compareTime(time) {
      const now = new Date();
      const completeTime = new Date(time);
      return completeTime - now >= 0;
    },
    // section task数量
    sectionLength(sectionID) {
      const section = this.sectionTaskList[sectionID];
      let completedList = formatTasksList(this.tasksList, this.sectionListTemp, 'completed')
      let taskLength = {};
      taskLength['incomplete'] = section ? section.length : 0;
      taskLength['completed'] = completedList[sectionID] ? completedList[sectionID].length : 0;
      taskLength['all'] = taskLength['incomplete'] + taskLength['completed']
      return taskLength
    },
    // 删除section
    deleteSection(sectionID, index, type) {
      let url = 'api/delete_section/'
      let data = {'section_id': sectionID, 'delete_type': type}
      apiHttpClient.post(url, data).then(() => {
        this.sectionListTemp.splice(index, 1)
        this.showDeleteMessage = false
        type === 'keep' ? this.sectionTaskList[this.firstSection].unshift(...this.sectionTaskList[sectionID]) : null
      })
    },
    // 删除section选择框
    deleteSelect(sectionID, index) {
      let taskLength = this.sectionLength(sectionID)
      if (taskLength['all'] === 0) {
        this.deleteSection(sectionID, index, 'delete')
      } else {
        this.showDeleteMessage = true
        this.currentSection['name'] = this.sectionListTemp[index].name
        this.currentSection['id'] = sectionID
        this.currentSection['index'] = index
        this.currentSection['incomplete'] = taskLength['incomplete']
        this.currentSection['completed'] = taskLength['completed']
        this.currentSection['all'] = taskLength['all']
      }
    }
  }
}

// task 排序
function taskListSort() {



}

// 新权重计算
function getNewRank(frontRank, nextRank) {
  let newRank;
  if (frontRank !== null && nextRank !== null) {
    newRank = parseFloat(((frontRank + nextRank) / 2).toFixed(3))
  } else if (frontRank === null && nextRank === null) {
    newRank = 1
  } else if (frontRank === null) {
    newRank = parseFloat((nextRank - 0.1).toFixed(3))
  } else if (nextRank === null) {
    newRank = parseFloat((frontRank + 1).toFixed(3))
  }
  return newRank
}

// 修改tasksList格式
function formatTasksList(tasksList, sectionList, type) {
  const newTasksList = {};
  const completedTaskList = {};
  for (let section of sectionList) {
    newTasksList[section.id] = tasksList.filter(task => task.section === section.id && task.completed !== true && type === 'incomplete');
    completedTaskList[section.id] = tasksList.filter(task => task.section === section.id && task.completed === true && type === 'completed');
  }
  return type === 'incomplete' ? newTasksList : completedTaskList;
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
  height: 3rem;
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
  padding: 0 .75rem;
}

.list-card {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 19rem;
  border-radius: .375rem;
  height: 100%;
  transition: border .3s;
  position: relative;
  background-color: white;
  margin-right: 2px;
}

.list-card-noHover {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 19rem;
  padding: 0 .75rem;
  border-radius: .375rem;
  height: 100%;
  transition: border .3s;
  position: relative;
}

.list-card:hover {
  box-shadow: 0 0 0 1px #edeae9, 0 1px 4px 0 rgba(109, 110, 111, 0.08);
}

.height-175 {
  height: 1.75rem;
  /*width: 4.0625rem;*/
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
  margin-top: .25rem;
  position: relative;
  padding: 0 .75rem;
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
  border-radius: .3rem;
  display: flex;
  align-items: center;
  width: 1.75rem;
  height: 1.75rem;
  justify-content: center;
  transition: color .3s, background-color .3s;
}

.section-header-icon:hover {
  color: var(--black);
  background-color: #F9F8F8;
}

.plus-icon {
  margin-right: .25rem;
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
  transition: height .15s ease, border .3s;
  /*padding-bottom: 1rem;*/
  position: relative;
}

.more-action {
  position: absolute;
  top: v-bind(moreActionPosition ['top']);
  left: v-bind(moreActionPosition ['left']);
}

.task-card:hover {
  border: 1px solid #6D6E6F;
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
  padding: 0 1rem 0 1rem;
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
  margin: auto;
  height: 100%;
  width: 92%;
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
  margin: 1rem 0;
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
  /*width: 11.5rem;*/
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
  width: 100%;
  text-align: left;
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
  text-align: left;
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

.task-title-div {
  word-break: break-word;
  text-indent: 1.5rem;
  min-height: 1.35rem;
  text-align: left;
}


.vsb-hidden {
  visibility: hidden;
}

.add-task-input:focus {
  border: none;
  outline: none;
}

.date-due span {
  word-break: keep-all;
}

.width-5 {
  width: 10rem !important;
}

.task-bottom {
  padding-bottom: 1rem;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 1.1rem;
}

.pop-span {
  padding: .5rem .75rem .25rem 2.25rem;
  font-size: .75rem;
  font-weight: 600;
}

.complete-date {
  padding: .25rem;
  border-radius: .3rem;
  transition: background-color .3s;
  text-align: left;
  width: max-content;
}

.complete-date:hover {
  background-color: #F9F8F8;
}

.delete-section-name {
  font-weight: 600;
}

.option-item span {
  margin-left: .5rem;
}

.task-more {
  background-color: white;
  padding: .3rem;
  border-radius: .6rem;
  border: 1px solid #ECE9E8;
}

.more-icon {
  border-radius: .3rem;
  padding: .3rem;
  transition: background-color .3s;
}

.more-icon:hover {
  background-color: #F9F8F8;
}

.red-color {
  fill: #DD5E72;
  color: #DD5E72 !important;
}

.red-color:hover {
  fill: #AA3E53;
  color: #AA3E53 !important;
}

.pending-icon {
  border: 1px solid var(--black);
  border-radius: .3rem;
}

.separate {
  border-bottom: 1px solid #ECE9E8;
  margin: .25rem 0;
}

.more-action-position {
  position: absolute;
  top: 9px;
  right: 8.5px;
}

.fade-enter-active {
  height: 89.59px !important;
}

.height-0 {
  height: 0;
}

.height-28 {
  height: 1.625rem;
}

.v-leave-active.v-leave-to {
  opacity: 0;
  display: none;
  visibility: hidden;
}

.height-50 {
  height: 50%;
}

.task-calendar {
  flex: auto;
}

.task-like {
  cursor: pointer;
  padding: .2rem;
  border-radius: .3rem;
  color: var(--gray);
  fill: var(--gray);
  transition: background-color .3s, fill .3s, color .3s;
}

.task-like:hover {
  background-color: #F9F8F8;
  color: var(--black);
  fill: var(--black);

}
</style>