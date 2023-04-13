<template>
  <!--  导航栏-->
  <NavbarView @search="handleSearch" @open_modal="addTaskModal"></NavbarView>
  <!--  body-->
  <div class="swap">
    <!--    左侧分类-->
    <ul class="list-group left width-15">
      <li class="list-group-item d-flex justify-content-between align-items-center pad-right-1 cursor1 padding"
          v-for="category in category_list"
          :class="{active: isActive === category.id}"
          @click="getTask(category)"
          @mouseenter="isMouseOverName = category.name, isMouseOverID = category.id"
          @mouseleave="isMouseOverName = false, isMouseOverID= false">
        <span :class="{'disp_none': edit_id===category.id}">{{ category.name }}</span>
        <el-input size="large" class="width-20 cate_input disp_none" :ref="'edit'+category.id" v-model="category.name"
                  :suffix-icon="EditPen"
                  @keyup.enter.native="updateCategory(category)" :class="{'disp_block': edit_id===category.id}"
        />
        <button type="button" class="btn1-write disp_none"
                :class="{'disp_block': isMouseOverID === category.id && !['全部任务', '已完成'].includes(isMouseOverName)}"
                @click="updateCategoryClick(category)"></button>
        <button type="button" class="btn1-close disp_none"
                :class="{'disp_block': isMouseOverID === category.id && !['全部任务', '已完成'].includes(isMouseOverName)}"
                @click="deleteCategory(category,$event)"></button>
      </li>
      <li class="list-group-item justify-content-between align-items-center cursor1 disp_none" id="add_category"
          :class="{'disp_block': isEdit}">
        <el-input size="large" class="width-20 cate_input " v-model="new_category" :suffix-icon="EditPen" ref="edit"
                  @keyup.enter.native="addCategory" @blur="isEdit = false"/>
      </li>
      <li class="list-group-item justify-content-between align-items-center cursor1" id="add_category"
          @click="addCategoryClick">
        +
      </li>
    </ul>
    <!--    右侧任务-->
    <div class="bs-component marg-left-17 task_list">
      <div class="alert alert-dismissible alert-warning" id="" v-for="task in task_list"
           :style="{ borderLeft: 'solid .5rem' + task.color }"
           @mouseenter="isMouseOverID = task.id"
           @mouseleave="isMouseOverID= false"
      >
        <h4 :class="{'disp_none': task_edit_id===task.id}">{{ task.title }}</h4>
        <el-input size="large" class="task_input disp_none" :ref="'titleEdit'+task.id" v-model="task.title"
                  :prefix-icon="EditPen"
                  @keyup.enter.native="updateTask(task,'title')" :class="{'disp_block': task_edit_id===task.id}"/>
        <p class="mb-0 width-55" :class="{'disp_none': task_edit_id===task.id}">{{ task.description }}</p>
        <el-input size="large" class="task_input disp_none desc_input" :ref="'descEdit'+task.id"
                  v-model="task.description"
                  :prefix-icon="EditPen"
                  @keyup.enter.native="updateTask(task,'desc')" :class="{'disp_block': task_edit_id===task.id}"
                  @blur="task_edit_id = false"
        />
        <button type="button" class="btn-close disp_none" data-bs-dismiss="alert" @click="deleteTask(task.id)"
                :class="{'disp_block': isMouseOverID === task.id}"></button>
        <el-icon :size="20" class="btn-select btn-close disp_none"
                 :class="{'disp_block': isMouseOverID === task.id && isTotal !== task.category[0]}" @click="finshTask(task)"><Select/></el-icon>
        <el-icon :size="20" class="btn-select btn-close disp_none"
                 :class="{'disp_block': isMouseOverID === task.id && isTotal === task.category[0]}" @click="unFinshTask(task)"><Document/></el-icon>
        <el-icon :size="20" class="btn-edit btn-close disp_none" :class="{'disp_block': isMouseOverID === task.id}"
                 @click="updateTaskClick(task)">
          <Edit/>
        </el-icon>
      </div>
    </div>
  </div>
  <!--  新增任务弹窗-->
  <el-dialog v-model="visible" :show-close="true" width="50rem">
    <template #header="{}">
      <div class="my-header">
        <h4>新增任务</h4>
      </div>
    </template>
    <el-form :rules="addTaskRule" ref="addTaskForm" label-position="right" label-width="4rem" :model="new_task">
      <el-form-item label="标题" prop="title">
        <el-input size="large" v-model="new_task.title"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input size="large" v-model="new_task.description"/>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="new_task.category" placeholder="全部任务" size="large">
          <el-option v-for="item in category_list" :label=item.name :value=item.id />
        </el-select>
      </el-form-item>
      <el-form-item label="颜色" class="color_swap">
        <div class="color_select" v-for="item in color_list" :style="{ backgroundColor: item }"
             :class="{active:colorActive === item}" @click="colorActive = item, new_task.color = item"></div>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="large" style="width: 7rem;" @click="add_task()" color="#e83283">新增任务</el-button>
  </el-dialog>
