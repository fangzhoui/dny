<template>
  <div>
    <ajax-form :formData="formData" />
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
import event from "@/mixins/common";
import { mapState, mapActions, mapGetters } from "vuex";
import { getAutList, insertCertificationQuery } from "../../api/api";
import {
  educations,
  sexs,
  titles,
  qualities,
  states,
} from "../../utils/config";
export default {
  data() {
    return {
      educations,
      sexs,
      titles,
      qualities,
      states,
    };
  },
  mixins: [event],
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
    ...mapGetters(["backfillHonours", "sortHonours"]),
    updatedStates() {
      return Object.values(this.states).filter((item) => !item.abandon);
    },
  },
  created() {
    this.tableData = {
      id: "certifiedUsers",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        { label: "性别", prop: "sex", type: "status", statusMap: this.sexs },
        {
          label: "人才荣誉",
          prop: "honourId",
          type: "status",
          statusMap: this.backfillHonours,
        },
        {
          label: "学历",
          prop: "education",
          type: "status",
          statusMap: this.educations,
        },
        {
          label: "职称",
          prop: "ptCategory",
          type: "status",
          statusMap: this.titles,
        },
        {
          label: "职业资格",
          prop: "pqCategory",
          type: "status",
          statusMap: this.qualities,
        },
        {
          label: "状态",
          prop: "result",
          type: "status",
          statusMap: this.states,
        },
        { label: "注册时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handleApproval(row),
              type: "text",
              text: "审批",
              show: (row) =>
                (row.result == 3 || row.result == 0) &&
                this.jurisdiction.approvalTalentAction == 1,
            },
            {
              fn: (index, row) => this.handleSee(row),
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
        { label: "姓名", type: "input", key: "name", placeholder: "请输入" },
        { label: "性别", type: "select", key: "sex", option: this.sexs },
        {
          label: "人才荣誉",
          type: "select",
          key: "honour",
          option: this.sortHonours,
        },
        {
          label: "学历",
          type: "select",
          key: "education",
          option: this.educations,
        },
        {
          label: "职称",
          type: "select",
          key: "ptCategory",
          option: this.titles,
        },
        {
          label: "职业资格",
          type: "select",
          key: "pqCategory",
          option: this.qualities,
        },
        {
          label: "状态",
          type: "select",
          key: "result",
          option: this.updatedStates,
        },
        { label: "开始时间", type: "date-picker", key: "startTime" },
        { label: "结束时间", type: "date-picker", key: "endTime" },
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
    };
    this.getTableList();
  },
  methods: {
    async getTableList() {
      let para = {
        ...this.searchForm,
        ...this.listState,
      };
      delete para.total;
      try {
        this.loading = true;
        const res = await getAutList(para);
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
    handleSee(row) {
      this.$router.push({
        path: "Details",
        query: { id: row.talentId, certId: row.certId, viewType: "read" },
      });
    },
    handleApproval(row) {
      this.$router.push({
        path: "TalentApproval",
        query: { id: row.talentId, certId: row.certId, viewType: "edit" },
      });
    },
  },
};
</script>

<style scoped>
.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
/deep/ .el-tabs__nav-wrap {
  padding-left: 20px;
  background: white;
}
</style>
