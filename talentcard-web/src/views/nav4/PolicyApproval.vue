<template>
  <div v-if="!flag">
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">政策审批</div>
        <div class="homepageTitle"></div>
        <ajax-form :formData="formData" />
      </section>
    </div>
    <div class="total-container">
      <span>总政策申请数：{{ numCounts.allNum }}</span>
      <span>待审批：{{ numCounts.waitApprovalNum }}</span>
      <span>已通过：{{ numCounts.agreeNum }}</span>
      <span>已驳回：{{ numCounts.rejectNum }}</span>
    </div>
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
  queryPolicyApproval,
  exportApplications,
  findRoleBySession,
  applyNumCount,
  policyExporExcel
} from "../../api/api";
import qs from "qs";
import { formatTime } from "@/utils";
import { mapActions, mapState, mapGetters } from "vuex";
import { states } from "../../utils/config";
import event from "@/mixins/common";
export default {
  data() {
    return {
      applications: [],
      loading: true,
      states,
      flag: true,
      roleId: 0,
      roleType: 0,
      numCounts: {},
      statuTypes: {
        1: { label: "已通过", value: 1, class: "success" },
        2: { label: "已驳回", value: 2, class: "danger" },
        3: { label: "待审批", value: 3, class: "orange" },
      },
    };
  },
  computed: {
    ...mapState({
      responsible: (state) => state.options.responsible,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
    ...mapGetters(["canUserResponsible"]),
    updatedStates() {
      let finalList = Object.values(this.states).filter(
        (item) => !item.abandon
      );
      for (let i in finalList) {
        if (finalList[i].value == 1) {
          finalList[i].label = "已通过";
        }
      }
      return finalList;
    },
  },
  mixins: [event],
  methods: {
    ...mapActions(["getPolicyapp"]),
    async getRoleId() {
      this.flag = true;
      const data = await findRoleBySession();
      this.roleId = data.roleId;
      this.roleType = data.roleType;
      this.flag = false;
      this.tableData = {
        id: "PolicyApproval",
        arr: [
          { label: "序号", prop: "", type: "index", minWidth: 80 },
          { label: "政策名称", prop: "name" },
          { label: "政策编号", prop: "num" },
          { label: "责任单位", prop: "roleName" },
          {
            label: "申请人",
            prop: "apply",
          },
          {
            label: "申请时间",
            prop: "ctime",
          },
          {
            label: "状态",
            prop: "status",
            type: "status",
            statusMap: this.statuTypes,
          },
          {
            label: "操作",
            type: "handle",
            width: "300",
            handles: [
              {
                fn: (index, row) => this.handelApprove(row),
                type: "text",
                text: "审批",
                show: (row) =>
                  row.status == "3" &&
                  this.jurisdiction.approvalPolicyAction == 1,
              },
              {
                fn: (index, row) => this.handelDetail(row),
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
            label: "申请人",
            type: "input",
            key: "apply",
            placeholder: "请输入",
          },
          { label: "开始日期", type: "date-picker", key: "start" },
          {
            label: "结束日期",
            type: "date-picker",
            key: "end",
          },
          {
            label: "状态",
            type: "select",
            key: "status",
            option: this.updatedStates,
          },
          {
            label: "责任单位",
            type: "select",
            key: "responsibleUnitId",
            option: this.responsible,
            show: !(this.roleId == 1 || this.roleId == 2),
          },
          {
            label: "政策权益编号",
            type: "input",
            key: "num",
            placeholder: "请输入",
          },
          {
            label: "",
            type: "button",
            key: "",
            handles: [
              {
                type: "primary",
                text: "查询",
                fn: (row) => this.pageSearch(row),
              },
              {
                type: "",
                text: "重置",
                event: "reset",
                fn: (row) => this.reset(row),
              },
              {
                type: "primary",
                text: "导出",
                fn: (row) => this.exportExcel(row),
              },
            ],
          },
        ],
      };
    },
    async getTableList() {
      try {
        this.loading = true;
        let para = {
          ...this.searchForm,
          ...this.listState,
          roleId: this.roleId,
          roleType: this.roleType,
        };
        let params = {
          ...this.searchForm,
          roleId: this.roleId,
          roleType: this.roleType,
        };
        const res = await queryPolicyApproval(para);
        this.list = res.data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
        const numCount = await applyNumCount(params);
        this.numCounts = numCount;
      } catch (e) {
        console.log(e, 111);
      } finally {
        this.loading = false;
      }
    },
    handelApprove(row) {
      console.log(row.oid);
      this.$router.push({
        path: "/Approval",
        query: { paid: row.paid, status: row.status, openId: row.oid },
      });
    },
    handelDetail(row) {
      this.$router.push({
        path: "/DetailedApproval",
        query: {
          paid: row.paid,
          detail: 1,
          status: row.status,
          openId: row.oid,
        },
      });
    },
    async exportExcel(row) {
       let para = {
        ...row,
        ...this.listState,
        roleId: this.roleId,
        roleType: this.roleType,
      };
      await policyExporExcel(para,'政策审批表格');
    },
    async pageSearch(row) {
      let para = {
        ...row,
        ...this.listState,
        roleId: this.roleId,
        roleType: this.roleType,
      };
      let params = { ...row, roleId: this.roleId, roleType: this.roleType };
      const res = await queryPolicyApproval(para);
      const numCount = await applyNumCount(params);
      this.numCounts = numCount;
      this.list = res.data;
      this.listState = { ...this.listState, total: res.total };
    },
  },
  async created() {
    await this.getRoleId();
    this.getPolicyapp();
    this.getTableList();
  },
};
</script>

<style scoped lang="less">
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
.newAccountInput {
  width: 300px;
  margin-left: 10px;
}
.titlewrapper {
  background-color: white !important;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.pagination {
  background-color: white;
  padding: 0;
  margin: 0;
}
.passcheck {
  margin-left: 250px;
  margin-top: -30px;
}
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
