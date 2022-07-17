<template>
  <el-form ref="AccountFrom" :model="register" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">用户注册</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="register.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <!--错误提示，下同-->
    <div class="error">{{uError}}</div>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="register.pwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--错误提示，下同-->
    <div class="error">{{pError}}</div>
    <el-form-item prop="pwdagain">
      <el-input type="password" v-model="register.pwdagain" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--错误提示，下同-->
    <div class="error">{{aError}}</div>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="userRegister" :loading="logining">注册</el-button>
    </el-form-item>
    <router-link to="/Login">已有账号，登陆</router-link>
  </el-form>
</template>
<script>
import {requestLogin, requestRegister} from "../api/api";
export default {
  name: "Register",
  data () {
    return  {
      logining:false,
      register: {
        account: '',
        pwd: '',
        pwdagain:''
      },
      uError:'',
      pError:'',
      aError:'',
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          //{ validator: validaePass }
        ],
        pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          //{ validator: validaePass2 }
        ],
        pwdagain: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          //{ validator: validaePass2 }
        ],
      },
      checked:true
    };
  },
  methods:{
    userRegister(){
      if(this.register.account==="") {
        this.uError="用户名不能为空！"
      }
      else {
        this.uError=""
      }
      if(this.register.pwd==="") {
        this.pError="密码不能为空！"
      }
      else {
        this.pError=""
      }
      if(this.register.pwd!==this.register.pwdagain) {
        this.aError="两次密码不一致！"
      }
      else {
        this.aError=""
      }
      if(this.uError===""&&this.pError===""&&this.aError==="") {
        this.$refs.AccountFrom.validate((valid) => {
          if (valid) {
            this.logining=true;
            var RegisterParams = { account: this.register.account, password: this.register.pwd };
            requestRegister(RegisterParams).then(data => {
              debugger;
              this.logining=false;
              let {msg, code} = data;
              if (code === '200') {
                //登录成功，把用户信息保存在sessionStorage中
                //sessionStorage.setItem('access-token', token);
                //跳转到后台主界面
                this.$router.push({path: '/Login'});
              } else {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              }
            });

          } else {
            //console.log('error submit!!');
            return false;
          }
        });

      }
    }
  }
}
</script>


<style>
body{
  background: #DFE9FB;
}
.login-container{
  width:350px;
  margin-left:35%;
}
</style>
