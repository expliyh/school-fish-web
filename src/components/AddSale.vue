<script setup lang="ts">
import {inject, reactive, ref} from 'vue'
import type {AxiosError, AxiosResponse} from "axios";
import router from "@/router";
import {ElMessage} from "element-plus";
import {usePrefillStore} from "@/stores/prefill";

const prefillStore = usePrefillStore()

// do not use same name with ref


const form = reactive({
  name: '',
  id: null as number | null,
  prize: 0,
  count: 0,
  model: ""
})

const prefilled = ref(false)
const auto = ref(false)

const global: any = inject("global")

function clearInput() {
  form.name = ""
  form.id = null
  form.prize = 0
  form.count = 0
  form.model = ""
  auto.value = false
}

function loadFromName() {
  console.log('load from name')
  global.axios.postForm(
      global.api_base + "/get-inventory-by-name",
      {
        "token": localStorage.token,
        "name": form.name
      }
  )
      .then((response: AxiosResponse) => {
        // 请求成功
        var data;
        if (response.status === 200) {
          // 执行操作
          console.log('请求成功');
          data = response.data.data
          form.id = data['id']
          form.prize = data['price']
          form.model = data['model']
        } else {
          // 其他状态码处理
          console.log('其他状态码处理');
        }
        auto.value = true
      })
      .catch((error: AxiosError) => {
        // 请求失败
        if (error.response) {
          // 服务器返回响应，但状态码不是2xx
          console.log('请求失败', error.response.status);
          if (error.response.status == 403) {
            router.push("/login")
          } else if (error.response.status == 404) {
            auto.value = false
            form.id = 0
            form.count = 0
            form.prize = 0
            form.model = ""
            return
          }
        } else if (error.request) {
          // 请求发送成功，但没有收到响应
          console.log('请求发送成功，但没有收到响应');
        } else {
          // 其他错误
          console.log('其他错误', error.message);
        }
        auto.value = false
      });
}

function loadFromID() {
  console.log('load from id')
  if (form.id === null) {
    clearInput()
    return
  }
  global.axios.postForm(
      global.api_base + "/get-inventory-by-id",
      {
        "token": localStorage.token,
        "id": form.id
      }
  )
      .then((response: AxiosResponse) => {
        // 请求成功
        var data;
        if (response.status === 200) {
          // 执行操作
          console.log('请求成功');
          data = response.data.data
          ElMessage({
            message: data,
            type: 'success',
          })
          form.name = data['name']
          form.prize = data['price']
          form.model = data['model']
        } else {
          // 其他状态码处理
          console.log('其他状态码处理');
        }
        auto.value = true
      })
      .catch((error: AxiosError) => {
        // 请求失败
        if (error.response) {
          // 服务器返回响应，但状态码不是2xx
          console.log('请求失败', error.response.status);
          if (error.response.status == 403) {
            router.push("/login")
          } else if (error.response.status == 404) {
            auto.value = false
            form.name = ""
            form.count = 0
            form.prize = 0
            form.model = ""
            return
          }
        } else if (error.request) {
          // 请求发送成功，但没有收到响应
          console.log('请求发送成功，但没有收到响应');
        } else {
          // 其他错误
          console.log('其他错误', error.message);
        }
        auto.value = false
      });
}

const onSubmit = () => {
  console.log('submit!')
  global.axios.postForm(
      global.api_base + "/new-sale",
      {
        "access_token": localStorage.token,
        "name": form.name,
        "item_id": form.id,
        "price": form.prize,
        "quantity": form.count,
        "model": form.model
      }
  )
      .then((response: AxiosResponse) => {
        // 请求成功
        var data;
        if (response.status === 200) {
          // 执行操作
          console.log('请求成功');
          data = response.data
          if (data['status'] != 200) {
            ElMessage({
              message: data['message'],
              type: 'error',
            })
            return
          }
          ElMessage({
            message: data['message'],
            type: 'success',
          })
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

function handlePrefill() {
  if (prefillStore.getItemId() == "") {
    return
  }
  console.log('prefill')
  form.id = prefillStore.getItemId()
  loadFromID()
  prefillStore.clear()
  prefilled.value = true
}

function cancelPrefill() {
  prefillStore.clear()
  prefilled.value = false
}

function idSetAuto() {
  form.id = null
  clearInput()
}

handlePrefill()


</script>

<template>
  <h1>销售录入</h1>
  <el-alert
      v-if="prefilled"
      title="部分数据已预装填，要更改不可用的内容请点击 取消预装填 按钮"
      center :closable="false" type="success"
      style="margin-bottom: 10px"
  ></el-alert>
  <el-form :model="form" label-width="120px">
    <el-form-item label="商品名称">
      <el-input v-model="form.name" v-model:disabled="prefilled" @change="loadFromName"/>
    </el-form-item>
    <el-form-item label="商品ID">
      <el-input-number
          v-model="form.id"
          :step-strictly="true"
          placeholder="ID"
          v-model:readonly="prefilled"
          :min="1"
          @change="loadFromID"
      />
    </el-form-item>
    <el-form-item label="单价">
      <el-input-number v-model="form.prize" :precision="2"></el-input-number>
    </el-form-item>
    <el-form-item label="数量">
      <el-input-number v-model="form.count"></el-input-number>
    </el-form-item>
    <el-form-item label="型号">
      <el-input v-model="form.model" v-model:disabled="auto"></el-input>
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
    <!--    <el-form-item label="Activity type">-->
    <!--      <el-checkbox-group v-model="form.type">-->
    <!--        <el-checkbox label="Online activities" name="type"/>-->
    <!--        <el-checkbox label="Promotion activities" name="type"/>-->
    <!--        <el-checkbox label="Offline activities" name="type"/>-->
    <!--        <el-checkbox label="Simple brand exposure" name="type"/>-->
    <!--      </el-checkbox-group>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="Resources">-->
    <!--      <el-radio-group v-model="form.resource">-->
    <!--        <el-radio label="Sponsor"/>-->
    <!--        <el-radio label="Venue"/>-->
    <!--      </el-radio-group>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="Activity form">-->
    <!--      <el-input v-model="form.desc" type="textarea"/>-->
    <!--    </el-form-item>-->
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交销售</el-button>
      <el-button v-if="prefilled" @click="cancelPrefill">取消预装填</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>