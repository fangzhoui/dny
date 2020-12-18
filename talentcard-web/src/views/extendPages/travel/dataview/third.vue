<template>
  <div>
    <ajax-form :formData="formData" />
    <div class="total-container">
      <span>使用总人数：{{ total.numbers || 0 }}</span>
      <span>免费总次数：{{ total.freeTimes || 0 }}</span>
      <span>折扣总次数：{{ total.discountTimes || 0 }}</span>
      <span>使用总次数：{{ total.totalTimes || 0 }}</span>
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
import event from "@/mixins/common";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  travelMonthExport,
  travelMonthQuery,
  travelMonthTotal,
} from "@/api/api";
import { compactObj, isEmpty } from "@/utils";
export default {
  mixins: [event],
  data() {
    return {
      total: {
        totalNumber: 0,
        totalTimes: 0,
      },
    };
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
        { label: "开始时间", type: "month-picker", key: "start" },
        { label: "结束时间", type: "month-picker", key: "end" },
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
        const res = await travelMonthQuery(params);
        await this.getTopTotal(params);
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
    async getTopTotal(params) {
      try {
        const res = await travelMonthTotal(params);
        this.total = {
          ...res,
        };
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    async export() {
      try {
        const res = await travelMonthExport();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.total-container {
  margin-top: 10px;
  padding: 10px;
  border-radius: 2px;
  background: #fff;
  & > span {
    margin-right: 20px;
    color: #606266;
  }
}
</style>