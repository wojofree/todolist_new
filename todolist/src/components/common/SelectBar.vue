<template>
  <div class="select-bar" ref="contentWrap">
    <div class="disp-block">
      <div class="select cursor" @click="this.openSelect = !this.openSelect" ref="title">
        <div class="flex">
          <span v-if="this.showTitle">{{ modelValue.name }}</span>
          <IconBase :width=this.fontSize :height=this.fontSize box-view="0 0 24 24">
            <Arrow/>
          </IconBase>
        </div>
      </div>
    </div>
    <div class="disp-block list">
      <div class="option" v-show="openSelect">
        <div class="option-title" v-if="optionTitle !== ''">
          <p>{{ optionTitle }}</p>
        </div>
        <div class="option-item cursor" v-for="item in options" @click="selectOption(item)" :class="{'selected':isSelect === item.value && this.showIcon}">
          <IconBase width=".75rem" height=".75rem" box-view="0 0 32 32"
                    :class="{'vis-hidden':isSelect !== item.value}" v-if="showIcon">
            <Right/>
          </IconBase>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectBar",
  data() {
    return {
      openSelect: false,
      isSelect: '',
      titleWidth: '2rem',
      mrgLeft: '1rem'
    }
  },
  props: {
    modelValue: {
      type: [String, Number, Date, Object],
      default: '11'
    },
    options: {
      type: Object,
      default: [
        {'value': 1, "name": '选项1'},
        {'value': 2, "name": '选项2'},
        {'value': 3, "name": '选项3'},
        {'value': 4, "name": '选项4'},
      ]
    },
    optionTitle: {
      type:[String, Boolean],
      default:''
    },
    fontSize: {
      type: String,
      default: '.75rem'
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getDefaultSelect()
    if (!this.showIcon){
      this.mrgLeft = '0px'
    }
  },
  watch: {
    openSelect(newVal) {
      if (newVal) {
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
    options(){
      this.getDefaultSelect()
    },
    modelValue(newValue) {
      if(newValue.value !== undefined){
        this.$nextTick(()=>{
          this.titleWidth = this.$refs.title.offsetWidth + 'px'
          this.selectOption(newValue)
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.titleWidth = this.$refs.title.offsetWidth + 'px'
    })
  },
  methods: {
    getDefaultSelect() {
      if (this.modelValue === '') {
        this.selectOption(this.options[0])
      } else {
        this.selectOption(this.modelValue)
      }
    },
    handleOutsideClick(e) {
      if (this.$refs.contentWrap && !this.$refs.contentWrap.contains(e.target)) {
        this.openSelect = false;
      }
    },
    selectOption(item) {
      this.select = item.name
      this.isSelect = item.value
      this.openSelect = false
      this.$emit('update:modelValue', item)
      this.$nextTick(() => {
        this.titleWidth = this.$refs.title.offsetWidth + 'px'
      })
    }
  }
}
</script>
<script setup>
import IconBase from "@/components/IconBase";
import {Arrow, Right} from "@/components/icons"
</script>
<style scoped>
.select-bar {
  text-align: left;
  z-index: 100002;
  width: v-bind(titleWidth);
}

.select-bar span {
  font-size: v-bind(fontSize);
  font-weight: 500;
}

.select-bar p {
  font-size: .875rem;
}

.disp-block {
  display: block !important;
}

.vis-hidden {
  visibility: hidden;
}

.select {
  width: auto;
  display: inline-block;
  color: var(--gray);
  padding: .5rem;
  border-radius: .4rem;
}

.flex {
  display: flex;
  align-items: center;
}

.flex span {
  width: max-content;
}

.select:hover {
  background-color: rgb(248, 246, 246);
  color: var(--black);
}

.list {
  position: relative;
  z-index: 20000001;
}

.select span {
  margin-right: .35rem;
}

.option {
  min-width: 11rem;
  max-width: 30rem;
  max-height: 29rem;
  overflow-y: auto;
  border: .1rem solid rgba(0, 0, 0, .03);
  border-radius: .3rem;
  padding: .4rem 0;
  display: inline-block;
  background-color: white;
  box-shadow: 0 1px 4px 0 rgba(109, 110, 111, 0.08);
  z-index: 200001;
}

.option-title {
  display: flex;
  align-items: center;
  padding: .5rem 1rem .5rem 1.8rem;
}

.option-title p {
  margin-bottom: 0;
  margin-left: 1rem;
  width: max-content;
  font-weight: 600;
}

.option-item {
  display: flex;
  align-items: center;
  padding: .5rem 1rem;
}

.option-item p {
  margin-bottom: 0;
  margin-left: v-bind(mrgLeft);
  width: max-content;
}

.option-item:hover {
  background-color: rgb(248, 246, 246);
}

.selected {
  background-color: rgb(248, 246, 246);
}
</style>