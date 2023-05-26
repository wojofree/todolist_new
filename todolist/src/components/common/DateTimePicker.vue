<template>
  <div class="datepick-swap" ref="dateMain">
    <div class="date-header" @click="handleShowDate" ref="dateHeader">
      <slot/>
    </div>
    <div class="date-main" :class="{'vsb-hidden':!showDatePick}">
      <div class="triangle"></div>
      <div class="date-picker">
        <div class="date-title">
          <div class="start-input">
            <div class="start-date" @click="addStartDate" v-show="dateType === 'date'">
              <IconBase width=".75rem" height=".75rem" box-view=" 0 0 24 24">
                <Plus/>
              </IconBase>
              <span>Start date</span>
            </div>
            <input placeholder="Start date" class="date-input" v-show="dateType === 'dateRange'" v-model="inputStart"
                   @input="changeDate()" :class="{'error':isStartError}"
            >
          </div>
          <input placeholder="Due date" class="date-input" v-model="inputEnd" @input="changeDate()"
                 :class="{'error':isEndError}"
          >
        </div>
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
            <div class="date" v-for="(item) in dateList" @click="selectDays(item.date)"
                 @mouseenter="coverDate(item.date)"
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
        <div class="date-foot">
          <ToolTip content="Add time" v-show="showIcon">
            <div class="time-picker cursor">
              <IconBase box-view="0 0 32 32">
                <Clock/>
              </IconBase>
            </div>
          </ToolTip>
          <ToolTip content="Set to repeat" v-show="showIcon">
            <div class="time-picker cursor">
              <IconBase box-view="0 0 32 32">
                <Repeat/>
              </IconBase>
            </div>
          </ToolTip>
          <div class="clear cursor" @click="clearAll"> Clear all</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from "@/components/IconBase";
import {Arrow, Plus, Clock, Repeat} from "@/components/icons";
import SelectBar from "@/components/common/SelectBar";
import ToolTip from "@/components/common/ToolTip";

