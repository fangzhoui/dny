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
import { farmhouseDailyQuery, farmhouseDailyExport } from "@/api/api";
import { deepCopy, compactObj, isEmpty } from "@/utils";
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
        { label: "时间", prop: "dailyTime" },
        { label: "农家乐名称", prop: "name" },
        { label: "使用人数", prop: "number" },
        { label: "使用次数", prop: "times" },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "农家乐名称",
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
            {
              type: "",
              text: "重置",
              event: "reset",
              fn: (row) => this.reset(row),
            },
            { type: "primary", text: "查询", fn: (row) => this.search(row) },
            {
              text: "导出数据",
              fn: (row) => this.export(row),
              show: this.jurisdiction.farmHouseGetData  == 1,
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
        const res = await farmhouseDailyQuery(params);
        this.list = res.data || [];
        this.listState = {
          ...this.listState,
          total: res.total || 0,
        };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async export() {
      try {
        const res = await farmhouseDailyExport();
      } catch (e) {}
    },
  },
};
</script>

<style lang="less" scoped>
</style>