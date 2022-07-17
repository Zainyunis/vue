<template>
    <el-container style="min-height: 100vh">

      <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246); box-shadow: 2px 0 6px rgba(3,32,57,0.35) ; min-height: 100%;">
        <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" :roleCheck="roleCheck"/>
      </el-aside>

      <el-container>
        <el-header id="header">
          <Header :collapse="collapse" :collapseBtnClass="collapseBtnClass"/>
        </el-header>
        <el-main  id="el-main" :style="{left:sideWidth+'px'}">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import Aside from "./Aside";
import Header from "./Header";
import ElementUI from "_element-ui@2.15.9@element-ui";

export default {
  name: "Home",
  components: {Header, Aside},
  data() {
    return {
      collapseBtnClass:'el-icon-s-fold',
      isCollapse:false,
      sideWidth:200,
      logoTextShow:true,
      roleCheck:false
    }
  },
  created() {
    let roleId = JSON.parse(localStorage.getItem("user")).titleId;
    //console.log(roleId);
    if(roleId!==1){
      this.roleCheck=true;
    }

  },
  methods:{
    //点击收缩按钮触发
    collapse(){
      this.isCollapse=!this.isCollapse;
      if(this.isCollapse){//收缩
        this.sideWidth=64;
        this.collapseBtnClass='el-icon-s-unfold';
        this.logoTextShow=false;
      }else{//展开
        this.sideWidth=200;
        this.collapseBtnClass='el-icon-s-fold';
        this.logoTextShow=true;
      }
    }
  }
}
</script>

<style>
#header{
  position: relative;
  width: 100%;
  height: 60px;
}
#el-main{
  position: absolute;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>

