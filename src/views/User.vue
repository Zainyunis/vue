<template>
  <div>
    <!--          搜索框-->
    <div style="margin: 10px 0">
      <el-input style="width: 300px" placeholder="请输入用户名查询" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 300px" placeholder="请输入账号查询" suffix-icon="el-icon-search" class="ml-5" v-model="account"></el-input>
      <!--            <el-input style="width: 300px" placeholder="请输入用户职称编号查询" suffix-icon="el-icon-search" class="ml-5" v-model="titleId"></el-input>-->
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>
    <!--          新增-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text='确认'
        cancel-button-text='我再想想'
        icon="el-icon-info"
        icon-color="red"
        title="确定删除吗？"
        @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-plus-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <!--表格-->
    <!--  :header-cell-class-name="headerBg"-->
    <el-table :data="tableData" style="background: #b3e5e5"  @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="id" label="编号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="account" label="账号">
      </el-table-column>
      <el-table-column prop="tel" label="联系电话">
      </el-table-column>
      <el-table-column prop="titleId" label="titleId">
      </el-table-column>
<!--      <el-table-column prop="titleName" label="职称">-->
<!--      TODO-->
<!--      </el-table-column>-->
      <el-table-column prop="visitPower" label="访问权限">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" >
          <el-button type="warning" @click="handleEdit(scope.row)">编辑 <i class="el-icon-circle-plus-outline"></i></el-button>
          <el-popconfirm
            class="ml-5"
            confirm-button-text='确认'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="del(scope.row.id)"
          >
            <el-button slot="reference" type="danger">删除
              <i class="el-icon-remove-plus-outline"></i>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--          分页-->
    <div class="block" style="padding: 10px 0">
      <!--            <span class="demonstration">完整功能</span>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">

      </el-pagination>
    </div>

    <!-- Form -->
    <!--          <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import ElementUI from "_element-ui@2.15.9@element-ui";

export default {
  name: "User",
  data(){
    return{
      tableData: [],
      headerBg:'headerBg',
      pageNum: 1,
      pageSize:5,
      total:0,
      username:'',
      account:'',
      titleId:'',
      form:{},
      rules: {
        pwd: [
          {required: true, message: '', trigger: 'blur'},
        ],
        account: [
          {required: true, message: '', trigger: 'blur'},
        ],
      },
      dialogFormVisible: false,
      multipleSelection:[],
      user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  },
  created() {
    this.load();
  },
  beforeRouteEnter:(to,from,next)=>{
    let roleId = JSON.parse(localStorage.getItem("user")).titleId;
    //console.log(roleId);
    if(roleId!==1)
      next();
    else{
      ElementUI.Message({
        message:"权限不足，无法查看该页面",
        type:'error'
      });
      next(from.path);
    }

  },
  methods:{
    load(){
      this.request.get("/user/page",{
        params: {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          username:this.username,
          account:this.account
        }}).then(res=>{
        // //console.log('更新');
        // //console.log(res);
        this.tableData=res.data.records;
        this.total=res.data.total;
      })
      // fetch("http://localhost:9090/user/page?pageNum="+this.pageNum+
      //   "&pageSize="+this.pageSize+"&username="+this.username+"&account="+
      //   this.account)
      //   .then(res=>res.json()).then(res=>{
      //   //console.log(res);
      //   this.tableData=res.records;
      //   this.total=res.total;
      // })
    },
    handleSelectionChange(val){
      // //console.log(val);
      this.multipleSelection = val;
    },
    delBatch(){
      let ids = this.multipleSelection.map(v=>v.id);
      //map(v=>v.id)  [{},{},{}]=>[1,2,3]
      // //console.log(ids);
      this.request.post("/user/del/batch",ids).then(res=>{
        if(res.data){
          this.$message.success("删除成功");
        }else {
          this.$message.error("删除失败");
        }
      });
      this.load();
    },
    handleAdd(){
      this.dialogFormVisible = true;
      this.form={};
    },
    handleEdit(row){
      this.form=row;
      this.dialogFormVisible = true;
    },
    del(id){
      this.request.delete("/user/"+id).then(res=>{
        if(res.data){
          this.$message.success("删除成功");
        }else {
          this.$message.error("删除失败");
        }
      });
      // //console.log('开始更新');
      this.load();
    },
    save(){
      this.request.post("/user",this.form).then(res=> {
        if(res.data){
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
        }else {
          this.$message.error("保存失败");
        }
      });
      this.load();
    },
    reset(){
      this.username="";
      this.account="";
      this.load();
    },
    handleSizeChange(pageSize) {
      //console.log(`每页 ${pageSize} 条`);
      this.pageSize=pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      //console.log(`当前页: ${pageNum}`);
      this.pageNum=pageNum;
      this.load();
    }
  }
}
</script>

<style>
.headerBg{
  background: #b3e5e5 !important;
}
</style>

