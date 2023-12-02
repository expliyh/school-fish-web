<script setup lang="ts">
import {
  UserFilled,
  HomeFilled,
  Menu as IconMenu,
  GoodsFilled,
  Setting,
  WalletFilled,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-container>
    <el-header height="60px">
      Header
    </el-header>
    <el-container>
      <el-aside :xs="0" :sm="2" :md="4" :lg="4" :xl="4">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :router="true"
        >
          <el-menu-item index="0">
            <el-icon>
              <home-filled/>
            </el-icon>
            <span>用户中心</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <user-filled/>
              </el-icon>
              <span>账户管理</span>
            </template>
            <el-menu-item index="1-1">个人信息</el-menu-item>
            <el-menu-item index="1-2">安全中心</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon>
              <goods-filled/>
            </el-icon>
            <span>我的商品</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <wallet-filled/>
              </el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="3-1" route="/panel/order">我的订单</el-menu-item>
            <el-menu-item index="3-2">我的投诉</el-menu-item>
            <el-menu-item index="3-3">找我售后</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="4">
            <el-icon>
              <setting/>
            </el-icon>
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
  <!--  <el-row class="tac">-->
  <!--    <el-col :xs="0" :sm="2" :md="4" :lg="4" :xl="4">-->

  <!--    </el-col>-->
  <!--  </el-row>-->
</template>

<style scoped>

</style>