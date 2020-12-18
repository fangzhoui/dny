<template>
  <div class="my-box">
    <ajax-form :formData="formData" />
    <div class="deep-line"></div>
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
import { approvalStatus, activityStatus, getTimesArr } from "../config";
import { getApprovalList } from "@/api/api";
export default {
  mixins: [event],
  data() {
    return {
      dialogVisible: false,
      statusMap: Object.assign({}, activityStatus, approvalStatus),
      form: {
        value: "",
      },
    };
  },
  created() {
    this.tableData = {
      id: "id",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        {
          label: "活动名称",
          tips: true,
          prop: "name",
          type: "event",
          style: { color: "#409eff" },
          fn: (index, row) =>
            this.goDetail({
              type: 1,
              id: row.eventId,
            }),
          tips: true,
        },
        {
          label: "活动时间",
          prop: "time",
          text: (row) => this.forTime(row),
          tips: false,
        },
        {
          label: "活动参与人数",
          prop: "eventQuota",
        },
        {
          label: "状态",
          prop: "sshow",
          type: "status",
          statusMap: this.statusMap,
          style: (row) => {
            if (row.sshow == 6 || row.sshow == 2 || row.sshow == 9) {
              return {
                color: "#008000a5",
              };
            }
            if (row.sshow == 4 || row.sshow == 5) {
              return {
                color: "#ff0000a5",
              };
            }
            return {};
          },
        },
        { label: "提交时间", prop: "ctime" },
        {
          label: "操作",
          type: "handle",

          handles: [
            {
              fn: (index, row) =>
                this.goDetail({ type: 1, id: row.eventId, approval: 1 }),
              type: "text",
              show: (row) => row.status == 1,
              text: "审批",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "活动名称",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        {
          label: "状态",
          type: "select",
          key: "sshow",
          placeholder: "请输入",
          option: approvalStatus,
        },
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
          ],
        },
      ],
    };
    this.getTableList();
  },
  methods: {
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await getApprovalList(params);
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
    forTime({ time = "", date = "" }) {
      if (!time) {
        return "-";
      }
      let nDate = date.split(" ")[0];
      let timeArr = time.split(",") || [];
      const timeStr = getTimesArr(timeArr);
      return `${nDate}  ${timeStr}`;
    },
    goDetail(row) {
      this.$router.push({
        path: "/other/active/detail",
        query: {
          ...row,
          xcx: 1,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tip-content {
  font-size: 14px;
  color: #333;
  line-height: 22px;
  margin-top: -22px;
  margin-bottom: 22px;
}
.tip {
  font-size: 10px;
  color: #999;
  line-height: 22px;
}
</style>