export default {
  name: "DatePick",
  components: {ToolTip, SelectBar, Arrow, IconBase, Plus, Clock, Repeat},
  data() {
    return {
      mainSize: ['10px', '10px'],
      position: ['rotate(45deg)', '0', 'flex-end', 'column'],
      showDatePick: false,
      isEndError: false,
      isStartError: false,
      inputStart: '',
      inputEnd: '',
      dateType: 'date',
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
      firstClick: false,
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
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    showDate: {
      type: Boolean,
      default: false
    },
    startPosition: {
      type: String,
      default:'flex-end'
    }
  },
  created() {
    this.position[2] = this.startPosition
    this.showDatePick = this.showDate
    // this.changePosition()
    this.$nextTick(() => {
      this.mainSize = [this.$refs.dateHeader.offsetWidth + 'px', this.$refs.dateHeader.offsetHeight + 'px']
      this.changePosition()
    })
    //
    this.dateType = this.type
    let now = new Date()
    // 判断是否有历史选择数据，更新样式
    this.currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 更新当前月份及title，根据开始日期来
    if (this.dateType === 'date') {
      this.inputEnd = this.modelValue
    } else {
      this.inputStart = this.modelValue[0]
      this.inputEnd = this.modelValue[1]
    }
    this.getMonthList(now)
    this.modelChange()
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
       this.$nextTick(() => {
      this.mainSize = [this.$refs.dateHeader.offsetWidth + 'px', this.$refs.dateHeader.offsetHeight + 'px']
      this.changePosition()
    })
      this.modelChange()
    },
    showDatePick(newValue) {
      if (newValue) {
        window.addEventListener('click', this.closeDate)
        setTimeout(() => {
          this.firstClick = true
        }, 40)
      } else {
        window.removeEventListener('click', this.closeDate)
      }
    }
  },
  methods: {
    closeDate(e) {
      if (this.$refs.dateMain && !this.$refs.dateMain.contains(e.target) && this.firstClick) {
        this.$emit('show',false)
        this.showDatePick = false
        this.firstClick = false
      }
    },
    handleShowDate() {
      this.showDatePick = true
      this.changePosition()
    },
    //变更位置
    changePosition() {
      const {top, right, bottom, left} = this.$refs.dateHeader.getBoundingClientRect()
      const winHeight = window.innerHeight
      const winWidth = window.innerWidth
      if (left <= 287 && this.position[2] === 'flex-end') {
        this.position[2] = 'flex-start'
      } else if (winWidth - right < 287 && this.position[2] === 'flex-start') {
        this.position[2] = 'flex-end'
      }
      if (top <= 383 && this.position[4] === 'column-reverse') {
        this.position[3] = 'column'
      } else if (winHeight - bottom < 383 && this.position[3] === 'column') {
        this.position[3] = 'column-reverse'
        this.position[0] = 'rotate(225deg)'
        this.position[1] = '-.5rem'
      }
    },
    // 添加开始日期
    addStartDate() {
      this.dateType = 'dateRange'
      this.inputStart = null
      if(this.inputEnd !== ''){
        this.emitDate(null, this.inputEnd)
      } else {
        this.emitDate(null,null)
      }
    },
    // modelValue变化时，更新样式
    modelChange() {
      this.dateType = (typeof this.modelValue === "string" || this.modelValue=== null)? 'date' : 'dateRange'
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      let date = new Date()
      // 判断是否有历史选择数据，更新样式
      if (this.dateType === 'dateRange') {
        date = this.modelValue[0] && new Date(this.modelValue[0])
        const endDate = this.modelValue[1] && new Date(this.modelValue[1])
        this.startDay = this.coverStart = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) : '';
        this.endDay = this.coverEnd = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0) : '';
        if (this.compare(this.startDay, this.endDay) || this.startDay === '') {
          this.coverEnd = this.coverStart = ''
        }
        // input框修改后，cover效果保持用
        if (this.startDay === '' && this.endDay !== '') {
          this.cover = true
          this.coverStart = this.coverEnd
          this.startDay = this.endDay
          this.endDay = ''
          this.inputStart = null
          this.inputEnd = this.startDay ? this.startDay.toLocaleDateString("zh-CN", options) : ''
        } else {
          this.inputStart = this.startDay ? this.startDay.toLocaleDateString("zh-CN", options) : ''
          this.inputEnd = this.endDay ? this.endDay.toLocaleDateString("zh-CN", options) : ''
        }
      } else if (this.dateType === 'date') {
        date = this.modelValue && new Date(this.modelValue);
        this.endDay = this.startDay = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0) : '';
        this.coverEnd = this.coverStart = ''
        this.inputEnd = this.endDay ? this.endDay.toLocaleDateString("zh-CN", options) : ''
      }
      // 更新当前月份及title，根据开始日期来
      date = (date === '' || date === null) ? new Date() : date;
      const selectDate = new Date(date.getFullYear(), date.getMonth(), 1)
      this.currentMonth = date
      this.selectedValue = {name: new Intl.DateTimeFormat('en-US', this.titleOptions).format(date), value: selectDate}
      this.getDays(this.currentMonth)
    },
    // 计算选择的日期范围，改变样式用
    coverDate(date) {
      if (this.dateType === 'dateRange' && this.cover === true) {
        if (date <= this.startDay) {
          this.coverEnd = this.startDay
          this.coverStart = date
        } else {
          this.coverStart = this.startDay
          this.coverEnd = date
        }
      }
    },
    // 确定选择日期
    selectDays(item) {
      if (this.dateType === 'date') {
        this.endDay = item
        this.emitDate(item, this.endDay)
      } else if (this.dateType === 'dateRange') {
        if (this.startDay === '') {
          this.startDay = item
          this.cover = this.endDay === '';
          this.emitDate(this.startDay, null)
        } else if (this.endDay === '') {
          this.endDay = item
          this.cover = false
        } else {
          this.startDay = item
          this.emitDate(this.startDay, null)
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
          this.emitDate(this.startDay, this.endDay)
        } else if (this.endDay >= this.startDay) {
          this.emitDate(this.startDay, this.endDay)
        }
      }
    },
    emitDate(startDayTemp, endDayTemp) {
      let endDay = endDayTemp
      let startDay = startDayTemp
      let endDateString = endDay;
      let startDateString = startDay;
      if (endDay !== null) {
        endDay = new Date(endDayTemp)
        const newEndDate = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate(), 23, 59, 59)
        endDateString = newEndDate.toLocaleString('zh-CH', this.fullOptions).replace(/\//g, '-')
      }
      if (startDay !== null) {
        startDay = new Date(startDay)
        const newStartDate = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate(), 0, 0, 0)
        startDateString = newStartDate.toLocaleString('zh-CH', this.options).replace(/\//g, '-')
      }
      if (this.dateType === 'dateRange') {
        this.$emit('update:modelValue', [startDateString, endDateString])
      } else {
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
    },
    // input变更日期
    async changeDate() {
      this.inputStart = this.inputStart || null;
      this.inputEnd = this.inputEnd || null
      let endDateIsValid = this.inputEnd !== null ? this.isValidDate(this.inputEnd) : true;
      let startDateIsValid = this.inputStart !== null ? this.isValidDate(this.inputStart) : true;
      if (endDateIsValid && startDateIsValid) {
        if (this.compareTime(this.inputStart, this.inputEnd)) {
          endDateIsValid = false
          startDateIsValid = false
        } else {
          this.emitDate(this.inputStart, this.inputEnd)
        }
        if (this.inputStart === null && this.inputEnd === null) {
          this.cover = false
        } else if (this.inputStart === null || this.inputEnd === null) {
          this.cover = true
          const date = this.inputStart === null ? this.inputEnd : this.inputStart
          this.startDay = this.coverEnd = this.coverStart = new Date(date)
        }
        this.isStartError = this.isEndError = false
      }
      this.isStartError = !startDateIsValid
      this.isEndError = !endDateIsValid
    },
    // input验证是否是日期
    isValidDate(value) {
      const dateList = value.split('/')
      if (dateList.length !== 3) {
        return false
      } else if (dateList[1] <= 0 || dateList[1] > 12) {
        return false
      } else if (dateList[2] <= 0 || dateList[1] > 31) {
        return false
      } else if (dateList[0] <= 0) {
        return false
      } else {
        return new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))
      }
    },
    // 日期比对，changeDate函数用
    compareTime(dateStart, dateEnd) {
      if (dateEnd === null || dateStart === null) {
        return false
      } else {
        return new Date(dateStart) > new Date(dateEnd)
      }
    },
    //  清除日期
    async clearAll() {
      this.emitDate(null, null)
      this.inputEnd = this.inputStart = this.startDay = this.endDay = this.coverStart = this.coverEnd = ''
      this.cover = false
    },
  }
}

