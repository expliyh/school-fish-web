<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import router from "@/router";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

if (localStorage.token == null) {
  router.push("/login")
}


</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>

<style scoped>

</style>
