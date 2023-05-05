<template>
  <div class="main3">
<div class="main2">
  <div class="main1">
    <div class="title" style="background-color: blue">
      <div class="select">
        <div class="select-title">testest</div>
        <div class="select-option">111</div>
      </div>
    </div>
    <div class="title" style="background-color: blueviolet"></div>
    <div class="title" style="background-color: red"></div>
  </div>
</div>
    </div>
</template>

<script>
export default {
  name: "test"
}
</script>

<style scoped>
.main2 {
  display: flex;
}

.main3 {
  display: flex;
  flex-direction:column;
  overflow-x: hidden;
}

.select-title {
  height: 3rem;
  color: white;
}

.select-option {
  height: 15rem;
  width: 100%;
  display: inline-block;
  background-color: #fff3cd;
}

.list {
  height: 15rem;
  width: 3rem;
  background-color: #1b6279;
}

.title {
  height: 2rem;
  width: 3rem;
  background-color: #fff3cd;
}

.main1 {
  /*height: 3rem;*/
  display: flex;
  justify-content: flex-start;
}

</style>