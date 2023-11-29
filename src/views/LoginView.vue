<script setup lang="ts">
import Login from "@/components/Login.vue";
</script>

<template>
  <el-row justify="center" align="middle" style="height: 100%;margin: 0;padding: 0">
    <el-col class="login-container" style="align-items: center;" :xs="18" :sm="12" :md="8" :lg="6" :xl="4">
      <Login></Login>
    </el-col>
  </el-row>
</template>

<style>
#app, body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.login-container {
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>