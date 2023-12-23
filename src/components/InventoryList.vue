<script setup lang="ts">

import {InfoFilled} from "@element-plus/icons-vue";
import {reactive, inject} from "vue";

const page = reactive(
    {
      currentPage: 1,
      pageSize: 10,
      item_count: 0
    }
)

const tableData = reactive([])

const global: any = inject("global")

function loadData() {
  const api_link = global.api_base + "/inventory-list"
  global.axios.postForm(
      api_link,
      {
        "token": localStorage.token,
        "page": page.currentPage,
        "page_size": page.pageSize
      }
  ).then((response: any) => {
    let data = response.data
    if (data['status'] != 200) {
      return
    }
    tableData.splice(0, tableData.length)
    tableData.push(...data['data'])
    page.item_count = data['item_count']
  })
}
</script>

<template>
  <el-table v-model:data="tableData" height="70%" style="width: 100%">
    <el-table-column prop="item_id" label="库存号" width="180"/>
    <el-table-column prop="name" label="商品名" width="100"/>
    <el-table-column prop="price" label="商品进价" width="100"/>
    <el-table-column prop="item_name" label="商品名称" width="180"/>
    <el-table-column prop="item_count" label="库存量" width="150"/>
  </el-table>
  <div class="pagination-block">
    <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :small="false"
        :disabled="false"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="page.item_count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>

</style>