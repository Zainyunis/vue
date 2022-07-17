<template>
  <div>
    <!--          搜索框-->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入作业单号查询" suffix-icon="el-icon-search" class="ml-5" v-model="taskNo"></el-input>
      <el-input style="width: 200px" placeholder="请输入作业类型查询" suffix-icon="el-icon-search" class="ml-5" v-model="taskType"></el-input>
      <el-input style="width: 200px" placeholder="请输入库位编号查询" suffix-icon="el-icon-search" class="ml-5" v-model="binSn"></el-input>
    </div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入操作员姓名查询" suffix-icon="el-icon-search" class="ml-5" v-model="userName"></el-input>
      <el-input style="width: 200px" placeholder="请输入物品编号查询" suffix-icon="el-icon-search" class="ml-5" v-model="goodsSn"></el-input>
      <el-input style="width: 200px" placeholder="请输入物品名称查询" suffix-icon="el-icon-search" class="ml-5" v-model="goodsName"></el-input>
      <span style="padding: 1px">
        <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
        <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
      </span>
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
      <el-table-column prop="id" label="序号" width="120">
      </el-table-column>
      <el-table-column prop="taskNo" label="作业单号">
      </el-table-column>
      <el-table-column prop="type" label="作业类型（出库0，入库1）">
      </el-table-column>
      <el-table-column prop="binSn" label="操作库位编号">
      </el-table-column>
      <el-table-column prop="username" label="操作人员">
      </el-table-column>
      <el-table-column prop="goodsSn" label="物品编号">
      </el-table-column>
      <el-table-column prop="goodsName" label="物品名称">
      </el-table-column>
      <el-table-column prop="amount" label="数量">
      </el-table-column>
      <el-table-column label="作业时间">
        <template slot-scope="scope">{{scope.row.taskTime | formatDate}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" >
<!--          <el-button type="warning" @click="handleEdit(scope.row)">编辑 <i class="el-icon-circle-plus-outline"></i></el-button>-->
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
    <el-dialog title="作业信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item label="作业单号" prop="taskNo">
          <el-input v-model="form.taskNo" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="作业类型" prop="type">
          <el-input v-model="form.type" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="操作库位编号" prop="binSn">
          <el-input v-model="form.binSn" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="username">
          <el-input v-model="form.username" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="物品编号">
          <el-input v-model="form.goodsSn" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="物品名称">
          <el-input v-model="form.goodsName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.amount" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.taskTime"></el-date-picker>
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
import {formatDate} from "../utils/date";
export default {
  name: "Task",
  data(){
    return{
      tableData: [],
      headerBg:'headerBg',
      pageNum: 1,
      pageSize:5,
      total:0,

      taskNo:'',
      taskType:'',
      binSn:'',
      userName:'',
      goodsSn:'',
      goodsName:'',

      titleId:'',
      form:{},
      rules: {
        taskNo: [
          {required: true, message: '', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '', trigger: 'blur'},
        ],
        binSn: [
          {required: true, message: '', trigger: 'blur'},
        ],
        username: [
          {required: true, message: '', trigger: 'blur'},
        ],

      },

      dialogFormVisible: false,
      multipleSelection:[],
      user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  },
  filters: {
    formatDate(time) {
      if(time===null)
        return ;
      let date = new Date(time);
      return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
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
      this.request.get("/task/page",{
        params: {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          taskNo:this.taskNo,
          taskType:this.taskType,
          binSn:this.binSn,
          userName:this.userName,
          goodsSn:this.goodsSn,
          goodsName:this.goodsName
        }}).then(res=>{
        this.tableData=res.data.records;
        this.total=res.data.total;
      })
    },
    handleSelectionChange(val){
      // //console.log(val);
      this.multipleSelection = val;
    },
    delBatch(){
      let ids = this.multipleSelection.map(v=>v.id);
      //map(v=>v.id)  [{},{},{}]=>[1,2,3]
      // //console.log(ids);
      this.request.post("/task/del/batch",ids).then(res=>{
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
      this.request.delete("/task/"+id).then(res=>{
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
      //console.log(this.form);
      this.request.post("/task/save",this.form).then(res=> {
        if(res.code==='200'){
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
        }else {
          this.$message.error(res.msg);
        }
      });
      this.load();
    },
    reset(){
      this.taskNo   ='';
      this.taskType ='';
      this.binSn    ='';
      this.userName ='';
      this.goodsSn  ='';
      this.goodsName='';
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

<style scoped>

</style>
