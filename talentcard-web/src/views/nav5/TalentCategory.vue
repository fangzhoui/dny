<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div>
          <div style="font-size:16px;color:#333333; font-weight:600;height:30px">人才类别</div>
          <el-button
            v-permission="'talentCategoryAdd'"
            type="primary"
            @click="openCreateAccountWindow"
            style="float:right; margin-top:-40px; margin-right:45px"
          >新增人才类别</el-button>
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
      title="编辑人才类别"
      width="640px"
      :visible.sync="editDialogVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editdialogform" :model="editdialogform" label-width="160px" :rules="rules">
        <el-form-item label="人才类别" prop="name">
          <el-input
            class="newAccountInput"
            v-model="editdialogform.name"
            placeholder="请输入使用者姓名"
            maxlength="10"
            show-word-limit
            :disabled="true"
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
        <el-button type="primary" @click="submitedit(editdialogform.categoryId)">确 定</el-button>
      </span>
    </el-dialog>
    <add
      :createNewAccountVis="createNewAccountVis"
      titles="人才类别"
      @submitNewaccount="submitNewaccount"
      @closeDialog="closeDialog"
      type="1"
    ></add>
    <see
      :findOneform="findOneform"
      :editpassdialogvis="editpassdialogvis"
      @closeseeDialog="closeseeDialog"
      titles="人才类别"
      type="1"
    ></see>
  </div>
</template>

<script>
import {
  queryTalentCategory,
  queryRoleIdMag,
  managerChangePass,
  editUser,
  insertUser,
  upDownTalentCategory,
  findOneTalentCategory,
  editTalentCategory,
} from "../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import event from "@/mixins/common";
import add from "./dialog/add";
import see from "./dialog/see";
export default {
  components: {
    add,
    see,
  },
  data() {
    return {
      loading: true,
      editpassdialogvis: false,
      editDialogVis: false,
      editdialogform: {
        username: "",
        description: "",
      },
      createNewAccountVis: false,
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
      findOneform: {},
    };
  },
  mixins: [event],
  methods: {
    ...mapActions(["getCategories"]),
    async getTableList() {
      let para = {
        ...this.searchForm,
        ...this.listState,
        type: 2,
      };
      delete para.total;
      try {
        this.loading = true;
        const res = await queryTalentCategory(para);
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
    async edituserinfo(categoryId) {
      let para = {
        ...this.editdialogform,
        categoryId,
      };
      try {
        const res = await editTalentCategory(para);
        this.$message.success("编辑成功");

        this.getTableList();
      } catch (e) {}
    },
    async handelPassword(row) {
      const data = await findOneTalentCategory({ categoryId: row.categoryId });
      this.findOneform = data;
      this.editpassdialogvis = true;
    },
    async handelEdit(row) {
      this.editDialogVis = true;
      this.editdialogform = { ...row };
    },
    async handelDelete(row, text) {
      try {
        var titleText = "";
        var status = 0;
        text == "下架"
          ? ((titleText =
              "是否确定下架该人才类别？下架后人才将不可绑定该人才类别，不影响已绑定该人才类别的人才。"),
            (status = 2))
          : ((titleText = "是否确定上架该人才类别？"), (status = 1));
        await this.$alert(titleText, text, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        let para = { categoryId: row.categoryId, status };
        await upDownTalentCategory(para);
        this.$message({
          message: text + "成功",
          type: "success",
        });
        this.getCategories();
        this.getTableList();
      } catch (e) {}
    },
    submitedit(categoryId) {
      this.$refs.editdialogform.validate((valid) => {
        if (valid) {
          this.editDialogVis = false;
          this.edituserinfo(categoryId);
        }
      });
    },
    openCreateAccountWindow() {
      this.createNewAccountVis = true;
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
  computed: {
    ...mapState({
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  created() {
    (this.tableData = {
      id: "UserManagement",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "人才类别", prop: "name" },
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
                row.status == 2 && this.jurisdiction.talentCategoryEdit == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "上架"),
              type: "text",
              text: "上架",
              show: (row) =>
                row.status == 2 && this.jurisdiction.talentCategoryEdit == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row, "下架"),
              type: "text",
              text: "下架",
              show: (row) =>
                row.status == 1 && this.jurisdiction.talentCategoryEdit == 1,
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          {
            label: "人才类别",
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
