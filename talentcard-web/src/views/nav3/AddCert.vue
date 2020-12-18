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
import { mapState, mapGetters, mapActions } from "vuex";
import { insertCertificationQuery } from "../../api/api";
import {
  educations,
  sexs,
  titles,
  qualities,
  states,
  certificationTypes,
  filterData,
} from "../../utils/config";
export default {
  data() {
    return {
      educations,
      sexs,
      titles,
      qualities,
      states,
      certificationTypes,
    };
  },
  mixins: [event],
   computed: {
    ...mapGetters(["canUserCategories", "canUserHonours"]),
    ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
    }),
  },
  created() {
    (this.tableData = {
      id: "adddUsers",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "姓名", prop: "name" },
        { label: "性别", prop: "sex", type: "status", statusMap: this.sexs },
        {
          label: "认证类别",
          prop: "type",
          type: "status",
          statusMap: this.certificationTypes,
        },
        {
          label: "具体信息",
          prop: "certInfo",
          text: (row) => this.detailfilter(row),
        },
        { label: "状态", prop: "status", type: "status", statusMap: states },
        { label: "提交时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handleApproval(row),
              type: "text",
              text: "审批",
              show: (row) => row.status == 3,
            },
            {
              fn: (index, row) => this.handleSee(row),
              type: "text",
              text: "查看",
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          { label: "姓名", type: "input", key: "name", placeholder: "请输入" },
          { label: "性别", type: "select", key: "sex", option: this.sexs },
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
      }),
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
        const res = await insertCertificationQuery(para);
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
        query: {
          id: row.talentId,
          certId: row.insertCertId,
          viewType: "read",
          type: 2,
        },
      });
    },
    handleApproval(row) {
      this.$router.push({
        path: "TalentApproval",
        query: {
          id: row.talentId,
          certId: row.insertCertId,
          viewType: "edit",
          type: 2,
        },
      });
    },
    detailfilter(row) {
      if (row.type == 1) {
        return filterData("educations", row.certInfo);
      }
      if (row.type == 2) {
        return filterData("titles", row.certInfo);
      }
      if (row.type == 3) {
        return filterData("qualities", row.certInfo);
      }
      if (row.type == 4) {
        console.log(this.honours,11);
          for (let i = 0; i < this.honours.length; i++) {
            if (this.honours[i].value == row.certInfo) {
              return this.honours[i].label;
            }
          }
      }
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
