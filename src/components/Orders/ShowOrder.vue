<script setup lang="ts">
import 'element-plus/es/components/message-box/style/css'
import {ref, inject} from "vue";
import type {AxiosResponse} from "axios";
import {
  valueEquals,
  ElMessage,
  ElMessageBox
} from "element-plus";


let uid = localStorage.uid
if (uid == null) {
  uid = '12345678'
  localStorage.uid = '12345678'
}

const props = defineProps({
  order_id: String
})
console.log(props.order_id)

let dict_array: any[] = []

const global: any = inject("global")

const order_props = ref(dict_array)
const order_tag_type = ref("")
const order_tag_title = ref("未定义")
const disable_pay = ref(true)
const disable_cancel = ref(true)
const disable_warranty = ref(true)
const disable_confirm = ref(true)
const confirm_message = ref("此订单不可确认收货")
const am_I_seller = ref(false)

function getOrderInfo() {
  disable_pay.value = true
  disable_cancel.value = true
  disable_warranty.value = true
  disable_confirm.value = true
  confirm_message.value = "此订单不可确认收货"
  const info_link = global.api_base + "/get_order";
  global.axios.postForm(
      info_link,
      {
        'token': '12345678',
        'order_id': props.order_id
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    let order = data['order']
    if (uid == order["sellerID"]) {
      am_I_seller.value = true
    } else if (uid == order["buyerID"]) {
      am_I_seller.value = false
    } else {
      ElMessage.error('这不是你的订单')
      disable_pay.value = true
      disable_cancel.value = true
      disable_warranty.value = true
      disable_confirm.value = true
      confirm_message.value = '这不是你的订单'
      return
    }
    switch (order["orderStatus"]) {
      case -1:
        disable_confirm.value = false
        confirm_message.value = "测试确认收货"
        disable_cancel.value = false
        order_tag_type.value = 'info'
        order_tag_title.value = '未定义'
        break
      case 0:
        if (!am_I_seller) {
          disable_confirm.value = false
          confirm_message.value = "确认线下交易完成"
          disable_cancel.value = false
          disable_pay.value = false
        }
        order_tag_type.value = ''
        order_tag_title.value = '已下单'
        break
      case 1:
        disable_confirm.value = false
        if (uid == order["sellerID"]) {
          confirm_message.value = "快递发货"
        } else if (uid == order["buyerID"]) {
          confirm_message.value = "确认收货"
        } else {
          disable_confirm.value = true
          confirm_message.value = '这不是你的订单'
        }
        disable_cancel.value = false
        order_tag_type.value = 'success'
        order_tag_title.value = '已支付'
        break
      case 2:
        if (!am_I_seller) {
          disable_confirm.value = false
          confirm_message.value = "确认收货"
        }
        order_tag_type.value = ''
        order_tag_title.value = '待收货'
        break
      case 3:
      case 5:
        disable_warranty.value = false
        order_tag_type.value = 'info'
        order_tag_title.value = '已完成'
        break
      case 4:
        disable_warranty.value = false
        order_tag_type.value = ''
        order_tag_title.value = '待评价'
        break
      case 100:
        disable_cancel.value = false
        order_tag_type.value = 'info'
        order_tag_title.value = '已关闭'
        break
      case 200:
        order_tag_type.value = 'warning'
        order_tag_title.value = '售后中'
        break
    }
    order_props.value = []
    order_props.value.push({'title': "订单号", 'value': props.order_id})
    order_props.value.push({'title': order["payDate"] == null ? "应付金额" : "实付金额", 'value': order['balance']})
    order_props.value.push({'title': "卖家", 'value': am_I_seller ? order["sellerName"] + "  (我)" : order["sellerName"]})
    order_props.value.push({'title': "买家", 'value': !am_I_seller ? order["buyerName"] + "  (我)" : order["buyerName"]})
    order_props.value.push({'title': "下单日期", 'value': order["createDate"]})
    order_props.value.push({'title': "支付日期", 'value': order["payDate"] == null ? "未支付" : order["payDate"]})
    if (order["trackingNumber"] != null) {
      order_props.value.push({'title': "快递单号", 'value': order["trackingNumber"]})
    }
  })
}

getOrderInfo()

function confirmOrder() {
  ElMessage.info("Confirm")
  if (am_I_seller.value == false || order_tag_title.value === "未定义") {
    const api_link = global.api_base + "/confirm";
    ElMessageBox.confirm(
        '确认收货后货款将直接打给卖家，如果您并未收到货物则可能无法追回钱款。',
        '你真的要确认收货吗',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      global.axios.postForm(
          api_link,
          {
            'token': '12345678',
            'order_id': props.order_id
          }
      ).then((response: AxiosResponse<any>) => {
        // 刷新页面
        getOrderInfo()
        if (response.data['status']==200){
          ElMessage.success('确认收货成功!')
        }else {
          ElMessage.error(response.data['message'])
        }
      })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消收货',
      })
    })

  } else {
    const api_link = global.api_base + "/ship";
    ElMessageBox.prompt('请输入快递单号，如线下交易请直接要求买家当场点击确认', '确认发货', {
      confirmButtonText: '发货',
      cancelButtonText: '取消',
    }).then(({value}) => {
      global.axios.postForm(
          api_link,
          {
            'token': localStorage.token,
            'order_id': props.order_id,
            'tracking_number': value
          }
      ).then((response: AxiosResponse<any>) => {
        // 刷新页面
        getOrderInfo()
      })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消发货',
      })
    })
  }

}

</script>

<template>
  <el-row gutter="20">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <el-card class="box-card">
        <template #header>
          <div class="card-header" style="display: flex">
            <span>商品快照</span>
            <el-button class="button" text style="margin-left: 30%">商品链接</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
        <!--        <template #footer>Footer content</template>-->
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>订单信息</span>
            <el-space wrap style="margin-left: 40%">
              <el-button class="button" text v-model:disabled="disable_pay">支付</el-button>
              <el-button class="button" text v-model:disabled="disable_cancel">取消</el-button>
              <el-button class="button" text v-model:disabled="disable_warranty">售后</el-button>
              <el-button text v-model:disabled="disable_confirm" @click="confirmOrder()">{{
                  confirm_message
                }}
              </el-button>
            </el-space>
          </div>
        </template>
        <!--        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>-->
        <!--        <template #footer>Footer content</template>-->
        <el-row style="width: 100%" justify="start">
          <el-col :span="12">
            订单状态
          </el-col>
          <el-col :span="12">
            <el-tag
                :type="order_tag_type"
                disable-transitions
            >{{ order_tag_title }}
            </el-tag>
          </el-col>
        </el-row>
        <div v-for="row in order_props">

          <el-row style="width: 100%" justify="start">
            <el-col :span="12">
              {{ row['title'] }}
            </el-col>
            <el-col :span="12">
              {{ row['value'] }}
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>

  </el-row>
</template>

<style scoped>

</style>