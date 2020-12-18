<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">员工绑定信息</div>
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
import event from "@/mixins/common";
import { getStaffList, deleteStaffApi } from "@/api/api";
import { staffStatus } from "../config";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "ExtendPagesStaff",
  props: {},
  data() {
    return {
      staffStatus: staffStatus,
    };
  },
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  created() {
    this.tableData = {
      id: "staffId",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "名称", prop: "activitySecondContentName" },
        {
          label: "归属",
          prop: "activityFirstContentId",
          type: "status",
          statusMap: this.staffStatus,
        },
        { label: "员工姓名", prop: "name" },
        { label: "员工手机号", prop: "phone" },
        { label: "绑定时间", prop: "createTime" },
        {
          label: "操作",
          type: "handle",
          width: "120",
          handles: [
            {
              fn: (index, row) => this.deleteStaff(row),
              type: "text",
              text: "删除",
              show: (row) => this.jurisdiction.staffBindInfoDelete == 1,
            },
          ],
        },
      ],
    };
    this.formData = {
      id: "searchForm",
      arr: [
        {
          label: "名称",
          type: "input",
          key: "activitySecondContentName",
          placeholder: "请输入",
        },
        {
          label: "归属",
          type: "select",
          key: "activityFirstContentId",
          option: this.staffStatus,
        },
        {
          label: "员工姓名",
          type: "input",
          key: "name",
          placeholder: "请输入",
        },
        { label: "开始时间", type: "date-picker", key: "startTime" },
        { label: "结束时间", type: "date-picker", key: "endTime" },
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
        const res = await getStaffList(params);
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
    async deleteStaff(row) {
      try {
        await this.$alert("是否删除此员工信息？", "删除操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        const params = {
          staffId: row.staffId,
        };
        await deleteStaffApi(params);
        this.$message.success("删除成功");
        this.getTableList();
      } catch (e) {}
    },
  },
};
</script>

<style lang="less" scoped></style>
