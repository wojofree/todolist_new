<template>
  <div class="swap">
<div class="test1" @mouseenter="show" @mouseleave="close"></div>
<div class="test2" :class="{'vsb-hidden':!isPopShow}" @mouseleave="close" @mouseenter="show"></div>
    </div>
</template>

<script>
export default {
  name: "test",
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
.swap{
  display: flex;
}
.test1 {
  width: 5rem;
  height: 5rem;
  background-color: #fff3cd;
}

.test2 {
  width: 5rem;
  height: 5rem;
  background-color: #1b6279;
  position: absolute;
  margin-left: 4rem;
}
.vsb-hidden{
  visibility: hidden;
}
</style>