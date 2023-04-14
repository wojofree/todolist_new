<template>
  <NavbarView></NavbarView>
  <Menu></Menu>
</template>

<script>
import {apiHttpClient} from '@/app/app.service';

export default {
  data() {
    return {

      }
  },
  // 表单规则校验
  created() {
    // 获取内容列表数据
  },
}
</script>
<script setup>
import Menu from "@/components/Menu.vue"
import NavbarView from "@/components/NavbarView";
</script>
<style>
</style>
<style scoped>
</style>