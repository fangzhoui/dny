<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">角色管理</div>
        <div
          style="font-size:14px;color:#999999; font-weight:400;position:absolute;margin-top:-30px; margin-left:80px"
        >角色用来控制用户可使用那些功能权限，设置完成后请在【用户管理】中分配角色</div>
        <div class="homepageTitle"></div>
      </section>
      <!--列表-->
      <div class="toolbar" style="background-color:white">
        <el-form :inline="true" :model="searchForm" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="searchForm.roleName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="searchForm.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetfilter">重置</el-button>
            <el-button type="primary" native-type='submit' @click="(e) => getRoles(e)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--列表-->
    <div class="contentwrapper">
      <el-table :data="list" style="width: 100%;" empty-text="无搜索结果">
        <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="extra" label="描述" align="center" :formatter="desformat"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" align="center">
            <el-button type="text" v-permission="'roleQuery'" @click="handelview(scope.row, 'read')">查看</el-button>
            <!-- <el-button type="text" @click="handelview(scope.row, 'edit')">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!--view dialog-->
     <roles :type="readOrEdit" :form="rulesOpt" :flag="dialogTableVisible" @close="rolesAction" />
      <!--工具条-->
      <el-col :span="24" class="pagination">
        <el-pagination
          style="float:right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          :page-sizes="[10, 20, 30, 40, 50, 60 , 70, 80 ,90, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalnum"
        />
      </el-col>
    </div>
  </section>
</template>


<script>
import { getRoleList } from "../../api/api";
import Roles from './components/Roles'
import { formatTime } from "@/utils";
const SEARCHFORM = {
  roleName: '',
  startTime: '',
  endTime: ''
}
export default {
  components: {
    Roles
  },
  data() {
    return {
      searchForm: {
        ...SEARCHFORM
      },
      list: [],
      dialogTableVisible: false,
      readOrEdit: '',
      rulesOpt: {},
      roleName: "",
      totalnum: 0,
    };
  },
  methods: {
    async getRoles(e) {
      // enter el-form键阻止冒泡
      e && e.stopPropagation()
      e && e.preventDefault()
      try {
        let para = {
          ...this.searchForm,
          startTime: this.searchForm.startTime ? formatTime(this.searchForm.startTime, 'yyyy-MM-dd') : '',
          endTime: this.searchForm.endTime ? formatTime(this.searchForm.endTime, 'yyyy-MM-dd') : ''
        };
        const res = await getRoleList(para)
        this.totalnum = res.length;
        this.list = res;
      } catch (e) {
        this.totalnum = 0;
        this.list = [];
      }
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    //可能要重新加载列表
    resetfilter() {
      this.searchForm = {
        ...SEARCHFORM
      }
      this.getRoles();
    },
    rolesAction (type, obj = {}) {
      this.dialogTableVisible = false
    },
    handelview(row, type) {
      this.rulesOpt = {
        ...row,
      }
      this.readOrEdit = type
      this.dialogTableVisible = true
    },
    desformat(row, column) {
      if (!row.extra) {
        return "系统自动生成";
      }
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>

<style scoped>
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}

.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.title {
  padding: 0px;
}
.pagination {
  background-color: white;
  padding: 0;
  margin: 0;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff;
}
</style>
<style>
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #666666 !important;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  color: white;
  border-color: white;
}
..el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
}


</style>