<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import router from "@/router";
import {useUserStore} from "@/stores/user";

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const userStore = useUserStore()

if (localStorage.token == null) {
  router.push("/login")
}


</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>

</style>

<style scoped>

</style>
