<template>
  <div class="data-pick-main-swap">
    <!--    header-->
    <div class="header">
      <div class="mini-icon cursor" @click="changePage(-1)">
        <IconBase style="transform: rotate(90deg)" box-view="-3 -3 30 30" width="1.2rem" height="1.2rem">
          <Arrow/>
        </IconBase>
      </div>
      <div class="title">
        <SelectBar :options=monthList v-model="selectedValue" fontSize=".9rem"></SelectBar>
      </div>
      <div class="mini-icon cursor" @click="changePage(1)">
        <IconBase style="transform: rotate(-90deg)" box-view="-3 -3 30 30" width="1.2rem" height="1.2rem">
          <Arrow/>
        </IconBase>
      </div>
    </div>
    <!--    星期-->
    <div class="week">
      <span>M</span>
      <span>T</span>
      <span>W</span>
      <span>T</span>
      <span>F</span>
      <span>S</span>
      <span>S</span>
    </div>
    <div class="date-swap">
      <div class="date" v-for="(item) in dateList" @click="selectDays(item.date)" @mouseenter="coverDate(item.date)"
           :class="{'pass':((cover === true || endDay !== '')&& coverStart < item.date &&  item.date < coverEnd),
      'date-start':((cover === true || endDay !== '')&& compare(coverStart,item.date)),
      'date-end':((cover === true || endDay !== '')&& compare(coverEnd,item.date)),
      }"
      >
        <span class="date-span"
              :class="{'current-day':compare(currentDate,item.date),
              'gray-color':item.status !== 'current',
              'active':compare(startDay,item.date) || compare(endDay,item.date) || compare(coverEnd,item.date) || compare(coverStart,item.date),
              'pass':((cover === true || endDay !== '')&& coverStart < item.date &&  item.date < coverEnd)
              }"
        >{{ item.day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {Arrow} from "@/components/icons";
import SelectBar from "@/components/common/SelectBar";

export default {
  name: "DatePick",
  components: {SelectBar, Arrow, IconBase},
  data() {
    return {
      dateList: [],      // 日期列表
      currentMonth: '',  //当前月份
      currentDate: '',   //当前日期，不更新，样式用
      startDay: '',      // 范围开始日期
      coverStart: '',    // 样式开始日期
      coverEnd: '',      // 样式结束日期
      cover: false,     // 控制鼠标指向时范围样式是否出现
      endDay: '',       // 结束日期
      selectedValue: '', // 月份选择
      monthList: [],     //月份列表
      fullOptions: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      },
      titleOptions: {month: 'long', year: 'numeric'},
    }
  },
  props: {
    modelValue: {
      type: [String, Date, Object, Array],
      default: ''
    },
    color: {
      type: String,
      default: '#4673D3'
    },
    type: {
      type: String,
      default: 'date'
    }

  },
  created() {
    let now = new Date()
    // 判断是否有历史选择数据，更新样式
    this.currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 更新当前月份及title，根据开始日期来
    this.getMonthList(now)
    this.modelValue !== '' && this.modelChange()

  },
  watch: {
    // 监控选择月份变化，更新日期表
    selectedValue() {
      this.currentMonth = this.selectedValue.value
      this.$nextTick(() => {
        this.getDays(this.currentMonth)
      })
    },
    modelValue() {
      this.modelChange()
    },
  },
  methods: {
    // modelValue变化时，更新样式
    modelChange() {
      let date = new Date()
      // 判断是否有历史选择数据，更新样式
      if (this.type === 'dateRange') {
        date = this.modelValue[0] && new Date(this.modelValue[0])
        const endDate = this.modelValue[1] && new Date(this.modelValue[1])
        this.startDay = this.coverStart = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) : '';
        this.endDay = this.coverEnd = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0) : '' ;
        if (this.compare(this.startDay,this.endDay) || date === null){
          this.coverEnd = this.coverStart = ''
        }
      } else if (this.type === 'date') {
        date = this.modelValue && new Date(this.modelValue);
        this.endDay = this.startDay = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) : '';
        this.coverEnd = this.coverStart = ''
      }
      // 更新当前月份及title，根据开始日期来
      date = (date === '' || date === null) ? new Date() : date;
      this.currentMonth = date
      this.selectedValue = {name: new Intl.DateTimeFormat('en-US', this.titleOptions).format(date), value: date}
      this.getDays(this.currentMonth)
    },
    // 计算选择的日期范围，改变样式用
    coverDate(date) {
      if (this.type ==='dateRange') {
        if (this.cover === true) {
          if (date <= this.startDay) {
            this.coverEnd = this.startDay
            this.coverStart = date
          } else {
            this.coverStart = this.startDay
            this.coverEnd = date
          }
        }
      }
    },
    // 确定选择日期
    selectDays(item) {
      if (this.type === 'date') {
        this.endDay = item
        this.emitDate(item,this.endDay)
      } else if (this.type === 'dateRange') {
        if (this.startDay === '') {
          this.startDay = item
          this.cover = this.endDay === '';
          this.emitDate(this.startDay,null)
        } else if (this.endDay === '') {
          this.endDay = item
          this.cover = false
        } else {
          this.startDay = item
          this.emitDate(this.startDay,null)
          this.endDay = ''
          this.cover = true
          this.coverEnd = ''
          this.coverStart = ''
        }
        // 前后日期对调及传递modelValue
        if (this.startDay > this.endDay && this.endDay !== '') {
          const tempDay = this.endDay
          this.endDay = this.startDay
          this.startDay = tempDay
          this.emitDate(this.startDay,this.endDay)
        } else if (this.endDay >= this.startDay) {
          this.emitDate(this.startDay,this.endDay)
        }
      }
    },
    emitDate(startDay, endDay) {
      let endDateString = endDay;
      if (endDay !==null){
       const newEndDate = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate(), 23, 59, 59)
        endDateString = newEndDate.toLocaleString('zh-CH', this.fullOptions).replace(/\//g, '-')
      }
      const startDateString = startDay.toLocaleString('zh-CH', this.options).replace(/\//g, '-')
      if(this.type ==='dateRange'){
        this.$emit('update:modelValue', [startDateString, endDateString])
      }else{
        this.$emit('update:modelValue', endDateString)
      }
    },
    // 获取月份列表，往后12个月
    getMonthList(date) {
      for (let i = 0; i < 12; i++) {
        let dateTemp = new Date(date.getFullYear(), date.getMonth() + i, 1)
        this.monthList.push({
          value: dateTemp,
          name: new Intl.DateTimeFormat('en-US', this.titleOptions).format(dateTemp)
        })
      }
    },
    // 日期比对用
    compare(date1, date2) {
      const dateOne = date1 !== '' ? new Date(date1) : new Date('0');
      const dateTwo = date2 !== '' ? new Date(date2) : new Date('0');
      return (dateOne.getTime() === dateTwo.getTime())
    },
    // 月份前后切换
    changePage(i) {
      const selectDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + i, 1)
      this.selectedValue = {
        name: new Intl.DateTimeFormat('en-US', this.titleOptions).format(selectDate),
        value: selectDate
      }
      this.currentMonth = selectDate
      this.getDays(this.currentMonth)
    },
    //获取日期列表
    getDays(date) {
      let startWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      startWeek = startWeek === 0 ? 7 : startWeek  //0变7
      const prevLastDay = new Date(new Date(date.getFullYear(), date.getMonth(), 1) - 24 * 60 * 60 * 1000).getDate()
      const lastDay = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 1) - 24 * 60 * 60 * 1000).getDate()
      const nexMonthDays = 43 - startWeek - lastDay
      const prevMonthDays = this.getPrevMonthDays(prevLastDay, startWeek)
      const currentMonthDays = this.getCurrentMonthDays(lastDay)
      const nextMonthDays = this.getNextMonthDays(nexMonthDays)
      this.dateList = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
    },
    // 前一个月展示的日期
    getPrevMonthDays(prevLastDay, startWeek) {
      const prevMonthDays = []
      for (let i = prevLastDay - startWeek + 2; i <= prevLastDay; i++) {
        prevMonthDays.push({
          date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, i),
          day: i,
          status: 'prev'
        });
      }
      return prevMonthDays;
    },
    // 当月日期列表
    getCurrentMonthDays(lastDay) {
      const currentMonthDays = []
      for (let i = 1; i <= lastDay; i++) {
        currentMonthDays.push({
          date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i),
          day: i,
          status: 'current'
        });
      }
      return currentMonthDays
    },
    // 下一个月日期列表
    getNextMonthDays(nexMonthDays) {
      const nextMonthDays = []
      for (let i = 1; i <= nexMonthDays; i++) {
        nextMonthDays.push({
          date: new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, i),
          day: i,
          status: 'next'
        })
      }
      return nextMonthDays
    }
  }
}
</script>

