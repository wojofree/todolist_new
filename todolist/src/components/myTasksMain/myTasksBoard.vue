<template>
  <!--  表头-->
  <div class="main-header" :class="{'padding-right-437':this.isOpenTaskDrawer}">
    <span>Last task completed on {{ this.lastCompletedDate }}</span>
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
  <div class="section-swap" :class="{'padding-right-437':this.isOpenTaskDrawer}" ref='sectionSwap'>
    <draggable v-model="this.sectionListTemp" class="home-card" v-bind="dragOptions" @change="this.handleSection">
      <transition-group type="transition">
        <div v-for="(section, index) in this.sectionListTemp" :key="section.id" :ref="'section'+section.id"
             class="list-card"
             @mouseover="this.sectionHover = section.id"
        >
          <!--          表头-->
          <div class="section-header">
            <new-input v-show="this.sectionActive === section.id" :ref="'sectionInput'+section.id"
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
                      <div v-if="section.id === this.firstSection" class="pop-item trash-icon">
                        <tool-tip content="This section can't be deleted because new tasks assigned to you appear here">
                          <div class="trash-icon">
                            <icon-base box-view="0 0 32 32" height="1rem" icon-color="#AFABAC" width="1rem">
                              <Trash/>
                            </icon-base>
                            <span style="color: #AFABAC;">Delete section</span>
                          </div>
                        </tool-tip>
                      </div>
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
          <div :class="{'grayBackgroundColor': sectionLength(section.id)['current'] === 0}" class="task-list">
            <!--                add task按钮-->
            <div v-if="sectionLength(section.id)['current'] === 0" class="add-task"
                 @click="showAddTask(section,'bottom')">
              <icon-base box-view="0 0 24 24" class="add-color" height=".625rem"
                         width=".625rem">
                <Plus/>
              </icon-base>
              <span>Add task</span>
            </div>
            <draggable v-model="this.sectionTaskList[section.id]"
                       :class="{'height-50':sectionLength(section.id)['current'] === 0}"
                       :sort="this.sortSelect.value === 'none'"
                       class="draggable-group"
                       v-bind="taskDragOptions"
                       @change="this.handleTask(section.id,$event)" @end="this.dragEnd" @start="this.dragStart">
              <!--                task列表-->
              <div v-for="(task,innerIndex) in this.sectionTaskList[section.id]" :key="innerIndex"
                   :ref="'task'+task.id"
                   :class="{ 'fade-enter-active': this.addTaskConfirm === true && task.id === 'new' && task.title === '',
                   'border-black':this.currentEditTask.id === task.id,
                   'detail-card':this.detailTask.id === task.id && this.isOpenTaskDrawer,
                   'height-0':task.id === 'new'&& task.title === ''}"
                   class="task-card cursor" @click="this.openDrawer(task)"
                   @mouseenter="this.showMore = task.id"
                   @mouseleave="this.showMore = false"
              >
                <div v-if="task.project.length !== 0" class="task-project">
                  <tool-tip v-for="project in task.project" :content="project.name">
                    <div :style="{backgroundColor:project.color}" class="project-color">
                    </div>
                  </tool-tip>
                </div>
                <div class="task-title">
                  <div :class="{'completed':task.completed,'task-complete':!task.completed}"
                       @click="this.completeTask(task,section.id,innerIndex)">
                    <icon-base box-view="0 0 30 30" height=".5rem" width=".5rem">
                      <right/>
                    </icon-base>
                  </div>
                  <div :class="{'vsb-hidden':task.id === 'new' || this.currentEditTask.id === task.id}"
                       class="task-title-div">{{ task.title }}
                  </div>
                  <textarea :ref="'textarea'+task.id" v-model="this.addTaskName"
                            :class="{'vsb-hidden':task.id !== 'new' && this.currentEditTask.id !== task.id}"
                            class="add-task-input" placeholder="Write a task name"
                            @click="this.stopPropagation" @keydown="this.titleInput($event)"
                            @keyup="this.changeHeight()"></textarea>
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
              <div
                  v-if="this.startDrag !== false && this.sectionHover === section.id && this.sortSelect.value !== 'none' && this.sectionTaskList[section.id].length === 0"></div>
            </draggable>
            <!--            新增task-->
            <div v-if="sectionLength(section.id)['current'] !== 0" class="add-task"
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
    <div
        v-if="this.startDrag !== false && this.sectionHover !== false && this.startDrag !== this.sectionHover && this.sortSelect.value !== 'none'"
        class="list-card drag-hover" @mouseleave="this.sectionHover = false">
      <span class="drag-hover-title">Drop here to move to this column</span>
      <span>This board is sorted by {{ this.sortSelect.name }}</span>
    </div>
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
        <div class="task-more cursor" @click="handleClosePop('task')">
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
             @click="this.completeTask(this.currentTask, this.currentSection.id, this.currentSection.innerIndex)">
          <icon-base box-view="0 0 23 23" height="1rem" width="1rem">
            <RingRight/>
          </icon-base>
          <span v-if="this.currentTask.completed === false">Mark complete</span>
          <span v-if="this.currentTask.completed === true">Mark incomplete</span>
        </div>
        <div class="pop-item" @click="this.viewTaskDetail">
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
  <drawer ref="taskDetail" v-model="this.isOpenTaskDrawer" direction="rtl" width="43.75rem">
    <edit-task :project-list="this.projectList" :task-data="this.detailTask"
               @close="this.isOpenTaskDrawer = false" @updateTask="this.updateTask"></edit-task>
  </drawer>
