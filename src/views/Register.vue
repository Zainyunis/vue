<template>
  <div class="wrapper">
    <div class="method">
      <div class="card">
        <div style="margin: 20px 0; text-align: center;font-size: 24px"><b>注册</b></div>
        <el-form ref="AccountForm" :model="user" :rules="rules">
          <el-form-item prop="account">
            <el-input size="medium" class="mg10" prefix-icon="el-icon-user" v-model="user.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input size="medium" class="mg10" prefix-icon="el-icon-s-custom" placeholder="请输入用户名" v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input size="medium" class="mg10" prefix-icon="el-icon-lock" v-model="user.password" placeholder="请设置密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="apassword">
            <el-input size="medium" class="mg10" prefix-icon="el-icon-lock" v-model="user.apassword" placeholder="请确认密码" show-password></el-input>
          </el-form-item>

          <!--        <div style="margin: 10px 0;text-align: center">-->
          <el-form-item style="margin: 10px 0;text-align: center">
            <el-button type="primary" size="small" autocomplete="off" @click="handleRegister">注册</el-button>
            <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/Login')">返回登录</el-button>
          </el-form-item>
          <!--        </div>-->
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Register",
  data(){
    return{
      user:{},
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min:3,max:11,message: '长度在3-11字符',trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min:3,max:16,message: '长度在3-16字符',trigger: 'blur'}
        ],
        apassword: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {min:3,max:16,message: '长度在3-16字符',trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    handleRegister(){
      this.$refs.AccountForm.validate((valid) => {
        if(this.user.password!==this.user.apassword){
          this.$message.error("两次输入的密码不一致");
          return false;
        }
        if (valid) {
          this.request.post("/user/register",this.user).then(res=>{
            if(res.code==='200'){
              this.$message.success("注册成功")
            }
            else {
              this.$message.error(res.msg)
              // //console.log("error submit!!");
            }
          })
        } else {
          //console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.wrapper{
  background: url(../../src/assets/background.jpeg)
  center / cover no-repeat;
  height: 100vh;
  /*background-image: linear-gradient(to bottom left,#FF9966,#FF6666);*/
  overflow: hidden;
}
.method {
  /*  因为设置了父元素设置了 display：flex 属性，这里必须设置长宽来刚好遮罩住 */
  /* 关键属性   */
  backdrop-filter: blur(7px);
  height: 100vh;
  overflow: hidden;
}
.card{
  margin: 100px auto;
  background-color: #fff;
  width: 350px;
  height: 500px;
  padding: 20px;
  border-radius: 10px;
}
</style>
