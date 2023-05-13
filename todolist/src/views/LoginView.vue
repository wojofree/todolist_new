<template>
  <NavbarView></NavbarView>
  <div class="card border-light mb-3 max-width-30 mg-auto mt-5">
    <div class="card-header">登陆</div>
    <div class="card-body">
      <el-form
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
      >
        <el-form-item label="username" class="login-form">
          <el-input size="large" v-model="formLabelAlign.username"/>
        </el-form-item>
        <el-form-item label="password" class="login-form">
          <el-input size="large" show-password v-model="formLabelAlign.password" type="password"/>
        </el-form-item>
        <el-button type="primary" size="large" style="width: 7rem;" @click="login">登陆</el-button>
        <el-link href="/register" class="register-btn" type="info">注册</el-link>
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
import NavbarView from "@/components/NavbarView";

const formLabelAlign = reactive({
  username: '',
  password: ''
})

function login() {
  let url = "/api/user_login/";
  apiHttpClient.post(url, formLabelAlign).then(function () {
    window.location.href = "/"
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