</template>
<script setup>
import {
  Right,
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
import Drawer from "@/components/common/Drawer";
import EditTask from "@/components/homeCard/messageBox/editTask";
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
      isOpenTaskDrawer: false,
      sectionHover: false,
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
      currentEditTask: {id: ''},
      completedList: '',
      startDrag: false,
      dragHoverPosition: ['0', '0'],
      ghostClass: 'ghost-class',
      lastCompletedDate: '',
      detailTask: {id: '', assigned_to: {username: ''}, project: {color: '', name: '', id: ''}},
      incompleteList: '',
      taskIndex:''
    }
  },
  mounted() {
    this.sectionTaskList = formatTasksList(this.tasksList, this.sectionList, 'incomplete')
    this.completedList = formatTasksList(this.tasksList, this.sectionList, 'allCompleted')
    this.incompleteList = formatTasksList(this.tasksList, this.sectionList, 'incomplete')
    this.sectionTaskList = taskListSort({value: 'none'}, this.sectionTaskList)
    this.sectionListTemp = this.sectionList
    let minId = this.sectionList[0].id; // 假设第一个元素的id为最小值
    for (let i = 1; i < this.sectionList.length; i++) {
      if (this.sectionList[i].id < minId) {
        minId = this.sectionList[i].id;
      }
    }
    this.firstSection = minId;
    this.lastCompletedDate = this.tasksList.length === 0 ? '' : getLastCompletedTime(this.tasksList)
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
    projectList: {
      type: [String, Object, Array],
      default: ""
    }
  },
  watch: {
    // 排序规则下，遮罩位置计算
    sectionHover(newVal) {
      if (this.startDrag) {
        let div = this.$refs[`section${newVal}`]
        if (div !== undefined) {
          let {top, left} = div[0].getBoundingClientRect()
          this.dragHoverPosition = [top + 'px', left + 'px']
        }
      }
    },
    taskFilter(newVal) {
      this.sectionTaskList = formatTasksList(this.tasksList, this.sectionList, newVal)
    },
    sortSelect(newVal) {
      if (newVal.value !== 'none') {
        this.ghostClass = 'no-sort'
        this.sectionTaskList = taskListSort(newVal, this.sectionTaskList)
      } else {
        this.sectionTaskList = taskListSort(newVal, this.sectionTaskList)
        this.ghostClass = 'ghost-class'
      }
    },
    async tasksList(newVal) {
      let taskList = formatTasksList(newVal, this.sectionList, 'incomplete')
      this.sectionTaskList = taskListSort({value: 'none'}, taskList)
      this.completedList = formatTasksList(newVal, this.sectionList, 'allCompleted')
      this.incompleteList = formatTasksList(newVal, this.sectionList, 'incomplete')
      this.lastCompletedDate = getLastCompletedTime(newVal)
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
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "section",
        disabled: false,
        forceFallback: true,
        dragClass: "drag-class",
        delay: .1,
        filter: '.un-move'
      };
    },
    taskDragOptions() {
      return {
        animation: 200,
        group: "tasks",
        disabled: false,
        forceFallback: true,
        ghostClass: this.ghostClass,
        dragClass: "drag-class",
        delay: .1,
        filter: '.un-move'
      };
    }
  },
  methods: {
    openDrawer(task) {
      this.detailTask = task;
      this.$refs.taskDetail.isFirstClick = false
      this.isOpenTaskDrawer = true
      setTimeout(() => {
        this.$refs.taskDetail.isFirstClick = true
      }, 20)
      this.currentSection['id'] = task.section
      this.scrollSection(task)
    },
    scrollSection(task){
      const taskDIV = this.$refs[`task${task.id}`][0]
      const main = this.$refs.sectionSwap.getBoundingClientRect()
      const windowWidth = window.innerWidth;
      const {right, left} = taskDIV.getBoundingClientRect()
      const scrollLeft = this.$refs.sectionSwap.scrollLeft
      if (windowWidth-right < 740) {
        this.$nextTick(()=>{
          this.$refs.sectionSwap.scrollLeft = 742 - windowWidth + right + scrollLeft
        })
      } else if (left - main.left <0) {
        this.$refs.sectionSwap.scrollLeft = 742 - windowWidth + right + scrollLeft
      }

    },
    updateTask(item) {
      let taskList = this.sectionTaskList[this.currentSection['id']]
      if (item.type === 'section') {
        for (let index in taskList) {
          if (taskList[index].id === item.task.id) {
            taskList[index] = item.task
            this.sectionTaskList[this.currentSection['id']].splice(index, 1)
            this.sectionTaskList[item.task.section].push(item.task)
            this.sectionTaskList = taskListSort(this.sortSelect, this.sectionTaskList)
            this.currentSection['id'] = item.task.section
          }
        }
      } else if ((item.type === 'completed' && this.taskFilter === 'all') || item.type === 'date' || item.type === 'title') {
        for (let index in taskList) {
          if (taskList[index].id === item.task.id) {
            taskList[index] = item.task
          }
        }
      } else if (item.type === 'completed' && this.taskFilter === 'incomplete' && item.task.completed) {
        for (let index in taskList) {
          if (taskList[index].id === item.task.id) {
            taskList[index] = item.task
            this.sectionTaskList[this.currentSection['id']].splice(index, 1)
            this.incompleteList[this.currentSection['id']].splice(index, 1)
            this.completedList[this.currentSection['id']].unshift(item.task)
            this.taskIndex = index
          }
        }
      } else if (item.type === 'completed' && this.taskFilter === 'incomplete' && !item.task.completed) {
        this.sectionTaskList[this.currentSection['id']].splice(this.taskIndex,0,item.task)
        this.completedList[this.currentSection['id']].splice(0, 1)
        this.incompleteList[this.currentSection['id']].splice(this.taskIndex,0,item.task)
      } else if (item.type === 'completed' && this.taskFilter !== 'incomplete' && this.taskFilter !== 'all' && !item.task.completed) {
        for (let index in taskList) {
          if (taskList[index].id === item.task.id) {
            taskList[index] = item.task
            this.sectionTaskList[this.currentSection['id']].splice(index, 1)
            this.completedList[this.currentSection['id']].splice(index, 1)
            this.incompleteList[this.currentSection['id']].unshift(item.task)
            this.taskIndex = index
          }
        }
      } else if (item.type === 'completed' && this.taskFilter !== 'incomplete' && this.taskFilter !== 'all' && item.task.completed) {
        this.sectionTaskList[this.currentSection['id']].splice(this.taskIndex,0,item.task)
        this.incompleteList[this.currentSection['id']].splice(0, 1)
        this.completedList[this.currentSection['id']].splice(this.taskIndex,0,item.task)
      }
    },
    viewTaskDetail() {
      this.isOpenTaskDrawer = true
      this.detailTask = this.currentTask
      this.scrollSection(this.detailTask)
    },
    // 发起拖拽
    dragStart(event) {
      this.startDrag = event.item._underlying_vm_.section
      this.currentTask = {task: event.item._underlying_vm_}
      this.currentTask['oldIndex'] = event.oldIndex
    },
    // 排序规则下 拖拽位置判断，并重新排序
    async dragEnd() {
      if (this.sectionHover && this.sectionHover !== this.currentTask['task'].section) {
        let url = '/api/update_task/'
        let data = {task_id: this.currentTask['task'].id, section_id: this.sectionHover}
        await apiHttpClient.post(url, data).then((res) => {
          this.currentTask['task'].section = res.data.results.section
          this.currentTask['task'].updated_at = res.data.results.updated_at
          this.sectionTaskList[this.startDrag].splice(this.currentTask['oldIndex'], 1)
          this.sectionTaskList[this.sectionHover].splice(this.currentTask['oldIndex'], 0, this.currentTask['task'])
          this.sectionTaskList = taskListSort(this.sortSelect, this.sectionTaskList)
        })
      }
      this.currentTask = ''
      this.startDrag = false
    },
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
      let rank = this.addType === 'top' ? parseFloat((this.sectionTaskList[sectionId][1].rank - 0.1).toFixed(3)) : parseFloat((this.sectionTaskList[sectionId][this.sectionTaskList[sectionId].length - 2].rank + 1).toFixed(3))
      if (date === null || date === '') {
        data = {title: taskName, section_id: sectionId, rank: rank}
      } else if (typeof date === 'string') {
        data = {title: taskName, complete_time: this.dateValue, section_id: sectionId, rank: rank}
      } else {
        data = {
          title: taskName,
          complete_time: date[1],
          start_time: date[0],
          section_id: sectionId,
          rank: rank
        }
      }
      await apiHttpClient.post(url, data).then((res) => {
        task = formatTaskData()(res.data.results)
      })
      this.addTaskName = ''
      this.dateValue = null
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
      event.stopPropagation()
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
        if (this.sectionTaskList[sectionID].length > 1) {
          this.changeTask(sectionID, newIndex, task)
        }
      }
    },
    // 更新task
    changeTask(sectionID, newIndex, task) {
      let url = '/api/update_task/'
      let frontRank = newIndex === 0 ? null : this.sectionTaskList[sectionID][newIndex - 1]['rank']
      let lastSection = newIndex + 1 === this.sectionTaskList[sectionID].length
      let nextRank = lastSection ? null : this.sectionTaskList[sectionID][newIndex + 1]['rank']
      let newRank = getNewRank(frontRank, nextRank)
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
      if (!item && this.orgDateValue !== this.dateValue && this.currentTask.id !== 'new') {
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
      } else if (this.currentTask.id !== 'new') {
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
          this.$refs[`sectionInput${section.id}`][0].$refs.input.focus()
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
      let num = type === 'left' ? index : index + 1
      let frontRank = num === 0 ? null : this.sectionListTemp[num - 1].rank
      let nextRank = index + 1 === this.sectionListTemp.length && type === 'right' ? null : this.sectionListTemp[num].rank
      let newRank = getNewRank(frontRank, nextRank)
      let data = {'name': 'Untitled Section', 'rank': newRank}
      apiHttpClient.post(url, data).then((res) => {
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
        let data = {
          'name': this.activeSectionName,
          rank: this.sectionListTemp[this.sectionListTemp.length - 1].rank + 1
        }
        apiHttpClient.post(url, data).then((res) => {
          this.sectionListTemp.push(res.data.results)
          this.sectionTaskList[res.data.results.id] = []
        })
      }
      this.sectionActive = ''
      this.activeSectionName = ''
    },
    // 完成任务
    completeTask(task, sectionID, index) {
      event.stopPropagation()
      let url = '/api/update_task/'
      let data;
      if (!task.completed && this.currentEditTask.id !== 'new') {
        data = {'task_id': task.id, 'completed': true}
        task.completed = true
        task.completed_time = new Date()
      } else {
        data = {'task_id': task.id, 'completed': false, 'completed_time': null}
        task.completed = false
        task.completed_time = null
      }
      if (this.currentEditTask.id !== 'new') {
        apiHttpClient.post(url, data).then(() => {
          this.taskFilter !== 'all' ? this.sectionTaskList[sectionID].splice(index, 1) : null
          task.completed ? this.completedList[sectionID].push(task) : this.incompleteList[sectionID].push(task)
          task.completed ? this.incompleteList[sectionID].splice(index, 1) : this.completedList[sectionID].splice(index, 1)
        })
      }
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
          this.moreActionPosition = {top: '-1000px', left: '-1000px'}
          if (!this.addTaskConfirm) {
            this.currentTask = ''
            this.currentEditTask = {id: ''}
            this.addTaskName = ''
          }
          setTimeout(() => {
            this.$refs.taskMorePop.isPopShow = false
          }, 5)
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
      let taskLength = {};
      taskLength['current'] = section ? section.length : 0;
      taskLength['completed'] = this.completedList[sectionID] ? this.completedList[sectionID].length : 0;
      taskLength['incomplete'] = this.incompleteList[sectionID] ? this.incompleteList[sectionID].length : 0;
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
    },
    stopPropagation(event) {
      event.stopPropagation()
    }
  }
}

