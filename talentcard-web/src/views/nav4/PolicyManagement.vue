<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">政策管理</div>
        <el-button
          v-permission="'policyCreate'"
          type="primary"
          @click="createNewPolicy"
          style="float:right; margin-top:-40px; margin-right:45px"
        >新增政策</el-button>
        <div class="homepageTitle"></div>
        <ajax-form :formData="formData" />
      </section>
    </div>
    <!--列表-->
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
</template>

<script>
import {
  getPolicies,
  PolicyTypeUpDown,
  findRoleBySession,
} from "../../api/api";
import { formatTime } from "@/utils";
import { mapState, mapActions, mapGetters } from "vuex";
import event from "@/mixins/common";
export default {
  data() {
    return {
      deletedialogVis: false,
      loading: true,
      statuTypes: {
        1: { label: "可申请", value: 1, class: "primary" },
        2: { label: "未开启", value: 2, class: "danger" },
        3: { label: "已失效", value: 3 },
        4: { label: "已下架", value: 4 },
      },
    };
  },
  mixins: [event],
  computed: {
    ...mapState({
      policy: (state) => state.options.policy,
      responsible: (state) => state.options.responsible,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
    ...mapGetters(["canUserPolicy"]),
  },
  methods: {
    async getTableList() {
      try {
        this.loading = true;
        const data = await findRoleBySession();
        let roleId = data.roleId;
        let roleType = data.roleType;
        let para = {
          ...this.searchForm,
          ...this.listState,
          roleId,
          roleType,
        };
        const res = await getPolicies(para);
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
    createNewPolicy() {
      this.$router.push({ path: "/CreateNewPolicy", query: { type: 1 } });
    },
    handelview(row) {
      this.$router.push({
        path: "/EditPolicy",
        query: { pid: row.policyId, type: 3 },
      });
    },
    goTosee(row) {
      this.$router.push({
        path: "/PolicyManagement/DetailedPolicy",
        query: {
          pid: row.policyId,
          num: row.meetConditionNumber ? row.meetConditionNumber : 0,
          policyName: row.policyName,
        },
      });
    },
    handeleeditview(row) {
      this.$router.push({
        path: "/EditPolicy",
        query: { pid: row.policyId, type: 2 },
      });
    },
    async handeldeleteView(row, text) {
      try {
        var titleText = "";
        var upDown = 0;
        text == "下架"
          ? ((titleText =
              "是否确定下架该政策？下架后用户将无法查看并申请，不影响已审批和待审批的政策申请。"),
            (upDown = 2))
          : ((titleText = "是否确定上架该政策？上架后用户可查看并申请该政策。"),
            (upDown = 1));
        await this.$alert(titleText, text, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        let para = {
          policyId: row.policyId,
          upDown,
        };
        await PolicyTypeUpDown(para);
        this.getTableList();
        this.$message({
          message: text + "成功",
          type: "success",
        });
      } catch (e) {
        if (e && e.status == 2745) {
          this.$message.error(
            "请先上架该政策对应的政策类型" + row.policyTypeName
          );
        }
      }
    },
    seeNumpeople(row) {
      this.$router.push({
        path: "PopulationDetails",
        query: {
          policyId: row.policyId,
          num: row.num,
          policyName: row.policyName,
        },
      });
    },
  },

  created() {
    (this.tableData = {
      id: "PolicyApproval",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        {
          label: "政策名称",
          prop: "policyName",
          type: "event",
          minWidth: 150,
          style: { color: "#409eff" },
          fn: (index, row) => this.goTosee(row),
        },
        { label: "政策编号", prop: "num" },
        {
          label: "申请时间",
          startProp: "startTime",
          type: "connect",
          endProp: "endTime",
          minWidth: 200,
        },
        {
          label: "符合条件人数",
          prop: "meetConditionNumber",
          type: "event",
          style: { color: "#409eff" },
          fn: (index, row) => this.seeNumpeople(row),
        },
        {
          label: "状态",
          prop: "status",
          type: "status",
          // color:row.status==1?'pink':'',
          statusMap: this.statuTypes,
        },
        {
          label: "政策类型",
          prop: "policyTypeName",
        },
        {
          label: "责任单位",
          prop: "roleName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          minWidth: 110,
        },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handeleeditview(row),
              type: "text",
              text: "编辑",
              show: (row) =>
                row.upDown == 2 && this.jurisdiction.policyUpdate == 1,
            },
            {
              fn: (index, row) => this.handeldeleteView(row, "上架"),
              type: "text",
              text: "上架",
              show: (row) =>
                row.upDown == 2 && this.jurisdiction.policyUpdate == 1,
            },
            {
              fn: (index, row) => this.handeldeleteView(row, "下架"),
              type: "text",
              text: "下架",
              show: (row) =>
                row.upDown == 1 && this.jurisdiction.policyUpdate == 1,
            },
            {
              fn: (index, row) => this.handelview(row),
              type: "text",
              text: "复制",
              show: (row) => this.jurisdiction.policyUpdate == 1,
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          {
            label: "政策名称",
            type: "input",
            key: "name",
            placeholder: "请输入",
          },
          {
            label: "政策编号",
            type: "input",
            key: "num",
            placeholder: "请输入",
          },
          {
            label: "状态",
            type: "select",
            key: "status",
            option: this.statuTypes,
          },
          {
            label: "政策类型",
            type: "select",
            key: "policyType",
            option: this.policy,
          },
          {
            label: "责任单位",
            type: "select",
            key: "roleId",
            option: this.responsible,
          },
          { label: "开始日期", type: "date-picker", key: "start" },
          {
            label: "结束日期",
            type: "date-picker",
            key: "end",
          },
          {
            label: "",
            type: "button",
            key: "",
            handles: [
              { type: "primary", text: "查询", fn: (row) => this.search(row) },
              {
                type: "",
                text: "重置",
                event: "reset",
                fn: (row) => this.reset(row),
              },
            ],
          },
        ],
      });
    this.getTableList();
    console.log(this.policy, 78);
  },
};
</script>

<style scoped>
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
.dialogDivider {
  margin-top: -20px;
}
.innerDivider {
  margin-top: 5px;
  margin-bottom: 5px;
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
</style>