</template>

<script>
import {apiHttpClient} from '@/app/app.service';

export default {
  data() {
    return {
      category_list: [{"id": 0, "name": "全部任务"}],
      isActive: '',
      task_list: [],
      isMouseOverName: '',
      isMouseOverID: '',
      new_category: '',
      new_task: {},
      isEdit: false,
      edit_id: '',
      isTotal: '',
      task_edit_id: '',
      visible: false,
      color_list: ["#ffc107", "#fd7e14", "#41d7a7", "#39cbfb", "#e9e9e8", "#e83283", "#212529", "#007FFF", "#F0F4F8", "#F0EAD6"],
      colorActive: '',
      addTaskRule: {
        title: [{required: true, message: '请输入标题', trigger: 'change'}],
      }
    };
  },
  // 表单规则校验
  created() {
    // 获取内容列表数据
    this.getCategory();
  },
  // inject: ["reload"],
  methods: {
    // 获取所有分类
    getCategory() {
      let url = "/api/get_all_category/";
      apiHttpClient.get(url).then((response) => {
        let data = response.data.results
        data.sort((a, b) => b.id - a.id)
        for (const item of data) {
          if (item.name === '全部任务') {
            this.category_list[0].id = item.id
            this.getTask({"id": item.id, "name": item.name})
            this.new_task.category = item.id
          } else if (item.name === '已完成') {
            this.category_list = this.category_list.concat(item)
            this.isTotal = item.id
          } else {
            this.category_list = this.category_list.concat(item)
          }
        }
      })
    },
    // 获取对应任务
    getTask(category) {
      this.isActive = category.id;
      let url = "/api/get_tasks/";
      apiHttpClient.post(url, {"category_id": category.id, "category_name": category.name}).then((response) => {
        this.task_list = response.data.results
        this.task_list.sort((a, b) => b.id - a.id)
      })
    },
    // 发起新增
    addCategoryClick() {
      this.isEdit = true
      this.$refs.edit.focus()

    },
    // 新增分类接口
    addCategory() {
      let url = "/api/create_category/"
      apiHttpClient.post(url, {'name': this.new_category}).then((response) => {
        this.isEdit = false
        this.new_category = ''
        this.category_list.push(response.data.results)
      })
    },
    // 发起修改分类
    updateCategoryClick(category) {
      this.edit_id = category.id
      this.$refs[`edit${category.id}`][0].focus()
    },
    // 修改分类接口
    updateCategory(category) {
      let url = "/api/update_category/"
      apiHttpClient.post(url, {"name": category.name, "category_id": category.id}).then(() => {
        this.edit_id = ''

      })
    },
    // 删除分类
    deleteCategory(category, e) {
      let that = e.currentTarget.parentElement
      let url = "/api/delete_category/"
      apiHttpClient.post(url, {"category_id": category.id}).then(() => {
        that.remove()
      })
    },
    // 搜索
    handleSearch(searchText) {
      let url = "/api/search/"
      apiHttpClient.post(url, {"words": searchText}).then((response) => {
        this.task_list = response.data.results
        this.task_list.sort((a, b) => b.id - a.id)
      })
    },
    // 打开添加任务弹窗
    addTaskModal() {
      this.visible = true
    },
    // 新增任务
    add_task() {
      this.$refs.addTaskForm.validate((valid, message) => {
        if (valid) { // 如果校验通过则提交
          let url = "/api/create_task/"
          let data = {
            "title": this.new_task.title,
            "description": this.new_task.description,
            "category_id": this.new_task.category,
            "color": this.new_task.color
          }
          apiHttpClient.post(url, data).then((response) => {
            this.visible = false
            this.task_list.unshift(response.data.results)
            this.task_list.sort((a, b) => b.id - a.id)
          })
        } else { // 校验不通过// 取第一个不通过的信息对象提示即可// this.$message.info(message[Object.keys(message)[0]].message);
        }
      })
    },
    // 删除任务
    deleteTask(task_id) {
      let url = "/api/delete_tasks/"
      apiHttpClient.post(url, {"task_id": task_id})
    },
    // 完成任务
    finshTask(task) {
      let url = "api/update_task/"
      apiHttpClient.post(url, {"completed": "True", "title": task.title, "task_id": task.id}).then(() => {
        for (const i in this.task_list) {
          if (this.task_list[i].id === task.id) {
            this.task_list.splice(i, 1)
          }
        }
      })
    },
    unFinshTask(task) {
      let url = "api/update_task/"
      apiHttpClient.post(url, {"completed": "False", "title": task.title, "task_id": task.id}).then(() => {
        for (const i in this.task_list) {
          if (this.task_list[i].id === task.id) {
            this.task_list.splice(i, 1)
          }
        }
      })
    },
    // 修改任务
    updateTask(task) {
      let url = "/api/update_task/"
      apiHttpClient.post(url, {"title": task.title, "task_id": task.id, "description": task.description}).then(() => {
        this.task_edit_id = ''
      })
    },
    // 修改任务状态
    updateTaskClick(task) {
      this.task_edit_id = task.id
      this.$refs[`titleEdit${task.id}`][0].focus()
    },

  },
}
</script>
<script setup>
import {EditPen, Edit, Select, Document} from '@element-plus/icons-vue'
import NavbarView from "@/views/NavbarView";

