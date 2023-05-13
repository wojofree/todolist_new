<template>
  <nav class="navBar">
    <div class="flex">
      <div class="navLeft">
        <div class="float cursor" @click="fold">
          <IconBase width="1rem" height="1rem" boxView="0 0 32 32">
            <Fold/>
          </IconBase>
        </div>
        <div class="navButton cursor" @click="add">
          <div class="create">
            <IconBase>
              <Plus/>
            </IconBase>
          </div>
          <span>Create</span>
        </div>
      </div>
      <el-input class="searchInput" :prefix-icon="Search" clearable v-model="searchWords" @input="taskSearch"
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
    };
  },
  created() {
    let url = "/api/user_info/";
    apiHttpClient.get(url).then((response) => {
      this.nickName = response.data.results.nickname[0]
      this.$emit('userInfo', response.data.results)
    })
  },
  methods: {
    taskSearch() {
      this.$emit('taskSearch', this.searchWords);
    },
    add() {
      this.$emit('add')
    },
    fold() {
      this.$emit('fold')
    }
  }
}
</script>
<script setup>
import {Search} from "@element-plus/icons-vue";
import IconBase from "@/components/IconBase";
import {Fold, Plus} from "@/components/icons";
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
  border: .05rem solid var(--box-shadow);
  transition: background-color .3s;
}

.navButton:hover {
  background-color: var(--box-shadow);

}

.float {
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: .2rem;
  transition: background-color .3s;
  color: var(--gray);
}

.float:hover {
  background-color: var(--box-shadow);
  color: var(--black);
}

.navButton span {
  margin-left: .5rem;
}

</style>