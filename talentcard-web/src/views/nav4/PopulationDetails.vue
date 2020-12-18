<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">符合条件人数详情</div>
        <div class="homepageTitle"></div>
      </section>
      <ajax-form :formData="formData" />
    </div>
    <div class="total-container">
      <span>政策名称:{{ policyName }}</span>
      <span>政策编号：{{ num }}</span>
      <span>符合条件人数：{{ CoincideNum.total }}</span>
      <span>待审批：{{ CoincideNum.napproval }}</span>
      <span>未申请：{{ CoincideNum.napply }}</span>
      <span>已通过：{{ CoincideNum.pass }}</span>
      <span>已驳回：{{ CoincideNum.reject }}</span>
    </div>
    <div class="search-container">
      <ajax-table
        :tableData="tableData"
        :list="list"
        :isPager="true"
        :listState="listState"
        @currentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
        :loading="loading"
      />
    </div>
    <el-dialog title="一键推送" :visible.sync="dialogTableVisible">
      <p>是否确定给所有未申请的用户发送提醒申请通知?</p>
      <p>注意：如果两个政策不可同享，建议不要同时推送通知，否则同时满足两个政策的人才会收到两条提醒通知。</p>
      <p>推送记录（成功数--收到推送通知的用户数；总数--推送时的未申请人数）</p>
      <el-table :data="gridData">
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column property="uname" label="操作人" width="200"></el-table-column>
        <el-table-column property="num" label="推送数量(成功数/总数)"></el-table-column>
        <el-table-column property="ctime" label="操作时间" width="150"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="determinePush">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCompliance,
  ComplianceExporExcel,
  queryCoincideNum,
  OnekeyPush,
  compliancePush,
  ComplianceQueryCertId,
} from "@/api/api";
import { sexTypes, roleNameTypes, statusTypes } from "./config";
import event from "@/mixins/common";
export default {
  name: "ExtendPagesFeedback",
  data() {
    return {
      policyId: 0,
      gridData: [],
      dialogTableVisible: false,
      sexTypes,
      roleNameTypes,
      statusTypes,
      CoincideNum: {},
      policyName:'',
      num:''
    };
  },
  created() {
    this.tableData = {
      id: "fid",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        {
          label: "性别",
          prop: "sex",
          type: "status",
          statusMap: this.sexTypes,
        },
        { label: "工作单位", prop: "wunit" },
        { label: "手机号码", prop: "phone" },
        {
          label: "申请状态",
          prop: "status",
          type: "status",
          statusMap: this.statusTypes,
         
        },
        { label: "申请时间", prop: "atime" },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handelPassword(row),
              type: "text",
              text: "查看",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "姓名",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        {
          label: "工作单位",
          type: "input",
          key: "wunit",
          placeholder: "请输入",
        },
        {
          label: "手机号码",
          type: "input",
          key: "phone",
          placeholder: "请输入",
        },
        {
          label: "申请状态",
          type: "select",
          key: "status",
          option: this.statusTypes,
        },
        { label: "开始时间", type: "date-picker", key: "beginDate" },
        { label: "结束时间", type: "date-picker", key: "endDate" },
        {
          label: "",
          type: "button",
          key: "",
          handles: [
            {
              type: "",
              text: "重置",
              event: "reset",
              fn: (row) => this.reset(row),
            },
            { type: "primary", text: "查询", fn: (row) => this.search(row) },
            {
              type: "primary",
              text: "一键推送",
              fn: (row) => this.OnekeyPush(row),
            },
            { text: "导出数据", fn: (row) => this.export(row) },
          ],
        },
      ],
    };
    this.policyId = this.$route.query.policyId;
    this.num = this.$route.query.num;
    this.policyName = this.$route.query.policyName;
    this.getTableList();
    this.getQueryNum();
  },
  mounted() {},
  mixins: [event],
  methods: {
    async determinePush() {
      try {
        let data = await compliancePush({ pid: this.policyId, status: 11 });
        this.dialogTableVisible = false;
        this.$message({
          message: "推送成功",
          type: "success",
        });
      } catch (e) {
        console.log(e, 1122);
      }
    },
    async export(row) {
       let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
     let d = date.getDate();
     let exporExcelName = this.policyName + y+'-'+m+'-'+d
     console.log(exporExcelName);
      let pid = this.policyId - 0;
      let params = { ...row, pid };
      await ComplianceExporExcel(params,exporExcelName);
    },
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
        pid: this.policyId,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await queryCompliance(params);
        this.list = res.data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async getQueryNum() {
      const res = await queryCoincideNum({ pid: this.policyId });
      this.CoincideNum = res;
    },
    async OnekeyPush() {
      this.dialogTableVisible = true;
      const res = await OnekeyPush({ pid: this.policyId });
      res.forEach((item) => {
        item.num = item.success + "/" + (item.failure + item.success);
      });
      this.gridData = res;
    },
    async handelPassword(row) {
      if (row.status == 11) {
        const url = window.location.href.split('#')[0] + '#/ViewTalent?openId=' + row.openid
        window.open(url)
      } else {
        const url = window.location.href.split('#')[0] + `#/DetailedApproval?paid=${row.paid}&status=${row.status}&detail=1&openId=` + row.openid
        window.open(url)
      }
    },
  },
};
</script>

<style lang="less" scoped >
.total-container {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 10px 20px;
  border-radius: 3px;
  background: #fff;
  font-size: 14px;
  line-height: 18px;
  & > span {
    margin-right: 20px;
    color: #303133;
  }
}
</style>
