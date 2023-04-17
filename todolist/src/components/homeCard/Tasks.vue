<template>
<div class="task-card">
  <div style="">
    <div class="header">
      <IconBase width="3rem" height="3rem" box-view="0 0 48 48" class="avatar"><Avatar/></IconBase>
      <div class="tab-navigation-bar">
        <div class="title">My Tasks</div>
        <TabBar v-model="tabValue" :options=options></TabBar>
      </div>
    </div>
    <div class="more">
      <IconBase width="1.5rem" height="1.5rem"><More /></IconBase>
    </div>
  </div>
</div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {Avatar,More} from "@/components/icons"
import TabBar from "@/components/TabBar";
export default {
  name: "Tasks",
  components: {TabBar, Avatar, IconBase, More},
  data () {
    return {
      'tabValue':'',
      'options': [
          {'name':'Upcoming','value':'upComping'},
          {'name':'Overdue','value':'overDue'},
          {'name':'Completed','value':'completed'}
      ]
    }
  }
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
}

.task-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}

.avatar {
  border:1px dashed #6d6e6f;
  border-radius: 3rem;
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
  margin-top: .5rem;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 500;
}

.more {
  color: #6d6e6f;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: .2rem;
}

.more:hover {
  color: #1e1f21;
  background-color: rgba(55, 23, 23, 0.05);
}
</style>