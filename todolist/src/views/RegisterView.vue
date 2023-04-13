<template>
  <div class="card border-light mb-3 max-width-30 mg-auto  mt-5">
    <div class="card-header">注册</div>
    <div class="card-body">
      <el-form
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
      >
        <el-form-item label="Username" class="login-form">
          <el-input size="large" v-model="formLabelAlign.username"/>
        </el-form-item>
        <el-form-item label="Password" class="login-form">
          <el-input size="large" show-password v-model="formLabelAlign.password1" type="password"/>
        </el-form-item>
        <el-form-item label="ConfirmPassword" class="login-form">
          <el-input size="large" show-password v-model="formLabelAlign.password2" type="password"/>
        </el-form-item>
        <el-form-item label="NickName" class="login-form">
          <el-input size="large" v-model="formLabelAlign.nickname"/>
        </el-form-item>
        <el-form-item label="Mobile" class="login-form">
          <el-input size="large" v-model="formLabelAlign.mobile"/>
        </el-form-item>
        <el-button type="primary" size="large" style="width: 7rem;" @click="login">注册</el-button>
        <el-link href="/login/" class="register-btn" type="info">登陆</el-link>
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
import {apiHttpClient} from "@/app/app.service";

const formLabelAlign = reactive({
  username: '',
  password1: '',
  password2: '',
  nickname: '',
  mobile: ''
})

function login() {
  let url = "/api/user_register/";
  apiHttpClient.post(url, formLabelAlign).then(function () {
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