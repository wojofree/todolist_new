<template>
  <div class="card border-light mb-3 max-width-30 mg-auto  mt-5">
    <div class="card-header">修改密码</div>
    <div class="card-body">
      <el-form
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
      >
        <el-form-item label="当前密码" class="login-form">
          <el-input size="large"  show-password v-model="formLabelAlign.old_password"/>
        </el-form-item>
        <el-form-item label="新密码" class="login-form">
          <el-input size="large" show-password v-model="formLabelAlign.new_password1" type="password"/>
        </el-form-item>
        <el-form-item label="ConfirmPassword" class="login-form">
          <el-input size="large" show-password v-model="formLabelAlign.new_password2" type="password"/>
        </el-form-item>
        <el-button type="primary" size="large" style="width: 7rem;" @click="login">重置密码</el-button>
        <el-link href="/" class="register-btn" type="info">取消</el-link>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login"
}
</script>
<script setup>

import {reactive} from 'vue'
import axios from "axios";

const formLabelAlign = reactive({
  old_password: '',
  new_password1: '',
  new_password2: ''
})

function login() {
  let url = location.protocol + '//' + document.domain + ':8000' + "/api/user_register/";
  axios.post(url, formLabelAlign).then(function () {
    this.$router.push('/');
  }, function (err) {
    alert(err.response.data.msg)
  })
}
</script>

<style>
.max-width-30 {
  max-width: 30rem;
}

.mg-auto {
  margin: auto;
}

.register-btn {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  color: white;
}

.login-form .el-form-item__label {
  color: white !important;
}
</style>