<template>
  <div style=" font-size: 12px ;border-bottom:1px solid #ccc; line-height: 60px;display: flex ">
    <div style="font-size: 18px;flex:1;">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>
    </div>
    <el-dropdown style="width:150px;cursor: pointer;text-align: right">
      <span>{{user.name}}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link to="/manager/person">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>



<script>
export default {
  name: "Header",
  data(){
    return{
      user : localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  },
  props:{
    collapseBtnClass:String,
    collapse:Function
  },
  methods:{
    logout(){
      this.$router.push("/Login");
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    }
  }
}
</script>

<style scoped>

</style>
