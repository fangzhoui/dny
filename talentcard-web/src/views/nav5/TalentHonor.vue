<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div>
          <div style="font-size:16px;color:#333333; font-weight:600;height:30px">人才荣誉</div>
          <el-button
            v-permission="'talentHonourAdd'"
            type="primary"
            @click="openCreateAccountWindow()"
            style="float:right; margin-top:-40px; margin-right:45px"
          >新增人才荣誉</el-button>
        </div>
        <div class="homepageTitle"></div>
        <ajax-form :formData="formData" />
      </section>
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

    <el-dialog
      title="编辑人才荣誉"
      width="640px"
      :visible.sync="editDialogVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editdialogform" :model="editdialogform" label-width="160px" :rules="rules">
        <el-form-item label="人才荣誉" prop="name">
          <el-input
            class="newAccountInput"
            v-model="editdialogform.name"
            placeholder="请输入人才荣誉"
            maxlength="10"
            disabled
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            class="newAccountInput"
            type="textarea"
            v-model="editdialogform.description"
            placeholder="可输入备注信息"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="submitedit(editdialogform.honourId)">确 定</el-button>
      </span>
    </el-dialog>
    <add
      :createNewAccountVis="createNewAccountVis"
      titles="人才荣誉"
      @submitNewaccount="submitNewaccount"
      @closeDialog="closeDialog"
      type="2"
    ></add>
    <see
      :editpassdialogvis="editpassdialogvis"
      :findOneform="findOneform"
      @closeseeDialog="closeseeDialog"
      type="2"
      titles="人才荣誉"
    ></see>
  </div>
</template>

<script>
import {
  queryRoleIdMag,
  managerChangePass,
  editUser,
  insertUser,
  deleteUser,
  queryTalentHonor,
  findOneTalentHonor,
  upDownTalentHonor,
  editTalentHonor,
} from "../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import add from "./dialog/add";
import see from "./dialog/see";
import event from "@/mixins/common";

export default {
  components: {
    add,
    see,
  },
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
    // ...mapGetters(['memberInfo'])
  },
  data() {
    return {
      findOneform: {},
      loading: true,
      editpassdialogvis: false,
      editpassdialogform: {
        username: "",
        password: "",
      },
      editDialogVis: false,
      editdialogform: {
        username: "",
      },
      createNewAccountVis: false,
      newaccountform: { username: "", description: "" },
      rules: {
        username: [
          {
            required: true,
            message: "请输入政策类型",
            trigger: ["change", "blur"],
          },
        ],
        description: [
          {
            required: true,
            message: "请输入描述",
            trigger: ["change", "blur"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入人才荣誉",
            trigger: ["change", "blur"],
          },
        ],
      },
      roleName: [
        { label: "全部", value: 0 },
        { label: "上架", value: 1 },
        { label: "下架", value: 2 },
      ],
      states: {
        1: { label: "上架", value: 1 },
        2: { label: "下架", value: 2 },
      },
    };
  },
  mixins: [event],
  methods: {
    ...mapActions(["getHonours"]),
    async getTableList() {
      let para = {
        ...this.searchForm,
        ...this.listState,
        type: 2,
      };
      delete para.total;
      try {
        this.loading = true;
        const res = await queryTalentHonor(para);
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
    async edituserinfo(honourId) {
      let para = {
        ...this.editdialogform,
        honourId,
      };
      try {
        const res = await editTalentHonor(para);
        this.$message.success("编辑成功");
        this.getHonours();
        this.getTableList();
      } catch (e) {}
    },
    async handelPassword(row) {
      this.editpassdialogvis = true;
      const data = await findOneTalentHonor({ honourId: row.honourId });
      this.findOneform = data;
    },
    handelEdit(row) {
      this.editDialogVis = true;
      this.editdialogform = { ...row };
    },
    async handelDelete(row, text) {
      try {
        var titleText = "";
        text == "下架"
          ? ((titleText =
              "是否确定下架该人才荣誉？下架后人才将不可查看并认证该人才荣誉，不影响已绑定该人才荣誉的人才。"),
            (status = 2))
          : ((titleText = "是否确定上架该人才荣誉？"), (status = 1));
        await this.$alert(titleText, text, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        let para = { honourId: row.honourId, status };
        await upDownTalentHonor(para);
        this.$message({
          message: text + "成功",
          type: "success",
        });
        this.getHonours();
        this.getTableList();
      } catch (e) {}
    },
    openCreateAccountWindow() {
      this.newaccountform = { ..."" };
      this.createNewAccountVis = true;
    },
    submitForm(formName, fn) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          fn();
        }
      });
    },
    submitedit(honourId) {
      this.$refs.editdialogform.validate((valid) => {
        if (valid) {
          this.editDialogVis = false;
          this.edituserinfo(honourId);
        }
      });
    },
    submitPass() {
      this.editpassdialogvis = false;
      this.getTableList();
    },
    submitNewaccount() {
      this.createNewAccountVis = false;
      this.getTableList();
    },
    closeDialog(fn) {
      fn();
      this.createNewAccountVis = false;
    },
    closeseeDialog() {
      this.editpassdialogvis = false;
    },
  },

  created() {
    (this.tableData = {
      id: "UserManagement",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "人才荣誉", prop: "name" },
        {
          label: "状态",
          prop: "status",
          statusMap: this.states,
          type: "status",
        },
        {
          label: "描述",
          prop: "description",
          tips: true,
        },
        {
          label: "更新时间",
          prop: "updateTime",
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
                row.status == 2 && this.jurisdiction.talentHonourEdit == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "上架"),
              type: "text",
              text: "上架",
              show: (row) =>
                row.status == 2 && this.jurisdiction.talentHonourEdit == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "下架"),
              type: "text",
              text: "下架",
              show: (row) =>
                row.status == 1 && this.jurisdiction.talentHonourEdit == 1,
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          {
            label: "人才荣誉",
            type: "input",
            key: "name",
            placeholder: "请输入",
          },
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
};
</script>

<style scoped>
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
.dialogDivider {
  margin-top: -20px;
}
.innerDivider {
  margin-top: 5px;
  margin-bottom: 5px;
}
.newAccountInput {
  width: 300px;
  margin-left: 0px;
}
.titlewrapper {
  background-color: white !important;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.pagination {
  background-color: white;
  padding: 0;
  margin: 0;
}
.passcheck {
  margin-left: 250px;
  margin-top: -30px;
}
</style>
