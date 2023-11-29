<script setup lang="ts">
import {ref} from 'vue';
import 'element-plus/es/components/message/style/css'
import {ElMessage} from "element-plus";

// name: 'Login',

const loginForm = ref({
  username: '',
  password: '',
});

const handleSubmit = () => {
  // 这里可以进行用户名和密码的校验，然后执行登录逻辑
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('用户名和密码不能为空！')
    return;
  }
  alert('登录成功！');
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