<template>
<draggable v-model="list" v-bind="dragOptions" class="home-card">
<transition-group type="transition">
  <div style="background-color: #fff3cd;width: 3rem;height: 3rem"></div>
  <div style="background-color:black;width: 3rem;height: 3rem"></div>
  <div style="background-color: blue;width: 3rem;height: 3rem"></div>
  <div style="background-color: lightgray;width: 3rem;height: 3rem"></div>
</transition-group>
</draggable>

</template>

<script>
import Popover from "@/components/common/Popover";
import DatePick from "@/components/common/DateTimePicker";
import NewButton from "@/components/common/NewButton";
import {VueDraggableNext} from 'vue-draggable-next'
export default {
  name: "test",
  components: {NewButton, DatePick, Popover, draggable:VueDraggableNext},
  data() {
    return {
      date: null,
      list:[{'name': 'Tasks', 'id': 1}, {'name': 'Projects', 'id': 2}, {'name': 'People', 'id': 3}, {
        'name': 'Goals',
        'id': 4
      }]
    }
  },
  computed:{
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    show() {
      this.isPopShow = true
    },
    close() {
      this.isPopShow = false
    }
  }
}
</script>

<style scoped>
.item {
  width: 15rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
}

.item:hover {
  background-color: #8c8c8b;
}
.test{
  position: absolute;
  left: 10rem;
}
</style>