<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="工单编号" @change="loadTicket">
      <el-input placeholder="自动生成" v-model:readonly="prefilled" v-model="form.id"/>
    </el-form-item>
    <el-form-item label="商品编号" required>
      <el-input v-model="form.item_id" v-model:readonly="auto" @change="loadInventory"/>
      <el-alert v-model:title="item_info_box.title" v-model:type="item_info_box.type" center :closable="false"/>
    </el-form-item>

    <el-form-item label="工单类型" required>
      <el-radio-group v-model="form.type" v-model:disabled="finished_on_server">
        <el-radio label="维修"/>
        <el-radio label="换货"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="工单状态" required>
      <el-radio-group v-model="form.status" v-model:disabled="finished_on_server">
        <el-radio label="等待中"/>
        <el-radio label="处理中"/>
        <el-radio label="已完成"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.desc" type="textarea"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{ submitText }}</el-button>
      <el-button v-if="prefilled" @click="cancelPrefill">取消预装填</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {inject, reactive, ref} from 'vue'
import type {AxiosError, AxiosResponse} from "axios";
import router from "@/router";
import {ElMessage} from "element-plus";
import {usePrefillStore} from "@/stores/prefill";

const prefillStore = usePrefillStore()
const global: any = inject("global")

const prefilled = ref(false)
const prefilled_ticket = ref(false)
const finished_on_server = ref(false)
const auto = ref(false)
const submitText = ref("录入工单")

// do not use same name with ref
const form = reactive({
  id: '',
  item_id: '',
  type: '',
  status: '',
  desc: '',
})

const inventory_info = reactive({
  name: '',
  prize: '',
  model: '',
})

const item_info_box = reactive({
  show: true,
  title: '请输入库存号进行匹配',
  type: 'info',
  message: ''
})

function isTicketFinished() {
  return form.status == '已完成'
}

function resetInput() {
  form.item_id = ''
  form.type = ''
  form.status = ''
  form.desc = ''
  inventory_info.name = ''
  inventory_info.prize = ''
  inventory_info.model = ''
  item_info_box.title = '请输入库存号进行匹配'
  item_info_box.type = 'info'
  finished_on_server.value = false
  prefilled.value = false
  prefilled_ticket.value = false
  auto.value = false
  submitText.value = '录入工单'
}

function loadInventory() {
  console.log('load from id')
  global.axios.postForm(
      global.api_base + "/get-inventory-by-id",
      {
        "token": localStorage.token,
        "id": form.item_id
      }
  )
      .then((response: AxiosResponse) => {
        // 请求成功
        var data;
        if (response.status === 200) {
          // 执行操作
          console.log('请求成功');
          data = response.data.data
          // ElMessage({
          //   message: data,
          //   type: 'success',
          // })
          inventory_info.name = data['name']
          inventory_info.prize = data['price']
          inventory_info.model = data['model']
          item_info_box.title = '库存匹配成功,库存名：' + inventory_info.name
          item_info_box.type = 'success'
        } else {
          // 其他状态码处理
          console.log('其他状态码处理');
        }
      })
      .catch((error: AxiosError) => {
        // 请求失败
        if (error.response) {
          // 服务器返回响应，但状态码不是2xx
          console.log('请求失败', error.response.status);
          if (error.response.status == 403) {
            router.push("/login")
          } else if (error.response.status == 404) {
            return
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

function loadTicket() {
  global.axios.postForm(
      global.api_base + "/get-ticket",
      {
        "access_token": localStorage.token,
        "id": form.id,
      }
  ).then((response: AxiosResponse<any>) => {
        let data = response.data.data
        console.log(data)
        form.item_id = data['item_id']
        form.type = data['type']
        form.status = data['status']
        form.desc = data['desc']
        loadInventory()
        if (data['status'] == '已完成') {
          finished_on_server.value = true
        }
        auto.value = true
        submitText.value = '修改工单'
      }, (error: any) => {
        if (error.response.status == 403) {
          router.push("/login")
        } else if (error.response.status == 404) {
          if (auto.value) {
            resetInput()
          }
          return
        }
      }
  )
}

const onSubmit = () => {
  console.log('submit!')
  global.axios.postForm(
      global.api_base + "/add-ticket",
      {
        "access_token": localStorage.token,
        "item_id": form.item_id,
        "type": form.type,
        "status": form.status,
        "desc": form.desc,
        "ticket_id": form.id
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    console.log(data)
    ElMessage.success(data['message'])
    form.id = data['id']
    loadTicket()
  }, (error: any) => {
    alert(error.message)
  })
}


function handlePrefill() {
  if (prefillStore.getItemId() != "") {
    console.log('prefill')
    form.item_id = prefillStore.getItemId()
    loadInventory()
    prefillStore.clear()
    prefilled.value = true
  }
  if (prefillStore.getTicketId() != "") {
    console.log('prefill')
    form.id = prefillStore.getTicketId()
    loadTicket()
    prefillStore.clear()
    prefilled.value = true
    prefilled_ticket.value = true
  }
}

function cancelPrefill() {
  prefillStore.clear()
  prefilled.value = false
}

handlePrefill()

</script>