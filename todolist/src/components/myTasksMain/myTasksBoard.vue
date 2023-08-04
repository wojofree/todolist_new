<template>
  <div class="main-header">
    <span>Last task completed on Tuesday</span>
    <div class="main-header-right">
      <div class="right-button">
        <icon-base width=".75rem" height=".75rem" box-view="0 0 24 24"><RingRight/></icon-base>
        <span>Incomplete tasks</span>
      </div>
      <div class="right-button">
        <icon-base width=".75rem" height=".75rem" box-view="0 0 24 24"><SortMiniIcon/></icon-base>
        <span>Sort</span>
      </div>
    </div>
  </div>
  <div class="section-swap">
    <div v-for="section in this.sectionList">
      <board-card></board-card>
    </div>
  </div>
</template>

<script setup>
import {RingRight, SortMiniIcon} from "@/components/icons"
import BoardCard from "@/components/myTasksMain/board/boardCard";
</script>

<script>
import IconBase from "@/components/IconBase";

export default {
  name: "myTasksBoard",
  components: {IconBase},
  data() {
    return {
      sectionList:['test1','test2']
    }
  }
}

</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  font-size: .75rem;
  color: var(--gray);
  height: 2.5rem;
  align-items: center;
  padding: 0 1.5rem;
  font-weight: 500;
}

.right-button {
  display: flex;
  align-items: center;
  font-weight: 600;
  height: 1.75rem;
  padding: 0 .5rem;
  border-radius: .5rem;
  margin-left: .5rem;
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
}
</style>