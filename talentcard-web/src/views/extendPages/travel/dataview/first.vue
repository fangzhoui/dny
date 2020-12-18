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
import {
  getCardsFilterBase,
  travelRealtimeQuery,
  travelRealtimeExport,
} from "@/api/api";
import { compactObj, isEmpty } from "@/utils";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  mixins: [event],
  data() {
    return {
      cardStatus: [],
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
        { label: "入园时间", prop: "time" },
        { label: "景区名", prop: "scenicName" },
        { label: "游客名", prop: "youkename" },
        { label: "福利类型", prop: "welfare" },
        { label: "人才卡", prop: "cardname" },
        { label: "验证员工", prop: "staffname" },
      ],
    };
    this.getTableList();
    this.init();
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
              label: "景区名称",
              type: "input",
              key: "scenicName",
              placeholder: "请输入",
            },
            {
              label: "福利类型",
              type: "select",
              key: "welfareType",
              option: {
                2: { label: "免费", value: 2 },
                3: { label: "折扣", value: 3 },
              },
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
                  type: "primary",
                  text: "查询",
                  fn: (row) => this.search(row),
                },
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
        const res = await travelRealtimeQuery(params);
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
        const res = await travelRealtimeExport();
      } catch (e) {}
    },
  },
};
</script>

<style lang="less" scoped>
</style>