// 最后一次更新时间
function getLastCompletedTime(tasksList) {
  let lastDate = tasksList[0].completed_time
  for (let i = 1; i < tasksList.length; i++) {
    if (tasksList[i].completed === true && new Date(tasksList[i].completed_time) > new Date(lastDate)) {
      lastDate = tasksList[i].completed_time;
    }
  }
  let task = formatTaskData()({complete_time: lastDate, start_time: null})
  return task.complete_date
}

// task 排序
function taskListSort(type, sectionTaskList) {
  for (let i in sectionTaskList) {
    sectionTaskList[i] = sectionTaskList[i].sort(function (a, b) {
      switch (type.value) {
        case 'none':
          return a.rank - b.rank
        case 'startDate':
          let ATime = a.start_time ?? a.complete_time ?? '2099-01-01 0:0:0';
          let BTime = b.start_time ?? b.complete_time ?? '2099-01-01 0:0:0';
          return new Date(ATime) - new Date(BTime)
        case 'dueDate':
          let ACTime = a.complete_time ?? '2099-01-01 0:0:0';
          let BCTime = b.complete_time ?? '2099-01-01 0:0:0';
          return new Date(ACTime) - new Date(BCTime)
        case 'createBy':
          return a.created_by - b.created_by
        case 'createOn':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'modified':
          return new Date(b.updated_at) - new Date(a.updated_at)
        case 'likes':
          break
        case 'alphabetical':
          return a.title.localeCompare(b.title)
      }
    })
  }
  return sectionTaskList
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
  let now = new Date()
  const dayDiff = {
    '3weeks': 22,
    '2weeks': 15,
    '1weeks': 8,
    'yesterday': 2,
    'today': 1
  }
  const completedDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayDiff[type], 23, 59, 59);
  for (let section of sectionList) {
    switch (type) {
      case 'all' :
        newTasksList[section.id] = tasksList.filter(task => task.section === section.id);
        break
      case '3weeks' :
      case '2weeks' :
      case '1weeks' :
      case 'yesterday' :
      case 'today' :
        newTasksList[section.id] = tasksList.filter(task => task.section === section.id && task.completed === true && new Date(task.completed_time) > completedDay);
        break
      case 'allCompleted' :
        newTasksList[section.id] = tasksList.filter(task => task.section === section.id && task.completed === true);
        break
      case 'incomplete' :
        newTasksList[section.id] = tasksList.filter(task => task.section === section.id && task.completed !== true);
        break
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
  height: 3rem;
  align-items: center;
  padding: 0 1.5rem;
  font-weight: 500;
  border-bottom: 1px solid #EDE9E8;
}

.main-header span {
  min-width: max-content;
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

.padding-right-437 {
  padding-right: 43.75rem;
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
  border: 1px solid #AFABAC;
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
  top: .95rem;
  border-radius: 1rem;
  border: 1px solid var(--gray);
  padding: .2rem;
}

.task-complete:hover {
  color: #6A9F84;
  background-color: #E9F7F1;
  border-radius: 1rem;
  border: 1px solid #6A9F84;
}

.completed {
  color: white;
  position: absolute;
  cursor: pointer;
  z-index: 11;
  top: .95rem;
  padding: .2rem;
  border-radius: 1rem;
  background-color: #9EC6B4;
  border: 1px solid #9EC6B4;
}

.completed:hover {
  background-color: #8BBBA6;
  border: 1px solid #8BBBA6;
}

.task-project {
  display: flex;
  padding: 1rem .9rem .25rem .9rem;
  justify-content: left;
  flex-wrap: wrap;
}

.project-color {
  width: 2.6rem;
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
  margin: 1rem 0 0 0;
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
  background-color: rgba(0,0,0,0);
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
  /*width: 10rem !important;*/
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
  opacity: 0 !important;
  display: none !important;
  visibility: hidden !important;
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

.ghost-class {
  background-color: #E9E8E7;
  color: #E9E8E7;
  fill: #E9E8E7;
  border: none !important;
}

.ghost-class:hover {
  border: none !important;
}

.ghost-class div {
  visibility: hidden;
}

.drag-class {
  border: 1px solid #4F74C6;
  opacity: 1 !important;
  display: flex !important;
}

.drag-hover {
  border: 2px dashed #4F74C6;
  color: #4F74C6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .96);
  position: absolute;
  top: v-bind(dragHoverPosition [0]);
  left: v-bind(dragHoverPosition [1]);
  z-index: 100;
}

.drag-hover-title {
  font-weight: 700 !important;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.drag-hover span {
  font-weight: 500;
}

.trash-icon {
  display: flex;
  align-items: center;
}

.border-black {
  border: 1px solid #6D6E6F;
}

.detail-card {
  background-color: #F1F2FC;
  border: 1px solid #3F6AC4 !important;
}

</style>