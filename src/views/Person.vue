<template>
  <el-card style="width: 500px; padding: 20px;">
    <div style="margin: 20px 0; text-align: center;font-size: 24px"><b>个人信息</b></div>
    <el-form :model="form" label-width="40px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.account" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-popconfirm
          class="ml-5"
          confirm-button-text='确认'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确定保存修改吗？"
          @confirm="save"
        >
          <el-button type="primary" slot="reference">保 存</el-button>
        </el-popconfirm>

      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Person",
  data(){
    return{
      form:{},
      user : localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  },
  created() {
    this.request.get("/user/account/"+this.user.account).then(res=>{
      if(res.code==='200'){
        this.form = res.data;
      }
    })
  },
  methods:{
    save(){
      this.request.post("/user",this.form).then(res=> {
        if(res.data){
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
        }else {
          this.$message.error("保存失败");
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