// 更改时间格式
function getFormatDate(date, type) {
  const fullOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }
  const newDateTemp = new Date(date)
  let newDate;
  if (type === 'end') {
    newDate = new Date(newDateTemp.getFullYear(), newDateTemp.getMonth(), newDateTemp.getDate(), 23, 59, 59)
  } else {
    newDate = new Date(newDateTemp.getFullYear(), newDateTemp.getMonth(), newDateTemp.getDate(), 0, 0, 0)
  }
  return newDate.toLocaleString('zh-CH', fullOptions).replace(/\//g, '-')
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
  text-align: center;
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
  z-index: 100001;
  position: relative;
  margin: auto;
  text-align: center;
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

.date-picker {
  background-color: white;
  width: fit-content;
  display: flex;
  flex-direction: column;
  border: 1px solid #EDEAE9;
  border-radius: .4rem;
}

.start-date {
  font-weight: 600;
  color: var(--gray);
  display: flex;
  align-items: center;
  font-size: .875rem;
  padding: .5rem .75rem;
  border-radius: .4rem;
  transition: background-color .3s;
}

.start-date:hover {
  background-color: rgb(248, 246, 246);
}

.start-date span {
  margin-left: .2rem;
}

.date-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.2rem 0 1.2rem;
  height: 3.3rem;
}

.start-input {
  display: flex;
}

.date-input {
  background: none;
  padding: 0 0 0 .7rem;
  border-radius: .4rem;
  border: 1px solid #D0CBCB;
  width: 7.2rem;
  color: var(--black);
}

.date-input:focus {
  border: 2px solid #4673D3;
  outline: none;
}

.error {
  color: red;
}

.error:focus {
  color: red;
}

.date-foot {
  height: 3.75rem;
  padding: .75rem 1rem;
  border-top: 1px solid #EDEAE9;
  display: flex;
  align-items: center;
}

.time-picker {
  height: 100%;
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .3s;
  border-radius: .4rem;
  margin-right: .5rem;
}

.time-picker:hover {
  background-color: rgb(248, 246, 246);
}

.clear {
  margin-left: auto;
  height: 2.25rem;
  width: max-content;
  padding: 0 1rem;
  transition: background-color .3s;
  line-height: 2.25rem;
  border-radius: .4rem;
  font-weight: 500;
}

.clear:hover {
  background-color: rgb(248, 246, 246);
}


.datepick-swap {
  display: flex;
  width: v-bind(mainSize [0]);
  height: v-bind(mainSize [1]);
  flex-direction: v-bind(position [3]);
  align-items: v-bind(position [2]);
  z-index: 1000;
}

.triangle {
  width: 1rem;
  height: 1rem;
  background-color: white;
  transform: v-bind(position [0]);
  margin-bottom: -.5rem;
  margin-top: v-bind(position [1]);
  margin-right: 1rem;
  margin-left: 1rem;
  border-width: 1px 0 0 1px;
  border-style: solid;
  border-color: #EDEAE9;
  border-radius: .1rem;
}

.vsb-hidden {
  visibility: hidden;
}

.date-main {
  display: flex;
  flex-direction: v-bind(position [3]);
  align-items: v-bind(position [2]);
  margin-bottom: .6rem;
  margin-top: .2rem;
  z-index: 10000;
}
</style>