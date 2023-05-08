<template>
<popover>
  <template #main>
    <div style="width: 5rem;height: 5rem;background-color: #fff3cd;">点这里</div>
  </template>
  <template #pop>
    <div class="item">item1</div>
    <div class="item">item2</div>
    <popover pop-position="side" hover-control direction="flex-start">>
      <template #main>
      <div class="item">item3</div>
  </template>
      <template #pop>
        <div style="width: 10rem;height: 10rem;background-color: #fff3cd;"></div>
      </template>
    </popover>
    <div class="item">item4</div>
  </template>
</popover>
</template>

<script>
import Popover from "@/components/common/Popover";
export default {
  name: "test",
  components: {Popover},
  data(){
    return {
      isPopShow:false
    }
  },
  methods:{
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
.item{
  width: 15rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
}

.item:hover {
  background-color: #8c8c8b;
}
</style>