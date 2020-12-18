<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">
          banner配置
        </div>
        <el-button
        v-permission="'bannerCreate'"
          type="primary"
          @click="addBanner"
          style="float:right; margin-top:-40px; margin-right:45px"
          >新建banner</el-button
        >
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
    <el-dialog
      :visible.sync="addBannerFlag"
      width="740px"
      title="新建banner"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :show-close="false"
      :destroy-on-close="true"
      append-to-body
      custom-class="my-dialog"
    >
      <div class="dialog-line" />
      <add-banner :form="addForm" @close="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
import { travelStatus, jumpStatus } from "../../config";
import {
  getBannerList,
  deleteBannerApi,
  changeBannerStatusApi,
} from "@/api/api";
import AddBanner from "./addBanner";
import event from "@/mixins/common";
const FORM = {
  name: "",
  picture: [],
  jump: "",
  type: "",
  extra: "",
};
export default {
  name: "ExtendPagesXcxBanner",
  components: {
    AddBanner,
  },
  data() {
    return {
      travelStatus: travelStatus,
      addBannerFlag: false,
      addForm: JSON.parse(JSON.stringify(FORM)),
    };
  },
  created() {
    this.tableData = {
      id: "bid",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "名称", prop: "name" },
        { label: "图片", prop: "picture", type: "img" },
        {
          label: "跳转",
          prop: "type",
          type: "status",
          statusMap: jumpStatus,
        },
        {
          label: "跳转地址",
          prop: "jump",
          tips: true,
        },
        { label: "备注", prop: "extra", tips: true },
        {
          label: "状态",
          prop: "status",
          type: "status",
          statusMap: this.travelStatus,
        },
        { label: "创建时间", prop: "ctime" },
        {
          label: "操作",
          type: "handle",
          width: "200",
          handles: [
            {
              fn: (index, row) => this.changeBannerStatus(row),
              type: "text",
              text: (row) => (row.status == 1 ? "下架" : "上架"),
            },
            {
              fn: (index, row) => this.deleteBanner(row),
              type: "text",
              text: "删除",
              show: (row) => row.status == 2,
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        { label: "名称", type: "input", key: "name", placeholder: "请输入" },
        {
          label: "状态",
          type: "select",
          key: "status",
          option: this.travelStatus,
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
        const res = await getBannerList(params);
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
    addBanner() {
      this.addBannerFlag = true;
    },
    async deleteBanner(row) {
      try {
        const params = {
          bid: row.bid,
        };
        await this.$alert("是否删除此banner？", "删除操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        await deleteBannerApi(params);
        await this.getTableList();
        this.$message.success("删除成功");
      } catch (e) {
        console.log(e);
      }
    },
    async changeBannerStatus(row) {
      try {
        const params = {
          bid: row.bid,
          status: row.status == 1 ? 2 : 1,
        };
        const title = row.status == 1 ? "下架操作" : "上架操作";
        const tip = row.status == 1 ? "下架成功" : "上架成功";
        const message =
          row.status == 1 ? "是否确定下架此banner" : "是否确定上架此banner";
        await this.$alert(message, title, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        await changeBannerStatusApi(params);
        await this.getTableList();
        this.$message.success(tip);
      } catch (e) {}
    },
    closeDialog(type) {
      this.addBannerFlag = false;
      this.addForm = JSON.parse(JSON.stringify(FORM));
      if (type && type == "add") {
        this.getTableList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.my-dialog {
  .dialog-title {
    border-bottom: 1px solid #000;
  }
}
// /deep/ .el-dialog__body {
//   padding: 0 0 30px 0 !important;
// }
</style>
