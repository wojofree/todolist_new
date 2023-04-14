<template>
  <nav class="navBar">
    <div class="flex">
      <div class="navLeft">
        <div class="float">
          <el-icon color="#6d6e6f" size="1rem" class="cursor fold">
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path
                  d="M1,16h30c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1l0,0C0,16.4,0.4,16,1,16z M1,4h30c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1H1C0.4,6,0,5.6,0,5l0,0C0,4.4,0.4,4,1,4z M1,28h30c0.6,0,1,0.4,1,1l0,0c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1l0,0C0,28.4,0.4,28,1,28z"></path>
            </svg>
          </el-icon>
        </div>
        <div class="navButton cursor" @click="add">
          <el-icon class="create">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                  d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z"></path>
            </svg>
          </el-icon>
          <span>Create</span>
        </div>
      </div>
      <el-input class="searchInput" size="middle" :prefix-icon="Search" clearable v-model="searchWords" @input="search"
                placeholder="search"></el-input>
      <div class="flex-1">
        <div class="userInfo cursor">{{ nickName }}</div>
      </div>
    </div>
  </nav>
</template>

<script>
import {apiHttpClient} from "@/app/app.service";

export default {
  name: "NavbarView",
  data() {
    return {
      searchWords: '',
      nickName: '',
      isHover: false,
    };
  },
  created() {
    let url = "/api/user_info/";
    apiHttpClient.get(url).then((response) => {
      console.log(response.data.results.nickname[0])
      this.nickName = response.data.results.nickname[0]
    })
  },
  methods:{
    search() {
      this.$emit('search', this.searchWords);
    },
    add () {
      this.$emit('add')
    },
  }
}
</script>
<script setup>
</script>
<style>
.searchInput .el-input__wrapper {
  border-radius: 15rem;
}
</style>
<style scoped>
.navBar {
  background-color: #F5F3F3;
  padding: .5rem 1.8rem;
  width: 100%;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.searchInput {
  width: 30rem;
  flex: 1
}

.hover-color {
  color: #1e1f21;
}

.fold:hover {
  color:#1e1f21
}

.navBar .userInfo {
  background-color: #FF985E;
  border-radius: 15rem;
  width: 1.7rem;
  height: 1.7rem;
  line-height: 1.7rem;
  font-weight: 800;
  margin-left: auto;
  color: white;
  transition: background-color .3s;
}

.navBar .userInfo:hover {
  background-color: #F08D55;
}

.flex-1 {
  flex: 1;
}

.navLeft {
  display: flex;
  align-items: center;
  flex: 1;
}

.navBar .create {
  color: white;
  background-color: #f06a6a;
  border-radius: 15rem;
  padding: .2rem;
  margin: auto;
  width: 1.3rem;
  height: 1.3rem;
}

.navButton {
  margin-left: 1rem;
  background-color: white;
  padding: .5rem .8rem .5rem .5rem;
  border-radius: 15rem;
  text-align: center;
  display: flex;
  border: .05rem solid rgba(0, 0, 0, .05);
  transition: background-color .3s;
}

.navButton:hover {
  background-color: rgba(55, 23, 23, 0.05);

}

.float {
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: .2rem;
  transition: background-color .3s;
}

.float:hover {
  background-color: rgba(55, 23, 23, 0.04);
}

.navButton span {
  margin-left: .5rem;
}

.cursor {
  cursor: pointer;
}
</style>