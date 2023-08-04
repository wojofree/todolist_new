<template>
  <div class="header">
    <div class="header-left">
      <div class="avatar">{{ this.nickName }}</div>
      <div class="avatar-right">
        <div class="title">
          <span>My tasks</span>
          <select-bar v-model="this.titleSelected" :options=this.titleSelectOption :show-icon=false :show-title=false
                      class="select-bar" font-size="1rem"></select-bar>
        </div>
        <div class="tab-select">
          <tab-bar v-model="this.tabSelected" :options="this.tabOption"></tab-bar>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-button">
        <icon-base height=".75rem" icon-color="#6d6e6f" width=".75rem">
          <Lock/>
        </icon-base>
        <span>Share</span>
      </div>
      <div class="customize">
        <div class="header-button">
          <img alt="customize" class="customize-img" src="@/components/icons/customize_12.svg"/>
          <span>Customize</span>
        </div>
      </div>
    </div>
  </div>
  <component :is="this.tabSelected"></component>
</template>
<script setup>
import {Lock} from "@/components/icons"
</script>
<script>
import TabBar from "@/components/common/TabBar";
import SelectBar from "@/components/common/SelectBar";
import IconBase from "@/components/IconBase";
import myTasksList from "@/components/myTasksMain/myTasksList";
import myTasksBoard from "@/components/myTasksMain/myTasksBoard";
import myTasksCalendar from "@/components/myTasksMain/myTasksCalendar";
import myTasksFiles from "@/components/myTasksMain/myTasksFiles";

export default {
  name: "myTasks",
  components: {
    IconBase,
    SelectBar,
    TabBar,
    myTasksList,
    myTasksBoard,
    myTasksCalendar,
    myTasksFiles,
  },
  data() {
    return {
      nickName: '',
      titleSelected: '',
      titleSelectOption: [
        {value: 'sync', name: 'Sync to calendar...'},
        {value: 'email', name: 'Add tasks via Email'},
        {value: 'export', name: 'Export CSV'},
        {value: 'print', name: 'Print'}
      ],
      tabSelected: '',
      tabOption: [
        {name: 'List', value: 'myTasksList'},
        {name: 'Board', value: 'myTasksBoard'},
        {name: 'Calendar', value: 'myTasksCalendar'},
        {name: 'Files', value: 'myTasksFiles'},
      ]
    }
  },
  props: {
    user: {
      type: Object,
      default: null
    },

  },
  watch: {
    user: {
      deep: true,
      handler() {
        this.nickName = this.user.username.substr(0, 2)
      }
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid #EDE9E8;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.avatar {
  background-color: #4DCCC4;
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  line-height: 3rem;
  font-size: 1rem;
  font-weight: 500;
  margin-right: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
  display: flex;
  align-items: center;
  height: 2rem;
  margin-top: .5rem;
}

.title span {
  margin-right: .25rem;
}

.select-bar {
  height: 2rem;
}

.tab-select {
  margin-top: .15rem;
}

.header-button {
  border: 1px solid #cfcbcb;
  border-radius: .3rem;
  display: flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 .5rem;
}

.header-button span {
  margin-left: .25rem;
  font-size: .75rem;
}

.customize-img {
  height: .75rem;
  width: .75rem;
}

.customize {
  padding-left: .5rem;
  margin-left: .5rem;
  border-left: 2px solid #F6F4F4;
}

.header-right {
  display: flex;
  align-items: center;
}
</style>