<template>
  <div id="app">
  <button @click="addItem">添加元素</button>
  <div v-for="item in items" :key="item.id" class="item"
       v-bind:class="{ 'fade-enter-active': this.newid === item.id}">
    {{ item.name }}
  </div>
    <icon-base><Like/></icon-base>
</div>
</template>
<script setup>
import {
  Like
} from "@/components/icons"
</script>
<script>
import IconBase from "@/components/IconBase";
export default {
  name: "test",
  components: {IconBase},
  data() {
    return {
      items: [
    ],
      newid:''
    }
  },
  created() {

  },
  methods:{
    addItem() {
      const newItem = { id: Date.now(), name: '新元素', isActive: true };
      this.newid = newItem.id
      this.items.push(newItem);
      setTimeout(() => {
        this.newid = ''
      }, 1);
    }
    }
}
</script>

<style scoped>
.item {
  background-color: #f0f0f0;
  transition: height 0.3s ease;
  height: 100px;
}

.fade-enter-active {
  height: 0!important;
}

</style>