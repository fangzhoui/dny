<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">
          意见反馈
        </div>
        <div class="homepageTitle"></div>
      </section>
      <ajax-form :formData="formData" />
    </div>
    <div class="search-container">
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
  </div>
</template>

<script>
import { travelStatus } from "../config";
import { getFeedbackList } from "@/api/api";
import event from "@/mixins/common";
export default {
  name: "ExtendPagesFeedback",
  data() {
    return {
      travelStatus: travelStatus,
    };
  },
  created() {
    this.tableData = {
      id: "fid",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "用户姓名", prop: "name" },
        { label: "人才卡", prop: "card" },
        { label: "联系方式", prop: "contact" },
        { label: "反馈时间", prop: "ctime" },
        { label: "反馈内容", prop: "content", tips: true },
        { label: "图片", prop: "picture", type: "img" },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "用户姓名",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        {
          label: "联系方式",
          type: "input",
          key: "contact",
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
          ],
        },
      ],
    };
    this.getTableList();
  },
  mounted() {},
  mixins: [event],
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
        const res = await getFeedbackList(params);
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
  },
};
</script>

<style lang="less" scoped></style>
