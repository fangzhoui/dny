<template>
  <div>
    <template v-if="cardStatus.length > 0">
      <ajax-form :formData="formData" />
    </template>
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
import { deepCopy, compactObj, isEmpty } from "@/utils";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  getCardsFilterBase,
  farmhouseDataQuery,
  farmhouseRealtimeExport,
} from "@/api/api";
export default {
  mixins: [event],
  data() {
    return {
      cardStatus: [],
    };
  },
  async created() {
    this.getTableList();
    await this.init();
    this.tableData = {
      id: "id",
      arr: [
        { label: "序号", type: "index", prop: "", width: 80 },
        { label: "使用时间", prop: "time" },
        { label: "农家乐名称", prop: "name" },
        { label: "游客名", prop: "youkename" },
        { label: "人才卡", prop: "cardname" },
        { label: "验证员工", prop: "staffname" },
      ],
    };
  },
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  methods: {
    async init() {
      try {
        const res = await getCardsFilterBase();
        const cardmaps = res.map((item) => {
          return {
            label: `${item.title}/${item.initialWord}`,
            value: item.cardId,
          };
        });
        this.cardStatus = [...cardmaps];
        this.formData = {
          id: "searchForm",
          arr: [
            {
              label: "农家乐名称",
              type: "input",
              key: "name",
              placeholder: "请输入",
            },
            {
              label: "人才卡",
              type: "select",
              key: "cardID",
              option: this.cardStatus,
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
                {
                  type: "primary",
                  text: "查询",
                  fn: (row) => this.search(row),
                },
                {
                  text: "导出数据",
                  fn: (row) => this.export(row),
                  show: this.jurisdiction.farmHouseGetData == 1,
                },
              ],
            },
          ],
        };
      } catch (e) {
        console.log(e);
      }
    },
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
        const res = await farmhouseDataQuery(params);
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
        await farmhouseRealtimeExport();
      } catch (e) {
        this.$message.error("下载失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>