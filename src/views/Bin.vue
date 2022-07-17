<template>
  <div>
    <!--          搜索框-->
    <div style="margin: 10px 0">
      <el-input style="width: 300px" placeholder="请输入库位编号查询" suffix-icon="el-icon-search" class="ml-5" v-model="sn"></el-input>
      <el-input style="width: 300px" placeholder="请输入货架序号查询" suffix-icon="el-icon-search" class="ml-5" v-model="shelfId"></el-input>
      <el-input style="width: 200px" placeholder="是否装载货物" suffix-icon="el-icon-search"  class="ml-5"  v-model="isLoad"></el-input>
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
      <el-table-column prop="id" label="序号" width="120">
      </el-table-column>
      <el-table-column prop="sn" label="库位编号">
      </el-table-column>
      <el-table-column prop="row" label="层数">
      </el-table-column>
      <el-table-column prop="col" label="列数">
      </el-table-column>
      <el-table-column prop="maxLoad" label="最大载荷">
      </el-table-column>
      <el-table-column prop="shelfId" label="货架序号">
      </el-table-column>
      <el-table-column prop="positionZ" label="库位Z坐标">
      </el-table-column>
      <el-table-column prop="isLoad" label="是否装载货物">
      </el-table-column>
      <el-table-column prop="goodsSn" label="货物编码">
      </el-table-column>
      <el-table-column prop="amount" label="货物数量">
      </el-table-column>
      <el-table-column label="入库时间">
        <template slot-scope="scope">{{scope.row.operationDate | formatDate}}</template>
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
    <el-dialog title="库位信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item label="库位编号" prop="sn">
          <el-input v-model="form.sn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="层数" prop="row">
          <el-input v-model="form.row" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="列数" prop="col">
          <el-input v-model="form.col" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大载荷" prop="maxLoad">
          <el-input v-model="form.maxLoad" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货架序号" prop="shelfId">
          <el-input v-model="form.shelfId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货架Z坐标" prop="positionZ">
          <el-input v-model="form.positionZ" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="装载状态" prop="isLoad">
          <el-input v-model="form.isLoad" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货物编码" prop="goodsSn">
          <el-input v-model="form.goodsSn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="货物数量" prop="amount">
          <el-input v-model="form.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.operationDate"></el-date-picker>
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
  name: "StorageLocation",
  data(){
    return{
      tableData: [],
      headerBg:'headerBg',
      pageNum: 1,
      pageSize:5,
      total:0,

      sn:'',
      shelfId:'',
      isLoad:'',

      titleId:'',
      form:{
        sn:'',
        row:'',
        col:'',
        maxLoad:'',
        shelfId:'',
        isLoad:'',
        goodsSn:'',
        amount:''
      },
      rules: {
        sn: [
          {required: true, message: '', trigger: 'blur'},
        ],
        col: [
          {required: true, message: '', trigger: 'blur'},
        ],
        shelfId: [
          {required: true, message: '', trigger: 'blur'},
        ],
        row: [
          {required: true, message: '', trigger: 'blur'},
        ],
        isLoad: [
          {required: true, message: '', trigger: 'blur'},
        ],
        positionZ: [
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
  filters: {
    formatDate(time) {
      if(time===null)
        return ;
      let date = new Date(time);
      return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
    }
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
      this.request.get("/bin/page",{
        params: {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          isLoad:this.isLoad,
          sn:this.sn,
          shelfId:this.shelfId
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
      this.request.post("/bin/del/batch",ids).then(res=>{
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
      this.request.delete("/bin/"+id).then(res=>{
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
      //console.log(this.form.sn);
      this.request.post("/bin",this.form).then(res=> {
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
      this.sn="";
      this.shelfId="";
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
