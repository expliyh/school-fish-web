<script setup lang="ts">
import {
  UserFilled,
  HomeFilled,
  Menu as IconMenu,
  GoodsFilled,
  Setting,
  WalletFilled,
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
          <el-menu-item index="0" route="/panel">
            <el-icon>
              <home-filled/>
            </el-icon>
            <span>用户中心</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='marketing'" index="1" route="/panel/add-proc">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>采购录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='eng'" index="1" route="/panel/add-ticket">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>工单录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='marketing'" index="2" route="/panel/add-sale">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>销售录入</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.getRole()=='eng'" index="2" route="/panel/add-sale">
            <el-icon>
              <user-filled/>
            </el-icon>
            <span>售后发货</span>
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