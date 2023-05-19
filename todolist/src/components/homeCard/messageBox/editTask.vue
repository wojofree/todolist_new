<template>
  <div class="edit-task-swap">
    <div class="edit-header">
      <div class="button">
        <icon-base height=".75rem" width=".75rem">
          <Right/>
        </icon-base>
        <span>Mark complete</span>
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
          {{ taskData.title }}
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
          <div class="item-right">
            <div class="item-info">
              <div class="user-icon">{{ taskData.assigned_to.username[0] }}</div>
              <span>{{ taskData.assigned_to.username }}</span>
            </div>
            <div class="icon-item mrg-l">
              <icon-base box-view="0 0 32 32" height=".75rem" width=".75rem">
                <XIcon/>
              </icon-base>
            </div>
            <div style="height: 2.125rem">
              <select-bar v-model="test" :options="sectionList"></select-bar>
            </div>
          </div>
        </div>
        <div class="task-pane-item">
          <div class="item-left">
            <span>Due date</span>
          </div>
          <div class="item-right">
            123
          </div>
        </div>
        <div class="task-pane-item">
          <div class="item-left">
            <span>Projects</span>
          </div>
          <div class="item-right">
            123
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconBase from "@/components/IconBase";
import {Right, Like, Clip, SubTask, Link, Expand, More, XIcon, Lock} from "@/components/icons";
import NewInput from "@/components/common/NewInput";
import SelectBar from "@/components/common/SelectBar";
</script>

<script>

import {apiHttpClient} from "@/app/app.service";

export default {
  name: "editTask",
  data() {
    return {
      test:'',
      taskTitle: '',
      showTitleInput: false,
      titleInputFocus: false,
      sectionList: [{}]
    }
  },
  props: {
    taskData: {
      type: [String, Object, Boolean],
      default: ''
    }
  },
  watch: {
    taskData(newValue) {
      this.taskTitle = newValue.title
    }
  },
  created() {
    this.getSection()
  },
  methods: {
    getSection() {
      const url = "/api/get_all_section/"
      apiHttpClient.get(url).then((response) => {
        this.sectionList = response.data.results
        for (let index in this.sectionList) {
          this.sectionList[index].value = this.sectionList[index].id
        }
        this.test = this.sectionList[0]
      })
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
  width: 57rem;
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

.item-right {
  display: flex;
  align-items: center;
}

.mrg-l {
  margin-left: 0;
}
</style>