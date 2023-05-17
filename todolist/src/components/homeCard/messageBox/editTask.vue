<template>
  <div class="edit-task-swap">
    <div class="edit-header">
        <div class="button">
          <icon-base width=".75rem" height=".75rem">
            <Right/>
          </icon-base>
          <span>Mark complete</span>
        </div>
      <div class="icons">
        <div class="icon-item">
          <icon-base box-view="0 0 32 32" width="1rem" height="1rem">
            <Like />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <Clip />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <SubTask />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <Link />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <Expand />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <More />
          </icon-base>
        </div>
        <div class="icon-item">
          <icon-base box-view="0 0 32 32"  width="1rem" height="1rem">
            <XIcon />
          </icon-base>
        </div>
      </div>
    </div>
    <div class="public">
        <div class="public-left">
          <icon-base width=".75rem" height=".75rem" icon-color="var(--gray)">
            <Lock />
          </icon-base>
          <span>This task is visible to members of My Workspace.</span>
        </div>
      <div class="public-right">
        Make public
      </div>
    </div>
    <div class="task-main">
      <div class="task-title">
        <div>
          {{taskData.title}}
        </div>
        <new-input></new-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconBase from "@/components/IconBase";
import {Right, Like, Clip, SubTask, Link, Expand, More, XIcon, Lock} from "@/components/icons";
import NewInput from "@/components/common/NewInput";
</script>

<script>

export default {
  name: "editTask",
  data() {
    return {

    }
  },
  props: {
    taskData: {
      type:[String, Object, Boolean],
      default:''
    }
  },
  watch: {
    taskData(newValue) {
      console.log(newValue)
    }
  }
}
</script>

<style scoped>
.edit-task-swap {
  background-color: white;
  height: 10rem;
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
  padding:0 .5rem;
  height: 1.75rem;
  background-color: white;
  border: 1px solid #EEEAE9;
  border-radius: .4rem;
  transition: background-color .3s,  border-color .3s;
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
  transition:  background-color .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .3rem;
  color:var(--gray);
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
</style>