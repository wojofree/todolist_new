<template>
  <Drawer direction="rtl" v-model="isOpenDrawer" ref="test">
    <div class="custom-swap">
      <div class="custom-header">
        <span>Customize Home</span>
        <IconBase box-view="0 0 32 32" icon-color="var(--gray)" @click="closeDrawer" class="cursor">
          <Close />
        </IconBase>
      </div>
      <div class="color-choose">
        <span>Background</span>
        <div class="color-select">
          <div v-for="item in colorList" :style="{'color':item}" class="color-option cursor" @click="colorSelect(item)">
            <IconBase width="1rem" height="1rem" class="right-color" v-show="isColorSelect === item">
              <Right />
            </IconBase>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script>
import Drawer from "@/components/Drawer";
import NewButton from "@/components/NewButton";
import IconBase from "@/components/IconBase";
import {Close, Right} from "@/components/icons";
import {apiHttpClient} from "@/app/app.service";
export default {
  name: "CustomizeHome",
  components: {Right, Close, IconBase, NewButton, Drawer},
  data () {
    return {
      myName: {name:'test'},
      isOpenDrawer:false,
      colorList:['#5B073A','#E2A039','#AFCF55','#295B52','#37B9B1','#AADCD9','#4673D3','#938CE1','#AD7CC4','#F6A0A3','#E0DEDC','#5CC9F5'],
      isColorSelect:'#ffffff'
    }
  },
  props:{
    modelValue:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    modelValue(newValue) {
      if(newValue) {
        this.isOpenDrawer = newValue
      }
    },
    isOpenDrawer(newValue) {
      if (!newValue) {
        this.$emit('update:modelValue',this.isOpenDrawer)
      }
    }
  },
  created() {
    this.$emit('backColor',this.isColorSelect)
    this.isOpenDrawer = this.modelValue
  },
  methods:{
    colorSelect(item) {
      this.isColorSelect = item
      this.$emit('backColor',item)
      const url = "/api/update_setting/"
      const data = {"background_color":item}
      apiHttpClient.post(url,data)
    },
    closeDrawer() {
      this.isOpenDrawer = false
      this.$emit('update:modelValue',this.isOpenDrawer)
    },
  }
}
</script>

<style scoped>
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color:var(--black);
  margin-bottom: 1rem;
}

.custom-header span {
  font-size: 1.5rem;
  font-weight: 700;
}

.custom-swap {
  width: 23.5rem;
  height: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  color:var(--black);
  position: absolute;
  left: 0;
}

.color-select {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.color-option {
  background-color: currentColor;
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  margin-top: .5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-choose {
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  align-items: flex-start;
  font-size: 1rem;
  font-weight: 500;
}

.right-color {
  filter: grayscale(1) contrast(999) invert(1)
}
</style>