</script>
<style>
.task_input {
  text-align: left;
  height: 1.8rem;
  margin-bottom: 1rem;
}

.task_input .el-input__prefix {
  color: white;
}

.desc_input {
  height: 1.5rem;
  margin-bottom: 0;
}

.task_input .el-input__wrapper {
  width: 80%;
  background: none;
  color: white;
  border: none;
  box-shadow: none;
  padding: 0;
}

.task_list .el-input--large {
  line-height: 100%;
}

.task_input .el-input__inner {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  height: 1.8rem;
}

.desc_input .el-input__inner {
  color: white;
  font-size: 1rem;
  font-weight: 400;
  height: 1.5rem;
}
</style>
<style scoped>
.swap {
  margin: 2rem auto;
  max-width: 80rem;
  align-items: flex-start;
  display: flex;
  flex-direction: row;
}

.width-15 {
  width: 15rem;
}

.width-55 {
  width: 55rem;
}

.marg-left-17 {
  margin-left: 1rem;
}

.alert h4, p {
  text-align: left;
}

.btn1-write {
  box-sizing: content-box;
  width: 1.5em;
  height: 1em;
  padding: .25em .25em;
  color: #fff;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-5 0 23 16    ' fill='%23fff'%3e%3cpath d='M12.5067 12.8406C12.4604 12.9124 12.3966 12.9714 12.3214 13.0119C12.2461 13.0524 12.1618 13.0731 12.0764 13.0722H0.907912C0.822457 13.0731 0.73816 13.0524 0.662904 13.0119C0.587648 12.9714 0.523892 12.9124 0.4776 12.8406C0.434009 12.7711 0.410889 12.6906 0.410889 12.6086C0.410889 12.5265 0.434009 12.4461 0.4776 12.3765C0.523381 12.304 0.586928 12.2442 0.662229 12.2031C0.737529 12.1619 0.822091 12.1406 0.907912 12.1412H12.0754C12.1609 12.1402 12.2452 12.1609 12.3205 12.2014C12.3958 12.2419 12.4595 12.3009 12.5057 12.3728C12.5504 12.4426 12.5743 12.5237 12.5744 12.6066C12.5746 12.6894 12.5511 12.7706 12.5067 12.8406ZM6.81322 9.22092C6.29218 9.69611 5.63758 9.99951 4.93823 10.09L3.72697 10.1912C3.1401 10.239 2.8176 10.2662 2.75666 10.2662C2.63205 10.2661 2.5125 10.2169 2.42385 10.1294C2.26541 9.97186 2.26541 9.97186 2.3601 8.82904L2.46135 7.61967C2.55214 6.92022 2.85587 6.26562 3.33135 5.74467L7.78635 1.29436C8.05301 1.04148 8.40651 0.900513 8.77401 0.900513C9.14151 0.900513 9.495 1.04148 9.76166 1.29436L11.2682 2.79998C11.5288 3.06131 11.6752 3.4153 11.6752 3.78436C11.6752 4.15341 11.5288 4.50741 11.2682 4.76873L6.81322 9.22092ZM10.6092 3.45529L9.10166 1.94967C9.01404 1.86378 8.89623 1.81567 8.77354 1.81567C8.65084 1.81567 8.53304 1.86378 8.44541 1.94967L3.99229 6.39904C3.66975 6.7625 3.46111 7.2127 3.39229 7.69373L3.2901 8.90217L3.25822 9.29404L3.6501 9.26217L4.86135 9.16092C5.34227 9.09172 5.79237 8.88313 6.15604 8.56092L10.6101 4.11154C10.6957 4.02368 10.7435 3.90573 10.7432 3.78304C10.7428 3.66034 10.6944 3.54267 10.6082 3.45529H10.6092Z'/%3e%3c/svg%3e") center/2em auto no-repeat;
  border: 0;
  border-radius: .5rem;
  opacity: .5
}

