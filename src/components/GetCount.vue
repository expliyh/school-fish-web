<script setup lang="ts">
import {inject, ref} from 'vue'

import {InfoFilled} from "@element-plus/icons-vue";

const global: any = inject("global")

const time_select = ref<[Date, Date]>([
  new Date(1970, 11, 11, 0, 0),
  new Date(),
])

const shortcuts = [
  {
    text: '七日内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '三十日内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '九十日内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '365日内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setSeconds(0)
      start.setMinutes(0)
      start.setHours(0)
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setSeconds(0)
      start.setMinutes(0)
      start.setHours(0)
      start.setDate(1)
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '今年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setSeconds(0)
      start.setMinutes(0)
      start.setHours(0)
      start.setDate(1)
      start.setMonth(0)
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date(1970, 11, 11, 0, 0)
      return [start, end]
    },
  },
]


const count = ref({
  'sales_count': 'Undefined',
  'sales_money_count': 'Undefined',
  'procure_count': 'Undefined',
  'procure_money_count': 'Undefined',
  'ticket_count': 'Undefined',
  'inventory_count': 'Undefined'
})

function get_count() {
  const api_link = global.api_base + "/get-count"
  global.axios.postForm(
      api_link,
      {
        "access_token": localStorage.token,
        "start": Math.round(time_select.value[0].getTime() / 1000),
        "end": Math.round(time_select.value[1].getTime() / 1000)
      }
  ).then((response: any) => {
    let data = response.data
    if (data['status'] != 200) {
      return
    }
    count.value = data['data']
  })
}

get_count()

</script>

<template>
  <el-row style="margin-bottom: 20px">
    <el-col :span="2">
      <el-text>选择统计日期</el-text>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="3">
      <el-date-picker
          v-model="time_select"
          type="datetimerange"
          :shortcuts="shortcuts"
          @change="get_count"
      />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-statistic title="当前货物数" v-model:value="count.inventory_count"/>
    </el-col>
    <el-col :span="4">
      <el-statistic v-model:value="count.procure_count">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            当前采购数
          </div>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="4">
      <el-statistic title="采购总金额" v-model:value="count.procure_money_count"/>
    </el-col>
    <el-col :span="4">
      <el-statistic title="当前销售单数" v-model:value="count.sales_count"></el-statistic>
    </el-col>
    <el-col :span="4">
      <el-statistic title="销售总金额" v-model:value="count.sales_money_count"></el-statistic>
    </el-col>
    <el-col :span="4">
      <el-statistic title="当前工单数" v-model:value="count.ticket_count"></el-statistic>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>