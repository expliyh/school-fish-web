<script setup lang="ts">
import {ref} from 'vue'
import type {TabsPaneContext} from 'element-plus'
import AllOrder from "@/components/Orders/AllOrder.vue";

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
      type="border-card"
  >
    <el-tab-pane label="全部" name="all">
      <AllOrder></AllOrder>
    </el-tab-pane>
    <el-tab-pane label="我售出的" name="as_seller">Config</el-tab-pane>
    <el-tab-pane label="我买到的" name="as_buyer">Role</el-tab-pane>
    <el-tab-pane label="售后中" name="warranty">Task</el-tab-pane>
  </el-tabs>
</template>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>


<style scoped>

</style>