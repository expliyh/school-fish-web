<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="工单编号" @change="loadTicket">
      <el-input v-model="form.id"/>
    </el-form-item>
    <el-form-item label="商品编号">
      <el-input v-model="form.item_id"/>
    </el-form-item>
    <!--    <el-form-item label="Activity zone">-->
    <!--      <el-select v-model="form.region" placeholder="please select your zone">-->
    <!--        <el-option label="Zone one" value="shanghai"/>-->
    <!--        <el-option label="Zone two" value="beijing"/>-->
    <!--      </el-select>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="Activity time">-->
    <!--      <el-col :span="11">-->
    <!--        <el-date-picker-->
    <!--            v-model="form.date1"-->
    <!--            type="date"-->
    <!--            placeholder="Pick a date"-->
    <!--            style="width: 100%"-->
    <!--        />-->
    <!--      </el-col>-->
    <!--      <el-col :span="2" class="text-center">-->
    <!--        <span class="text-gray-500">-</span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="11">-->
    <!--        <el-time-picker-->
    <!--            v-model="form.date2"-->
    <!--            placeholder="Pick a time"-->
    <!--            style="width: 100%"-->
    <!--        />-->
    <!--      </el-col>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="Instant delivery">-->
    <!--      <el-switch v-model="form.delivery"/>-->
    <!--    </el-form-item>-->
    <el-form-item label="工单类型">
      <el-radio-group v-model="form.type">
        <el-radio label="维修"/>
        <el-radio label="换货换货"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="工单状态">
      <el-radio-group v-model="form.status">
        <el-radio label="等待中"/>
        <el-radio label="处理中"/>
        <el-radio label="已完成"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.desc" type="textarea"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {inject, reactive} from 'vue'
import type {AxiosResponse} from "axios";
import router from "@/router";


const global: any = inject("global")

// do not use same name with ref
const form = reactive({
  id: '',
  item_id: '',
  type: '',
  status: '',
  desc: '',
})

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
      }, (error: any) => {
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
    let data = response.data.data
    console.log(data)

  }, (error: any) => {
    alert(error.message)
  })
}
</script>