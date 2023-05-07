<template>

</template>

<script>
import NewButton from "@/components/common/NewButton";
export default {
  name: "test",
  components: {NewButton},
  data(){
    return {
      isHover:'30rem'
    }
  }
}
</script>

<style scoped>
.button {
  position: absolute;
  left: 20rem;
  top: 10rem;
}

.main-test {
  height: 100%;
  position: absolute;
  right: 0;
  width: v-bind(isHover);
  background-color: #fff3cd;
  transition: width .3s;
}

.item-1 {
  width: 30rem;
  height: 100%;
  position: relative;
  right: 0;
  background-color: #1b6279;
}

.item-2 {
  position: absolute;
  width: 20rem;
  height: 20rem;
  background-color: black;
  right: 0;
  top: 0;
}
</style>