<script setup lang="ts">
import {
  UserFilled,
  HomeFilled,
  Menu as IconMenu,
  GoodsFilled,
  Setting,
  WalletFilled,
  List,
  Loading,
  Sell,
  SoldOut,
  Ticket,
} from '@element-plus/icons-vue'
import router from "@/router";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function getPath() {
  return router.currentRoute.value.path
}
</script>

<template>
  <el-container>
    <el-header style="display:flex;align-items: center" height="60px">
      <h1 style="margin-left: 30px;">设备管理系统</h1>
    </el-header>
    <el-container>
      <el-aside :xs="0" :sm="2" :md="4" :lg="4" :xl="4">
        <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :default-active="getPath()"
            :router="true"
        >
          <el-menu-item index="/panel">
            <el-icon>
              <home-filled/>
            </el-icon>
            <span>用户中心</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='marketing'" index="/panel/add-proc">
            <el-icon>
              <SoldOut/>
            </el-icon>
            <span>采购录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='eng'" index="/panel/add-ticket">
            <el-icon>
              <Ticket/>
            </el-icon>
            <span>工单录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='money'" index="/panel/count">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>数据统计</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='marketing'" index="/panel/add-sale">
            <el-icon>
              <Sell/>
            </el-icon>
            <span>销售录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='eng'" index="/panel/express">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>售后发货</span>
          </el-menu-item>
          <el-menu-item index="/panel/inventory-list">
            <el-icon>
              <List/>
            </el-icon>
            <span>库存列表</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()==='eng'||userStore.getRole()=='money'" index="/panel/ticket-list">
            <el-icon>
              <List/>
            </el-icon>
            <span>工单列表</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()==='money'||userStore.getRole()==='marketing'"
                        index="/panel/procure-list">
            <el-icon>
              <List/>
            </el-icon>
            <span>采购列表</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()==='money'||userStore.getRole()==='marketing'"
                        index="/panel/sales-list">
            <el-icon>
              <List/>
            </el-icon>
            <span>销售列表</span>
          </el-menu-item>
          <el-menu-item index="/login">
            <el-icon>
              <Loading/>
            </el-icon>
            <span>重新登陆</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <!--              <el-footer>Footer</el-footer>-->
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