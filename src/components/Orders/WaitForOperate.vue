<template>
  <el-table v-model:data="tableData" style="width: 100%">
    <el-table-column prop="status" label="订单状态" width="80">
      <template #default="scope">
        <el-tag
            :type="scope.row.status['type']"
            disable-transitions
        >{{ scope.row.status['info'] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="orderID" label="订单编号"></el-table-column>
    <el-table-column prop="itemName" label="商品名称"></el-table-column>
    <el-table-column prop="buyerName" label="交易对象"></el-table-column>
    <el-table-column prop="balance" label="实付金额"></el-table-column>
    <el-table-column prop="payDate" label="付款日期"></el-table-column>
    <el-table-column>
      <template #header>
        <span>操作</span>
      </template>
      <template #default="scope">
        <el-button type="primary" size="small" @click="operate(scope.row.order_id,scope.row.oper_type)">
          {{ scope.row.oper_name }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {ref, onMounted, inject} from 'vue';
import axios from 'axios';
import {ElMessageBox} from 'element-plus'

const orders = ref([]);

const tableData = ref([]);


const global: any = inject("global")

onMounted(async () => {
  try {
    const response = await axios.postForm(
        global.api_base + '/wait_for_ship',
        {
          'token': '12345678'
        }
    );
    orders.value = response.data['orders'];
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
});

function operate(order, oper_type) {
  // Send request to backend to update the order status to 'shipped'
  try {
    const trackingNumber = ElMessageBox.prompt('请输入快递单号', '发货确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    });

    if (trackingNumber.value) {
      // 发起发货请求到后端，附上快递单号
      axios.post(
          global.api_base + `/ship`,
          {
            'token': '12345678',
            'track_number': trackingNumber.value
          });
    }
  } catch (error) {
    if (error === 'cancel') {
      console.log('用户取消了发货操作');
    } else {
      console.error('Error shipping order:', error);
    }
  }
}


</script>
