<script setup lang="ts">
import {ref} from 'vue'
import type {TabsPaneContext} from 'element-plus'
import AllOrder from "@/components/Orders/AllOrder.vue";

const activeName = ref('all')

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
    <el-tab-pane label="全部" name="all" :lazy="true"></el-tab-pane>
    <el-tab-pane label="我售出的" name="as_seller" :lazy="true"></el-tab-pane>
    <el-tab-pane label="我买到的" name="as_buyer" :lazy="true"></el-tab-pane>
    <el-tab-pane :disabled="true" label="售后中" name="warranty" :lazy="true"></el-tab-pane>
    <AllOrder v-model:filter="activeName"></AllOrder>
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