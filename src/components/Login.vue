<script setup lang="ts">
import {inject, ref} from 'vue';
import 'element-plus/es/components/message/style/css'
import {ElMessage} from "element-plus";
import type {AxiosError, AxiosResponse} from "axios";
import {useUserStore} from "@/stores/user";
import router from "@/router";

const userStore = useUserStore()

let token = localStorage.token

// name: 'Login',

const loginForm = ref({
  username: '',
  password: '',
});

const global: any = inject("global")

const handleSubmit = () => {
  // 这里可以进行用户名和密码的校验，然后执行登录逻辑
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('用户名和密码不能为空！')
    return;
  }
  global.axios.postForm(
      global.api_base + "/login",
      {
        "username": loginForm.value.username,
        "password": loginForm.value.password
      }
  ).then((response: AxiosResponse<any>) => {
        let data = response.data
        if (data['status'] != 200) {
          ElMessage({
            message: data['message'],
            type: 'error',
          })
          return
        }
        userStore.setRole(data['role'])
        userStore.setAccessToken(data['access_token'])
        userStore.setUsername(data['username'])
        localStorage.token = data['access_token']
        router.push("/panel")
        ElMessage.success('登录成功！')
      }
  ).catch((error: AxiosError) => {
    // 请求失败
    if (error.response) {
      // 服务器返回响应，但状态码不是2xx
      console.log('请求失败', error.response.status);
      if (error.response.status == 403) {
        ElMessage.error("Forbidden: 用户名或密码错误")
      } else if (error.response.status == 404) {
        return
      } else if (error.response.status == 500) {
        ElMessage.error("服务器内部错误")
      }
    } else if (error.request) {
      // 请求发送成功，但没有收到响应
      console.log('请求发送成功，但没有收到响应');
    } else {
      // 其他错误
      console.log('其他错误', error.message);
    }
  });
  // 执行登录操作，例如发起网络请求等
};

const mouse_over_login = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('Oops, this is a error message.')
  }
}
</script>

<template>
  <h2 class="form-header">登录</h2>
  <div class="input-container">
    <el-input
        v-model="loginForm.username"
        placeholder="用户名"
        autocomplete="off"
        size="large"
        @keyup.enter="handleSubmit"
        clearable
    ></el-input>
  </div>
  <div class="input-container">
    <el-input
        v-model="loginForm.password"
        placeholder="密码"
        show-password
        autocomplete="off"
        @keyup.enter="handleSubmit"
        size="large"
        clearable
    ></el-input>
  </div>
  <div class="button-container">
    <el-button class="form-button">注册</el-button>
    <el-button class="form-button" type="primary" @click="handleSubmit">登录</el-button>
  </div>
</template>

<style scoped>
.form-header {
  margin-bottom: 35px;
}

.input-container {
  margin-bottom: 35px;
  width: 90%;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-button {
  max-width: 45%;
}
</style>