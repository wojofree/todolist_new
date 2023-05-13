<template>
  <div class="projects-card" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <div>
      <!--      卡片header-->
      <div class="header" :class="{'header-shadow':isShadowed}">
        <div class="title">
          People
        </div>
        <div class="select">
          <SelectBar :options=options v-model="selectValue" :set-value="options[0]"></SelectBar>
        </div>
      </div>
      <!--      内容-->
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {More, TinyPlus, List} from "@/components/icons"
import SelectBar from "@/components/common/SelectBar";
import {apiHttpClient} from "@/app/app.service";

export default {
  name: "People",
  components: {TinyPlus, SelectBar, IconBase, More, List},
  data() {
    return {
      'isHover': false,
      'isShadowed': false,
      'options': [
        {'value': 'frequent', "name": 'Frequent collaborators'},
        {'value': 'recent', "name": 'Recent collaborators'},
        {'value': 'favorite', "name": 'Favorite collaborators'},
      ],
      'selectValue': '',
      'projectList': []
    }
  },
  created() {
    const url = "/api/get_project"
    apiHttpClient.get(url).then((response) => {
      let data = response.data.results
      data.sort((a, b) => b.id - a.id)
      this.projectList = data
    })
  },
  methods: {
    handleScroll() {
      const item = this.$refs.projectItem
      this.isShadowed = item.scrollTop > 2;
    }
  }
}
</script>

<style scoped>
.projects-card {
  min-width: 24rem;
  height: 25rem;
  background-color: white;
  margin: .5rem;
  border-radius: .5rem;
  transition: box-shadow .2s;
  position: relative;
}

.header {
  display: flex;
  padding: 1.5rem 1.5rem 0 1.5rem;
  justify-content: flex-start;
  margin-bottom: .5rem;
}

.projects-card:hover {
  box-shadow: 0 5px 10px 0 rgba(109, 110, 111, 0.18);
}

.header-shadow {
  box-shadow: 0 2px 10px 0 rgba(109, 110, 111, 0.1);
}

.projects-card .title {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
}

.select {
  margin-left: 1rem;
  /*height: 2rem;*/
  /*z-index: 1000;*/
}

.more {
  color: var(--gray);
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: .2rem;
  padding: .5rem;
  transition: background-color .3s;
  /*border: 1px solid rgba(0,0,0,.05);*/
}

.more:hover {
  color: var(--black);
  background-color: rgba(231, 231, 231, .5);
}

.item {
  margin: 0 1rem;
  display: grid;
  width: calc(100% - 2rem);
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  height: 20rem;
  overflow-y: auto;
}

.item-icon {
  border: 1px dashed var(--gray);;
  border-radius: 1rem;
  height: 3rem;
  width: 3rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  color: white;
}

.item-option {
  display: flex;
  color: var(--gray);
  align-items: center;
  transition: background-color .3s;
  padding: .5rem .5rem;
  border-radius: .5rem;
  margin-bottom: .75rem;
}

.item-option:hover {
  background-color: #F9F8F8;
}
</style>