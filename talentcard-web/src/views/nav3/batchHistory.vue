<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb-self"
        >
          <el-breadcrumb-item :to="{ path: '/OrdinaryUsers' }"
            >普通用户</el-breadcrumb-item
          >
          <el-breadcrumb-item>认证记录</el-breadcrumb-item>
        </el-breadcrumb>
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
import { getBatchAuthList } from "@/api/api";
import { bacthStatusMap } from "../../utils/config";
import event from "@/mixins/common";
import downLoadEvent from "@v/nav4/mixin";
export default {
  name: "bacth-histroy",
  created() {
    this.tableData = {
      id: "farmhouseId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "文件名", prop: "fileName" },
        {
          label: "状态",
          prop: "status",
          type: "status",
          statusMap: bacthStatusMap,
        },
        {
          label: "结果",
          prop: "discount",
          text: (row) =>
            `总计:${row.totalNum || 0}，成功:${row.successNum ||
              0}，失败:${row.failureNum || 0}`,
        },
        { label: "提交时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",
          width: "100",
          handles: [
            {
              prop: "downloadUrl",
              show: (row) => row.status == 2,
              download: true,
              text: "下载",
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "文件名",
          type: "input",
          key: "fileName",
          placeholder: "请输入",
        },
        {
          label: "状态",
          type: "select",
          key: "status",
          option: bacthStatusMap,
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
        const res = await getBatchAuthList(params);
        this.list = res.data;
        this.listState = {
          ...this.listState,
          total: res.total,
        };
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
