<script setup lang="ts">

import {
  InfoFilled,
  Search
} from "@element-plus/icons-vue";
import {reactive, inject, ref} from "vue";
import {useUserStore} from "@/stores/user";
import {usePrefillStore} from "@/stores/prefill";
import router from "@/router";
import {ElMessage} from "element-plus";
import type {AxiosError} from "axios";

const userStore = useUserStore()

const prefillStore = usePrefillStore()

const page = reactive(
    {
      currentPage: 1,
      pageSize: 10,
      item_count: 0
    }
)

const tableData = ref([] as any[])

const global: any = inject("global")

const listLoading = ref(false)

const role = ref("")

const filter = reactive({
  name_key: '',
  id: '',
  by: ''
})

function loadData() {
  tableData.value = []
  listLoading.value = true
  const api_link = global.api_base + "/procure-list"
  role.value = userStore.getRole()
  console.log(role.value)
  let post_data = {
    "access_token": localStorage.token,
    "page": page.currentPage,
    "page_size": page.pageSize,
    "search": null as string | null,
    "search_item_id": null as string | null
  }
  if (filter.name_key != '' || filter.name_key != null) {
    if (filter.by == 'item_name') {
      post_data['search'] = filter.name_key
    } else if (filter.by == 'item_id') {
      if (isNaN(parseInt(filter.name_key))) {
        ElMessage.error("库存编号必须为数字")
        return
      }
    }
    post_data['search_item_id'] = filter.name_key
  }
  global.axios.postForm(
      api_link,
      post_data
  ).then((response: any) => {
        let data = response.data
        if (data['status'] != 200) {
          return
        }
        data["data"].forEach((val: any, idx: any, array: any) => {
          tableData.value.push({
            id: val['id'],
            item_id: val['item_id'],
            item_name: val['item_name'],
            price: val['price'] + ' 元',
            date: val['date'],
            purchaser_name: val['purchaser_name'],
            item_count: val['quantity']
          })
        })
        page.item_count = parseInt(data['count'])
        listLoading.value = false
      }
  ).catch((error: AxiosError) => {
    // 请求失败
    if (error.response) {
      // 服务器返回响应，但状态码不是2xx
      console.log('请求失败', error.response.status);
      if (error.response.status == 403) {
        router.push("/login")
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
}

function handleSizeChange() {
  loadData()
}

function handleCurrentChange() {
  loadData()
}

function procure(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setItemId(row['item_id'])
  router.push("/panel/add-proc")
}

function sale(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setItemId(row['item_id'])
  router.push("/panel/add-sale")
}

function addTicket(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setItemId(row['item_id'])
  router.push("/panel/add-ticket")
}

function handlePrefill() {
  if (prefillStore.filter.by === 'item_id') {
    filter.by = 'item_id'
    filter.name_key = prefillStore.filter.name_key
  }
  loadData()
}

handlePrefill()

function getSearchPlaceHolder() {
  if (filter.by === '') {
    return '请选择搜索目标'
  }
  if (filter.by === 'item_name') {
    return '搜索商品名称'
  } else if (filter.by === 'item_id') {
    return '搜索库存编号'
  }
}

</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-text>采购列表</el-text>
    </el-col>
    <el-col :span="9">
      <el-input
          v-model="filter.name_key"
          :placeholder="getSearchPlaceHolder()"
          :readonly="filter.by === '' || filter.by === null"
          class="input-with-select"
      >
        <template #prepend>
          <el-select v-model="filter.by" placeholder="搜索目标" style="width: 110px">
            <el-option label="商品名称" value="item_name"/>
            <el-option label="库存编号" value="item_id"/>
          </el-select>
        </template>
        <template #append>
          <el-button @click="loadData" :disabled="filter.by === ''||filter.by === null" :icon="Search"/>
        </template>
      </el-input>
    </el-col>
  </el-row>

  <el-table v-model:data="tableData" v-loading="listLoading" style="width: 100%">
    <el-table-column prop="id" label="采购单号" width="90"/>
    <el-table-column prop="purchaser_name" label="采购人" width="120"/>
    <el-table-column prop="item_name" label="设备名称" min-width="100"/>
    <el-table-column prop="item_id" label="库存编号" width="100"/>
    <el-table-column prop="price" label="设备进价" width="100"></el-table-column>
    <el-table-column prop="item_count" label="库存量" width="150"/>
    <el-table-column prop="date" label="提交时间" width="160"/>
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

.pagination-block {
  margin-top: 16px;
  margin-left: 10px;
}
</style>