.btn1-write:hover {
  color: #fff;
  text-decoration: none;
  opacity: .75
}

.btn1-write:focus {
  outline: 0;
  box-shadow: 0 0 0 .25rem rgba(232, 50, 131, .25);
  opacity: 1
}

.btn1-write.disabled, .btn-write:disabled {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  opacity: .25
}

.btn1-write-white {
  filter: invert(1) grayscale(100%) brightness(200%)
}

.btn1-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: .25em .25em;
  color: #fff;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
  border: 0;
  border-radius: .5rem;
  opacity: .5
}

.padding {
  padding: 1rem 1rem 1rem 2rem;
}

.padding span {
  width: 15rem;
  text-align: left;
  flex: 80;
}

.disp_none {
  display: none;
}

.disp_block {
  display: block;
}

.cate_input {
  background: rgba(0, 0, 0, 0);
}

.color_select {
  width: 8rem;
  height: 2.5rem;
  margin: 0 .8rem .8rem 0;
  cursor: pointer;
}

.color_swap .active {
  border: solid #ffffff;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}


.alert-dismissible .btn-edit {
  position: absolute;
  background: none;
  top: 35%;
  right: 2.7rem;
}

.alert-dismissible .btn-select {
  position: absolute;
  background: none;
  top: 35%;
  right: 4.5rem;
}


</style>