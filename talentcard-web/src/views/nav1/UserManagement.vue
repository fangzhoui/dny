<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <section class="title">
        <div>
          <div style="font-size:16px;color:#333333; font-weight:600;height:30px">用户管理</div>
          <el-button
            v-permission="'userCreate'"
            type="primary"
            @click="openCreateAccountWindow()"
            style="float:right; margin-top:-40px; margin-right:45px"
          >新建用户</el-button>
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
      title="修改密码"
      width="640px"
      :visible.sync="editpassdialogvis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editpassdialogform" :model="editpassdialogform" label-width="160px">
        <el-form-item label="用户名">
          <el-input class="newAccountInput" v-model="editpassdialogform.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            class="newAccountInput"
            v-model="editpassdialogform.password"
            placeholder="请输入登录密码"
            maxlength="15"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editpassdialogvis = false">取 消</el-button>
        <el-button type="primary" @click="submitPass()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑用户"
      width="640px"
      :visible.sync="editDialogVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="editdialogform" :model="editdialogform" label-width="160px">
        <el-form-item label="用户名" prop="username">
          <el-input class="newAccountInput" v-model="editdialogform.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="使用者姓名" prop="name">
          <el-input
            class="newAccountInput"
            v-model="editdialogform.name"
            placeholder="请输入使用者姓名"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="editdialogform.roleId" class="newAccountInput" placeholder="请选择">
            <el-option
              v-for="item in responsible"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="extra">
          <el-input
            class="newAccountInput"
            type="textarea"
            v-model="editdialogform.extra"
            placeholder="可输入备注信息"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="submitedit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建用户"
      width="640px"
      :visible.sync="createNewAccountVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-divider class="dialogDivider"></el-divider>
      <el-form ref="newaccountform" :model="newaccountform" label-width="160px">
        <el-form-item label="用户名:" prop="username">
          <el-input
            class="newAccountInput"
            v-model="newaccountform.username"
            placeholder="请输入用户名"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" prop="password">
          <el-input
            class="newAccountInput"
            v-model="newaccountform.password"
            placeholder="请输入登录密码"
            maxlength="15"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="使用者姓名:" prop="name">
          <el-input
            class="newAccountInput"
            v-model="newaccountform.name"
            placeholder="请输入使用者姓名"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId">
          <el-select v-model="newaccountform.roleId" class="newAccountInput" placeholder="请选择角色">
            <el-option
              v-for="item in responsible"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="extra">
          <el-input
            class="newAccountInput"
            type="textarea"
            :rows="4"
            v-model="newaccountform.extra"
            placeholder="可输入备注信息"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createNewAccountVis = false">取 消</el-button>
        <el-button type="primary" @click="submitNewaccount()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  queryRoleIdMag,
  managerChangePass,
  editUser,
  insertUser,
  deleteUser,
} from "../../api/api";
import { mapState, mapActions, mapGetters } from "vuex";
import event from "@/mixins/common";

export default {
  data() {
    return {
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
      newaccountform: {
        username: "",
        password: "",
        name: "",
        roleId: "",
        extra: "",
      },
      roleName: [
        { label: "超级管理员", value: 1 },
        { label: "运营人员", value: 2 },
      ],
    };
  },
  mixins: [event],
  computed: {
    ...mapGetters(["canUserResponsible"]),
    ...mapState({
      responsible: (state) => state.options.responsible,
      jurisdiction: (state) => state.jurisdiction.jurisdiction,
    }),
  },
  methods: {
    async getTableList() {
      let para = {
        ...this.searchForm,
        length: this.listState.pageSize,
        start: this.listState.pageSize * (this.listState.pageNum - 1),
      };
      delete para.total;
      try {
        this.loading = true;
        const res = await getUserList(para);
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
    async edituserinfo() {
      let para = {
        ...this.editdialogform,
      };
      try {
        const res = await editUser(para);
        this.$message.success("修改成功");
        this.editDialogVis = false;
        this.getTableList();
      } catch (e) {}
    },
    async ManagerEditPass() {
      let passpara = {
        ...this.editpassdialogform,
      };
      try {
        await managerChangePass(passpara);
        this.$message.success("修改成功");
        this.editpassdialogvis = false;
        this.getTableList();
      } catch (e) {}
    },
    async createdNewAccount() {
      let para = {
        ...this.newaccountform,
      };
      try {
        await insertUser(para);
        this.$message.success("新建成功");
        this.createNewAccountVis = false;
        this.getTableList();
      } catch (e) {}
    },
    handelPassword(row) {
      this.editpassdialogvis = true;
      this.editpassdialogform.username = row.username;
      this.editpassdialogform.password = "";
    },
    handelEdit(row) {
      this.editDialogVis = true;
      this.editdialogform = { ...row };
    },
    async handelDelete(row) {
      try {
        await this.$alert("是否删除此用户？", "删除操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: true,
        });
        let para = {
          username: row.username,
        };
        await deleteUser(para);
        this.$message({
          message: "删除成功",
          type: "success",
        });
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
    submitedit() {
      this.submitForm("editdialogform", this.edituserinfo);
    },
    submitPass() {
      this.submitForm("editpassdialogform", this.ManagerEditPass);
    },
    submitNewaccount() {
      this.submitForm("newaccountform", this.createdNewAccount);
    },
  },

  created() {
    (this.tableData = {
      id: "UserManagement",
      arr: [
        { label: "序号", prop: "", type: "index", minWidth: 80 },
        { label: "用户名称", prop: "username" },
        { label: "使用者姓名", prop: "name" },
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "extra",
        },
        {
          label: "操作",
          type: "handle",
          width: "300",
          handles: [
            {
              fn: (index, row) => this.handelPassword(row),
              type: "text",
              text: "修改密码",
              show: (row) => this.jurisdiction.userUpdate == 1,
            },
            {
              fn: (index, row) => this.handelEdit(row),
              type: "text",
              text: "编辑",
              show: (row) => row.roleName != "超级管理员" && this.jurisdiction.userUpdate == 1,
            },
            {
              fn: (index, row) => this.handelDelete(row),
              type: "text",
              text: "删除",
              show: (row) => row.roleName != "超级管理员" && this.jurisdiction.userDelete  == 1,
            },
          ],
        },
      ],
    }),
      (this.formData = {
        id: "searchForm",
        arr: [
          {
            label: "用户名称",
            type: "input",
            key: "username",
            placeholder: "请输入",
          },
          {
            label: "角色名称",
            type: "select",
            key: "roleId",
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
