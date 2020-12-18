<template>
  <div>
    <div class="view-header-container">
      <section class="title">
        <div style="font-size:16px;color:#333333; font-weight:600;height:30px">政策类型</div>
        <el-button
          v-permission="'createPolicyType'"
          type="primary"
          @click="openCreateAccountWindow()"
          style="float:right; margin-top:-40px; margin-right:45px"
        >新增政策类型</el-button>
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
    <my-diaiog
      :editpassdialogvis="editpassdialogvis"
      :titles="titles"
      :clickType="clickType"
      :findOneform="findOneform"
      @closeseeDialog="closeseeDialog"
      @handleClose="handleClose"
    ></my-diaiog>
  </div>
</template>

<script>
import { queryPolicyType, changeStatusPolicy } from "@/api/api";
import event from "@/mixins/common";
import { mapState, mapActions, mapGetters } from "vuex";
import myDiaiog from "./components/myDiaiog";
export default {
  components: {
    myDiaiog,
  },
  data() {
    return {
      findOneform: { ptname: "", eids: [], desc: "" },
      editpassdialogvis: false,
      clickType: 0,
      titles: "",
      roleName: [
        { label: "上架", value: 1 },
        { label: "下架", value: 2 },
      ],
      states: {
        1: { label: "上架", value: 1 },
        2: { label: "下架", value: 2 },
      },
    };
  },
  created() {
    (this.tableData = {
      id: "UserManagement",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "政策类型", prop: "ptname" },
        {
          label: "不可同享",
          prop: "eids",
          minWidth: 180,
          tips: true,
          text: (row) => this.categoryfilter(row),
        },
        {
          label: "状态",
          prop: "status",
          statusMap: this.states,
          type: "status",
        },
        {
          label: "类型描述",
          prop: "desc",
          tips: true,
        },
        {
          label: "更新时间",
          prop: "utime",
        },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handelPassword(row),
              type: "text",
              text: "查看",
            },
            {
              fn: (index, row) => this.handelEdit(row),
              type: "text",
              text: "编辑",
              show: (row) =>
                row.status == 2 && this.jurisdiction.editPolicyType == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "上架"),
              type: "text",
              text: "上架",
              show: (row) =>
                row.status == 2 && this.jurisdiction.editPolicyType == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "下架"),
              type: "text",
              text: "下架",
              show: (row) =>
                row.status == 1 && this.jurisdiction.editPolicyType == 1,
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          {
            label: "状态",
            type: "select",
            key: "status",
            option: this.roleName,
          },
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
      });
    this.getTableList();
  },
  mounted() {},
  computed: {
    ...mapState({
      policy: (state) => state.options.policy,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
    categoryfilter() {
      return function (row) {
        if (!row.eids || row.eids == null) {
          return "--";
        } else {
          let arr = [];
          row.eids.forEach((item) => {
            for (let i = 0; i < this.policy.length; i++) {
              if (this.policy[i].value == item) {
                arr.push(this.policy[i].label);
              }
            }
          });
          return arr + "";
        }
      };
    },
  },
  mixins: [event],
  methods: {
    ...mapActions(["getPolicy"]),
    async getTableList() {
      const params = {
        ...this.searchForm,
        ...this.listState,
      };
      delete params.total;
      // 调用接口
      try {
        this.loading = true;
        const res = await queryPolicyType(params);
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
    openCreateAccountWindow() {
      this.editpassdialogvis = true;
      this.clickType = 1;
      this.titles = "新增";
    },
    handelEdit(row) {
      this.findOneform = { ...row };
      this.editpassdialogvis = true;
      this.clickType = 2;
      this.titles = "编辑";
    },
    handelPassword(row) {
      this.findOneform = { ...row };
      this.clickType = 3;
      this.titles = "查看";
      this.editpassdialogvis = true;
    },
    handleClose(item) {
      this.findOneform.eids.splice(this.findOneform.eids.indexOf(item), 1);
    },
    closeseeDialog(val) {
      (this.findOneform = { ptname: "", eids: [], desc: "" }),
        (this.editpassdialogvis = false);
      this.getTableList();
      this.getPolicy()
    },
    async handelDelete(row, text) {
      try {
        var titleText = "";
        var status = 0;
        text == "下架"
          ? ((titleText =
              "是否确定下架该政策类型？下架后该类型下的所有政策也将下架，用户将无法查看并申请，不影响已审批和待审批的政策申请。"),
            (status = 2))
          : ((titleText = (
              <div>
                是否确定上架该政策类型?{" "}
                <p class="warning">
                  注意：请手动将该政策类型下的政策置为上架状态，否则用户将无法查看并申请。
                </p>
              </div>
            )),
            (status = 1));
        await this.$alert(titleText, text, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        let para = { ptid: row.ptid, status };
        await changeStatusPolicy(para);
        this.$message({
          message: text + "成功",
          type: "success",
        });
        this.getPolicy();
        this.getTableList();
      } catch (e) {
        console.log(e, 999);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.warning {
  margin-top: 15px;
  color: rgb(241, 140, 8);
}
/deep/.el-checkbox-button__inner {
  border-left: 1px solid #dcdfe6;
}
</style>
