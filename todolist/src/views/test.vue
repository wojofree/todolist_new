<template>
  <div style="position: absolute;top: 400px;right: 30px">
  <date-pick type="date" v-model="date">
    <div style="width: 5rem;height: 3rem;background-color: #fff3cd"></div>
  </date-pick>
  </div>
  {{date}}
  <new-button @click="date = [null,'2023/05/11']" class="test">test</new-button>
</template>

<script>
import Popover from "@/components/common/Popover";
import DatePick from "@/components/common/DateTimePicker";
import NewButton from "@/components/common/NewButton";

export default {
  name: "test",
  components: {NewButton, DatePick, Popover},
  data() {
    return {
      date: null
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