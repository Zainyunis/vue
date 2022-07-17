<template>
  <div>
    <!--          搜索框-->
    <div style="margin: 10px 0">
      <el-input style="width: 300px" placeholder="请输入仓库名称查询" suffix-icon="el-icon-search"  class="ml-5" v-model="houseName"></el-input>
      <el-input style="width: 300px" placeholder="请输入仓库编号查询" suffix-icon="el-icon-search"  class="ml-5" v-model="houseSn"></el-input>
    </div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入货架编号查询" suffix-icon="el-icon-search" class="ml-5"  v-model="shelfSn"></el-input>
      <el-input style="width: 200px" placeholder="请输入货位编号查询" suffix-icon="el-icon-search" class="ml-5"  v-model="binSn"></el-input>
      <el-input style="width: 200px" placeholder="是否装载货物" suffix-icon="el-icon-search"      class="ml-5"  v-model="isLoad"></el-input>
    </div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入货物名称查询" suffix-icon="el-icon-search" class="ml-5" v-model="goodsName"></el-input>
      <el-input style="width: 200px" placeholder="请输入货物编号查询" suffix-icon="el-icon-search" class="ml-5" v-model="goodsSn"></el-input>
      <el-input style="width: 200px" placeholder="请输入货物备注查询" suffix-icon="el-icon-search" class="ml-5" v-model="goodsNotes"></el-input>
    </div>
    <div style="margin: 10px 0">
      <el-input style="width: 300px" placeholder="请输入操作时间查询" suffix-icon="el-icon-search" class="ml-5" v-model="operationDate"></el-input>
      <span style="padding: 1px">
        <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
        <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
      </span>
    </div>
    <!--表格-->
    <!--  :header-cell-class-name="headerBg"-->
    <el-table :data="tableData" style="background: #b3e5e5">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column prop="houseName" label="仓库">
      </el-table-column>
      <el-table-column prop="houseSn" label="仓库编号">
      </el-table-column>
      <el-table-column prop="shelfSn" label="货架编号">
      </el-table-column>
      <el-table-column prop="binSn" label="货位编号">
      </el-table-column>
      <el-table-column prop="row" label="货位层" width="60">
      </el-table-column>
      <el-table-column prop="col" label="货位列" width="60">
      </el-table-column>
      <el-table-column  label="最后操作时间">
<!--        prop="operationDate"-->
        <template slot-scope="scope">{{scope.row.operationDate | formatDate}}</template>
      </el-table-column>
      <el-table-column prop="isLoad" label="是否装载" width="60">
      </el-table-column>
      <el-table-column prop="goodsName" label="货物名称">
      </el-table-column>
      <el-table-column prop="goodsSn" label="货物编号">
      </el-table-column>
      <el-table-column prop="amount" label="货物数量" width="60">
      </el-table-column>
      <el-table-column prop="unit" label="货物单位" width="60">
      </el-table-column>
      <el-table-column prop="unitWeight" label="单位重量" width="60">
      </el-table-column>
      <el-table-column prop="goodsNotes" label="货物备注">
      </el-table-column>
    </el-table>
    <!--          分页-->
    <div class="block" style="padding: 10px 0">
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

  </div>
</template>

<script>
import ElementUI from "_element-ui@2.15.9@element-ui";
import {formatDate} from "../utils/date";
export default {
  name: "Home",
  data(){
    return{
      tableData: [],
      headerBg:'headerBg',
      pageNum: 1,
      pageSize:5,
      total:0,

      houseName:'',
      houseSn:'',
      shelfSn:'',
      binSn:'',
      isLoad:'',
      goodsName:'',
      goodsSn:'',
      goodsNotes:'',
      operationDate:'',

      titleId:'',

      dialogFormVisible: false,

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
  methods:{
    load(){
      this.request.get("/public/page",{
        params: {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          houseName:this.houseName,
          houseSn:this.houseSn,
          shelfSn:this.shelfSn,
          binSn:this.binSn,
          isLoad:this.isLoad,
          goodsName:this.goodsName,
          goodsSn:this.goodsSn,
          goodsNotes:this.goodsNotes,
          operationDate:this.operationDate,
        }}).then(res=>{
        this.tableData=res.data.records;
        this.total=res.data.total;
      })
    },
    reset(){

      this.houseName="";
      this.houseSn="";
      this.shelfSn="";
      this.binSn="";
      this.isLoad="";
      this.goodsName="";
      this.goodsSn="";
      this.goodsNotes="";
      this.operationDate="";
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
