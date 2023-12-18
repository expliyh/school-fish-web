<script setup lang="ts">
import {inject, ref, watch} from 'vue'
import type {AxiosResponse} from "axios";
import {
  InfoFilled
} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
const token = localStorage.token

const global: any = inject("global")

const props = defineProps({
  filter: String
})

let uid = localStorage.uid
if (uid == null) {
  uid = '12345678'
  localStorage.uid = '12345678'
}

let tp: any[] = []
const tableData = ref(tp)
const currentPage = ref(1)

const pageSize = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const item_count = ref(0)

watch(
    () => props.filter,
    value => {
      reloadData(currentPage.value, pageSize.value)
    }
)

function pay(order_id: String) {
  const api_link = global.api_base + "/get_pay_link"
  global.axios.postForm(
      api_link,
      {
        "token": "12345678",
        "order_id": order_id
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    if (data['status'] != 200) {
      ElMessage({
        message: data['message'],
        type: 'error',
      })
      return
    }
    window.open(data["payLink"], '_blank')
  })
}

function cancel(order_id: String) {
  const api_link = global.api_base + "/cancel"
  global.axios.postForm(
      api_link,
      {
        "token": "12345678",
        "order_id": order_id
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    if (data['status'] != 200) {
      ElMessage({
        message: data['message'],
        type: 'error',
      })
      return
    }
  })
}

function getStatusTag(status: number) {
  switch (status) {
    case -1:
      return {'type': 'info', 'info': '未定义'}
    case 0:
      return {'type': '', 'info': '已下单'}
    case 1:
      return {'type': 'success', 'info': '已支付'}
    case 2:
      return {'type': '', 'info': '待收货'}
    case 3:
    case 5:
      return {'type': 'info', 'info': '已完成'}
    case 4:
      return {'type': '', 'info': '待评价'}
    case 100:
      return {'type': 'info', 'info': '已关闭'}
    case 200:
      return {'type': 'warning', 'info': '售后中'}
  }
}

function getOperateLink(status: number, order_id: string) {
  const order_link = "/panel/vieworder/" + encodeURIComponent(order_id);
  let ret = {
    'order_link': order_link,
    'enable_pay': true,
    'enable_cancel': true
  }
  if (status == 0) {
    ret['enable_pay'] = false
  }
  if (status == -1 || status == 0 || status == 1) {
    ret['enable_cancel'] = false
  }
  console.log(status)
  return ret
}

function reloadData(page_count: number, per_page: number) {
  let api_url
  api_url = global.api_base + "/get_sales_page";
  let data
  console.log(api_url)
  global.axios.postForm(
      api_url,
      {
        "token": userStore.accessToken,
        "filter": props.filter,
        "page_count": currentPage.value,
        "per_page": pageSize.value
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    tableData.value = []
    item_count.value = data["record_num"]
    data["orders"].forEach((val: any, idx: any, array: any) => {
      tableData.value.push({
        "operations": getOperateLink(val["orderStatus"], val["orderID"]),
        "order_id": val["orderID"],
        "type": "Item",
        "balance": val['balance'],
        "item_name": val['itemName'],
        "trader": uid === val["sellerID"] ? val["buyerName"] : val["sellerName"],
        "create_date": val['createDate'],
        "pay_date": (val["payDate"] == null) ? "未知" : val["payDate"],
        "status": getStatusTag(val["orderStatus"])
      })
    })
  }, (error: any) => {
    alert(error.message)
  })
}

reloadData(currentPage.value, pageSize.value)

const handleSizeChange = (val: number) => {
  reloadData(currentPage.value, pageSize.value)
}
const handleCurrentChange = (val: number) => {
  reloadData(currentPage.value, pageSize.value)
}
</script>

<template>
  <el-table v-model:data="tableData" height="70%" style="width: 100%">
    <el-table-column fixed="left" prop="operations" label="操作" width="120">
      <template #default="scope">
        <el-link type="primary" v-model:href="scope.row.operations['order_link']">查看</el-link>
        <el-link :disabled="scope.row.operations['enable_pay']" @click="pay(scope.row.order_id)" type="primary">支付
        </el-link>

        <el-popconfirm
            width="220"
            confirm-button-text="确认"
            cancel-button-text="不确认"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="你确认要取消此交易吗?"
            :disabled="scope.row.operations['enable_cancel']"
            @confirm="cancel(scope.row.order_id)"
        >
          <template #reference>
            <el-link v-model:disabled="scope.row.operations['enable_cancel']" type="primary">取消
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column prop="order_id" label="订单号" width="180"/>
    <el-table-column prop="balance" label="订单金额" width="100"/>
    <el-table-column prop="item_name" label="商品名称" width="180"/>
    <el-table-column prop="create_date" label="创建时间" width="150"/>
  </el-table>
  <div class="pagination-block">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="item_count"
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