<script setup lang="ts">

import {InfoFilled} from "@element-plus/icons-vue";
import {reactive, inject, ref} from "vue";
import {useUserStore} from "@/stores/user";
import {usePrefillStore} from "@/stores/prefill";
import router from "@/router";

const userStore = useUserStore()

const prefillStore = usePrefillStore()

const listLoading = ref(false)

const page = reactive(
    {
      currentPage: 1,
      pageSize: 10,
      item_count: 0
    }
)
// let tp: any[] = []
const tableData = ref([] as any[])

const global: any = inject("global")

const role = ref("")

function loadData() {
  listLoading.value = true
  const api_link = global.api_base + "/get-ticket-list"
  tableData.value = []
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
          listLoading.value = false
          return
        }
        data["data"].forEach((val: any, idx: any, array: any) => {
          tableData.value.push({
            ticket_id: val['id'],
            item_id: val['item_id'],
            type: val['type'],
            status: val['status'],
            desc: val['desc'],
            date: val['add_date'],
          })
        })
        page.item_count = parseInt(data['count'])
      }
  )
  listLoading.value = false
}

function handleSizeChange() {
  loadData()
}

function handleCurrentChange() {
  loadData()
}

loadData()

function edit(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setTicketId(row['ticket_id'])
  router.push("/panel/add-ticket")
}

function express(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setTicketId(row['ticket_id'])
  router.push("/panel/express")
}

function sale(row: any) {
  console.log(row)
  prefillStore.clear()
  prefillStore.setItemId(row['item_id'])
  router.push("/panel/add-sale")
}

</script>

<template>
  <el-table v-model:data="tableData" v-loading="listLoading" style="width: 100%">
    <el-table-column prop="ticket_id" label="工单号" width="70"/>
    <el-table-column prop="item_id" label="设备号" width="70"/>
    <el-table-column prop="type" label="工单类型" width="100"/>
    <el-table-column prop="status" label="工单状态" width="100"/>
    <el-table-column prop="date" label="创建日期" width="170"/>
    <el-table-column prop="desc" label="备注" width="150"/>
    <el-table-column label="操作" fixed="right" width="190">
      <template #default="{row}">
        <el-button
            type="primary"
            v-if="userStore.getRole()=='eng'"
            round plain
            @click="edit(row)">
          查看/修改
        </el-button>
        <el-button
            type="primary"
            v-if="userStore.getRole()=='eng'"
            round plain
            @click="express(row)">
          发货
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