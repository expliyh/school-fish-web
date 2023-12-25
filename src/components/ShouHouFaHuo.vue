<script setup lang="ts">
import {reactive, ref, inject} from "vue";
import type {AxiosResponse} from "axios";
import router from "@/router";
import {ElMessage} from "element-plus";
import {usePrefillStore} from "@/stores/prefill";

const prefillStore = usePrefillStore()
const global: any = inject("global")

const prefilled = ref(false)

const form = reactive({
  id: '',
  item_id: '',
  type: '',
  status: '',
  desc: '',
})

const alert_box = reactive({
  show: true,
  title: '请输入工单号进行匹配',
  type: 'info',
  message: ''
})

const express_info = reactive({
  express_id: '',
})

const disable_submit = ref(true)

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
        alert_box.type = 'success'
        alert_box.title = '工单匹配成功'
        disable_submit.value = false
        if (data['express'] != null) {
          express_info.express_id = data['express']
          alert_box.type = 'warning'
          alert_box.title = '工单已发货, 现在提交将修改发货单号'
        }
      }, (error: any) => {
        alert_box.type = 'error'
        alert_box.title = '工单匹配失败'
        disable_submit.value = true
        if (error.response.status == 403) {
          router.push("/login")
        } else if (error.response.status == 404) {
          return
        }
      }
  )
}

const onSubmit = () => {
  console.log('submit!')
  global.axios.postForm(
      global.api_base + "/edit-express",
      {
        "access_token": localStorage.token,
        "id": form.id,
        "express": express_info.express_id,
      }
  ).then((response: AxiosResponse<any>) => {
    let data = response.data
    console.log(data)
    ElMessage.success(data['message'])
  }, (error: any) => {
    ElMessage.error(error.message)
  })
}

function handlePrefill() {
  if (prefillStore.getTicketId() == "") {
    return
  }
  console.log('prefill')
  form.id = prefillStore.getTicketId()
  loadTicket()
  prefillStore.clear()
  prefilled.value = true
}

function cancelPrefill() {
  prefillStore.clear()
  prefilled.value = false
}

handlePrefill()
</script>

<template>
  <el-alert
      v-if="prefilled"
      title="部分数据已预装填，要更改不可用的内容请点击 取消预装填 按钮"
      center :closable="false" type="success"
      style="margin-bottom: 10px"
  ></el-alert>
  <el-alert
      v-model:title="alert_box.title"
      v-model:type="alert_box.type"
      center :closable="false"
      style="margin-bottom: 10px"
  />
  <el-form :model="form" label-width="120px">
    <el-form-item label="工单编号" @change="loadTicket">
      <el-input v-model:readonly="prefilled" v-model="form.id"/>
    </el-form-item>
    <el-form-item label="快递单号">
      <el-input v-model="express_info.express_id" placeholder="请输入快递单号"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-model:disabled="disable_submit" @click="onSubmit">发货</el-button>
      <el-button v-if="prefilled" @click="cancelPrefill">取消预装填</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>