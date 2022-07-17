<template>
<!--  <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246); box-shadow: 2px 0 6px rgba(3,32,57,0.35) ; min-height: 100%;">-->
    <el-menu :default-openeds="['1', '3']" style="min-height: 100%;overflow: hidden"
             background-color="rgb(48,65,86)"
             text-color="#fff"
             active-text-color="#CC6600"
             :collapse-transition="false"
             :collapse="isCollapse"
             router
    >
      <div style="height: 60px;line-height: 60px;text-align: center">
        <img src="../assets/logo.png" alt="" style="width: 20px;position:relative;top: 5px;margin-right: 5px"/>
        <b style="color: aquamarine"  v-show="logoTextShow">3d仓库管理系统</b>
      </div>
      <el-menu-item index="/manager/home" ><i class="el-icon-message"></i><span v-show="logoTextShow">物资详情</span></el-menu-item>
      <el-menu-item index="/manager/test" ><i class="el-icon-house"></i><span v-show="logoTextShow">3D仓库</span></el-menu-item>
      <el-submenu index="2" v-if="user.titleId===3">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/manager/user" v-show="roleCheck">用户管理</el-menu-item>
          <el-menu-item index="/manager/title" v-show="roleCheck">职称管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="user.titleId!==1">
        <template slot="title">
          <i class="el-icon-menu" ></i>
          <span slot="title">库存管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/manager/task" v-show="roleCheck">出入库作业管理</el-menu-item>
          <el-menu-item index="/manager/house" v-show="roleCheck">仓库信息管理</el-menu-item>
          <el-menu-item index="/manager/shelf" v-show="roleCheck">货架信息管理</el-menu-item>
          <el-menu-item index="/manager/bin" v-show="roleCheck">货位信息管理</el-menu-item>
          <el-menu-item index="/manager/goods" v-show="roleCheck">物品信息管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>


    </el-menu>
<!--  </el-aside>-->
</template>

<script>
export default {
  name: "Aside",
  props:{
    isCollapse: Boolean,
    logoTextShow: Boolean,
    sideWidth: Number,
    roleCheck:Boolean,
  },
  data(){
    return{
      user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  }
}
</script>

<style scoped>

</style>
