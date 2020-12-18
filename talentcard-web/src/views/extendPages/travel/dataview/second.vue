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
import { travelDailyQuery, travelDailyExport } from "@/api/api";
import { compactObj, isEmpty } from "@/utils";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  mixins: [event],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  created() {
    this.tableData = {
      id: "id",
      arr: [
        { label: "序号", type: "index", prop: "", width: 80 },
        { label: "时间", prop: "time" },
        { label: "景区名称", prop: "name" },
        { label: "使用人数", prop: "number" },
        { label: "免费次数", prop: "freeTimes" },
        { label: "折扣次数", prop: "discountTimes" },
        { label: "总使用次数", prop: "totalTimes" },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "景区名称",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        { label: "开始时间", type: "date-picker", key: "start" },
        { label: "结束时间", type: "date-picker", key: "end" },
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
            {
              text: "导出数据",
              fn: (row) => this.export(row),
              show: this.jurisdiction.tripGetData == 1,
            },
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
      compactObj(params, isEmpty);
      // 调用接口
      try {
        this.loading = true;
        const res = await travelDailyQuery(params);
        this.list = res.data || [];
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async export() {
      try {
        const res = await travelDailyExport();
      } catch (e) {}
    },
  },
};
</script>

<style lang="less" scoped>
</style>