<style scoped>
.data-pick-main-swap {
  width: 17.75rem;
  background-color: white;
  padding: 1rem;
  height: fit-content;
}

.header {
  width: 100%;
  color: var(--gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 .3rem;
}

.header span {
  font-weight: 600;
}

.header .mini-icon {
  padding: .1rem;
  color: var(--gray);
  transition: background-color .3s;
}

.header .mini-icon:hover {
  background-color: #F3F3F3;
  color: var(--black);
  border-radius: .2rem;
}

.header .title {
  transition: background-color .3s;
  display: flex;
  align-items: flex-start;
  height: 2rem;
  width: auto;
  margin-right: -1.2rem;

}

.title span {
  margin-right: .2rem;
}

.week {
  margin-top: .5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
}

.week span {
  color: var(--black);
  font-weight: 600;
  width: 2.25rem;
  height: 1.75rem;
  font-size: .75rem;
}

.date-swap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.date {
  position: relative;
  width: 2.25rem;
}

.date-span {
  font-weight: 600;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 2rem;
  line-height: 1.65rem;
  font-size: .75rem;
  display: block;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0);
  z-index: 100;
  position: relative;
  margin: auto;
}

.current-day {
  border: 1px solid v-bind(color);
  box-sizing: border-box;
}

.gray-color {
  color: gray;
}

.date-span:hover {
  background-color: #4673D3;
  color: white;
  border-radius: 2rem;
}

.active {
  background-color: #4673D3;
  color: white;
  border-radius: 2rem;
}

.pass {
  background-color: #BBCAF2;
  color: white;
}

.date-start {
  background: linear-gradient(to right, #fff 50%, #BBCAF2 50%);
}

.date-end {
  background: linear-gradient(to right, #BBCAF2 50%, #fff 50%);
}
</style>