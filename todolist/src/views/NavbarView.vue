<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light bg-white nav-new">
    <div class="container-fluid max-with-80">
      <div class="collapse navbar-collapse" id="navbarColor03">
        <el-link href="" @click="onReload()" class="navbar-brand" type="info">ToDoList</el-link>
      </div>
      <el-input size="large" class="width-20" v-model="searchWords" :suffix-icon="Search"
                @input="navbarSearch"/>
      <el-button type="primary" size="large" style="margin-left: .7rem;" @click="open_modal">+</el-button>

      <el-popover
          placement="top-start"
          trigger="hover"
          popper-style="
              border: none;
              box-shadow: inset 1px 1px rgba(255, 255, 255, .2), inset -1px -1px rgba(255, 255, 255, .1), 1px 3px 24px -1px rgba(0, 0, 0, .15);
              background-color: transparent;
              background-image: linear-gradient(125deg, rgba(255, 255, 255, .3), rgba(255, 255, 255, .2) 70%);
              -webkit-backdrop-filter: blur(5px);
              backdrop-filter: blur(5px);
              border-radius: .5rem;
              padding:1rem 0;
          "
      >
        <div class="user_info">
          <a href="reset/"><p>重置密码</p></a>
          <a href=""><p @click="logout()">退出登陆</p></a>
        </div>
        <template #reference>
          <div class="dis-flex">
            <UserFilled style="width: 2rem; margin-left: .7rem;"/>
            <p ref="nick_name">Unknown</p>
          </div>
        </template>
      </el-popover>
    </div>
  </nav>

</template>

<script>
import {apiHttpClient} from "@/app/app.service";

export default {
  name: "NavbarView",
  data() {
    return {
      searchWords:''
    }
  },
  mounted() {
    const nickName = this.$refs.nick_name
    const url = "/api/user_info/";
    apiHttpClient.get(url).then(function (response) {
      nickName.innerHTML = response.data.results.nickname
    })
  },
  inject: ["reload"],
  methods:{
    onReload() {
       this.reload(); //局部刷新
    },
    navbarSearch(){
      this.$emit('search', this.searchWords);
    },
    open_modal() {
      this.$emit('open_modal')
    },
    logout() {
      let url = "/user_logout/"
      apiHttpClient.get(url)
      this.$router.push('/login/');
    }
  }
}
</script>
<script setup>
import {Search, UserFilled} from '@element-plus/icons-vue'
</script>
<style scoped>
.bg-white {
  background: linear-gradient(125deg, rgba(255, 255, 255, .85), rgba(255, 255, 255, .75) 70%) !important;
  backdrop-filter: blur(5px);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
}

.max-with-80 {
  max-width: 80rem;
}

.width-20 {
  width: 20%;
}

.dis-flex {
  display: flex;
}

.dis-flex p {
  margin: auto;
}

.user_info {

}

.user_info p {
  padding: .5rem 1rem;
  margin-bottom: 0;
}

.user_info p:hover {
  background: rgba(255, 255, 255, .5);
  color: white;
}

.popover {
  background: rgba(0, 0, 0, 0);
  border: none;
}
</style>