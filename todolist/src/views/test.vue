<template>
  <div class="nav">
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273">段落
    </NewButton>
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273" @click="this.showTime = true">时间
    </NewButton>
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273">人数
    </NewButton>
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273">随机
    </NewButton>
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273">副播
    </NewButton>
    <NewButton background-style="#334155" border-radius="10rem" class="mrg-right-1" font-color="#ffffff"
               hover-color="#566273">互动
    </NewButton>
  </div>

  <div class="editor-swap">
    <div class="text-line">
      <div>1</div>
    </div>
    <div class="text-editor-swap">
      <div class="title">段落1</div>
      <div class="task-title">
        <div class="text-body">
          <div class="text-item"
             @click="this.openTextArea1" ref="textItem1">{{ this.inputValue1 }}
          </div>
          <div class="button" v-show="showTime">时间</div>
          <div class="text-item"
             @click="this.openTextArea2" ref="textItem2" v-show="showTime">{{ this.inputValue2 }}
          </div>
          <div class="button" v-show="showTime">人数</div>
        </div>
        <div v-show="showTitleInput1 || showTitleInput2" class="text-body mrg-left">
          <input v-show="showTitleInput1 || showTitleInput2" ref="titleTextArea1" v-model="this.inputValue1"
               class="editor-input1" placeholder="Write some thing" @input="this.changeWidth1"
               @blur="showTitleInput1 = titleInputFocus1 = false" @focus="showTitleInput1 = titleInputFocus1 = true"
        />
          <div class="button" v-show="showTime">时间</div>
          <input v-show="(showTitleInput1 || showTitleInput2) & showTime" ref="titleTextArea2" v-model="this.inputValue2"
               class="editor-input2" placeholder="" @input="this.changeWidth2"
               @blur="showTitleInput2 = titleInputFocus2 = false" @focus="showTitleInput2 = titleInputFocus2 = true"
        />
          <div class="button" v-show="showTime">人数</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import NewButton from "@/components/common/NewButton";
</script>
<script>
import {VueDraggableNext} from "vue-draggable-next";

export default {
  name: "test",
  components: {draggable: VueDraggableNext},
  data() {
    return {
      test: [1, 2, 3, 4],
      inputValue1: '',
      inputValue2: '',
      showTitleInput2: true,
      titleInputFocus2: true,
      showTitleInput1: true,
      titleInputFocus1: true,
      inputItemOneWidth1:'',
      inputItemOneWidth2:'',
      showTime: false
    }
  },
  created() {

  },
  methods: {
    openTextArea1() {
      this.showTitleInput1 = true
      this.$nextTick(() => {
        this.$refs.titleTextArea1.focus()
      })
    },
    openTextArea2() {
      this.showTitleInput2 = true
      this.$nextTick(() => {
        this.$refs.titleTextArea2.focus()
      })
    },
    changeWidth1() {
      this.inputItemOneWidth1 = this.$refs.textItem1.getBoundingClientRect().width +'px'
    },
    changeWidth2() {
      this.inputItemOneWidth2 = this.$refs.textItem2.getBoundingClientRect().width +'px'
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.nav {
  background: #F2F4F7;
  height: 55px;
  display: flex;
  align-items: center;
  padding-left: 2rem;
}

.mrg-right-1 {
  margin-right: 1rem;
}

.editor-swap {
  height: 100%;
  display: flex;
}

.text-line {
  height: 100%;
  background: #1b6279;
  width: max-content;
  padding: 0 .5rem;
  color: white;
}

.text-editor-swap {
  width: 100%;
  padding: 1rem;
}

.editor-input1 {
  width: v-bind(inputItemOneWidth1);
  height: max-content;
  background: #F2F4F7;
  color: #1a1e21;
  border: none;
  font-size: 1rem;
  padding: .5rem 1rem;
}

.editor-input2 {
  width: v-bind(inputItemOneWidth2);
  height: max-content;
  background: #F2F4F7;
  color: #1a1e21;
  border: none;
  font-size: 1rem;
  padding: .5rem 1rem;
}

.notNone {

}

.editor-input1:focus {
  outline: none;
  border: none;
}


.editor-input2:focus {
  outline: none;
  border: none;
}

.title {
  text-align: left;
  font-weight: 600;
  font-size: 1.2rem;
}

.text-item {
  color: #1a1e21 !important;
  font-size: 1rem;
  text-align: left;
  padding: .5rem 1rem;
  background: #F2F4F7;
  height: 2.5rem;
}

.task-title {
  position: relative;
}

.mrg-left {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: max-content!important;
}

.button {
  border-radius: 10rem;
  background: #1a1e21;
  width: 5rem;
  height: 1.5rem;
}

.text-body {
  display: flex;
  align-items: center;
  width: 100%;
  background: #F2F4F7;
}
</style>