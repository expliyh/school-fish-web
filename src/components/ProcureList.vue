<script setup lang="ts">

import {InfoFilled} from "@element-plus/icons-vue";
import {reactive, inject, ref} from "vue";
import {useUserStore} from "@/stores/user";
import {usePrefillStore} from "@/stores/prefill";
import router from "@/router";

const userStore = useUserStore()

const prefillStore = usePrefillStore()

const page = reactive(
    {
      currentPage: 1,
      pageSize: 10,
      item_count: 0
    }
)
let tp: any[] = []
const tableData = ref(tp)

const global: any = inject("global")

const listLoading = ref(false)

const role = ref("")

const filter = reactive({
  name_key: '',
  id: ''
})

function loadData() {
  listLoading.value = true
  const api_link = global.api_base + "/get-inventory-list"
  tableData.value = tp
  role.value = userStore.getRole()
  console.log(role.value)
  global.axios.postForm(
      api_link,
      {
        "access_token": localStorage.token,
        "page": page.currentPage,
        "page_size": page.pageSize
      }
  ).then((response: any) => {
        let data = response.data
        if (data['status'] != 200) {
          return
        }
        data["data"]["data"].forEach((val: any, idx: any, array: any) => {
          tableData.value.push({
            item_id: val['item_id'],
            name: val['name'],
            price: val['price'],
            item_count: val['quantity']
          })
        })
        page.item_count = parseInt(data['data']['count'])
        listLoading.value = false
      }
  )
}

function handleSizeChange() {
  return
}

function handleCurrentChange() {
  return
}

loadData()

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

</script>

<template>
  <el-table v-model:data="tableData" v-loading="listLoading" style="width: 100%">
    <el-table-column prop="item_id" label="库存号" width="180"/>
    <el-table-column prop="name" label="商品名称" width="100"/>
    <el-table-column prop="price" label="商品进价" width="100"/>
    <el-table-column prop="item_count" label="库存量" width="150"/>
    <el-table-column label="操作" width="180">
      <template #default="{row}">
        <el-button
            type="primary"
            v-if="userStore.getRole()=='marketing'"
            round plain
            @click="procure(row)">
          采购
        </el-button>
        <el-button
            type="primary"
            v-if="userStore.getRole()=='marketing'"
            round plain
            @click="sale(row)">
          销售
        </el-button>
        <el-button
            type="primary"
            v-if="userStore.getRole()=='eng'"
            round plain
            @click="addTicket(row)">
          工单录入
        </el-button>
        <el-button type="primary" v-if="userStore.getRole()=='money'" round plain>查看记录</el-button>
      </template>
    </el-table-column>
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