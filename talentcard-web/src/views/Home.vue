<template>
  <el-row class="homecontainer">
    <el-container class="homewrapper">
      <el-header height="82px">
        <img
          src="../assets/title-img.png"
          style="width:356px;height:50px; margin-top:20px ; margin-left:10px;float:left"
        />
        <p
          class="pingfang"
          style=" color:white;font-size:18px; float:left; margin-top:40px; margin-left:20px"
        >管理系统</p>
        <el-dropdown>
          <span class="el-dropdown-link pingfangmedium" style="font-size:18px; cursor: pointer;">
            你好, {{sysUserName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePasswordVisible = true;">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logoutVis=true">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-dialog
        title="修改密码"
        :visible.sync="changePasswordVisible"
        width="640px"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <el-form
          label-position="right"
          label-width="150px"
          :model="formLabelAlign"
          ref="formLabelAlign"
          :rules="rules"
        >
          <div
            style="width:100%;height:1px;border-top:solid #ccc 1px; margin-bottom:20px; margin-top:-20px;"
          />

          <el-form-item label="旧密码：" prop="oldpass">
            <el-input
              v-model="formLabelAlign.oldpass"
              placeholder="请输入旧密码"
              style="width:65%;"
              maxlength="15"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="新密码：" prop="newpass">
            <el-input
              v-model="formLabelAlign.newpass"
              placeholder="请输入新密码"
              style="width:65%;"
              maxlength="15"
              show-password
            ></el-input>
          </el-form-item>
          <p
            style="margin-left:230px; font-size:10px; color:#ccc; margin-top:-10px"
          >请输入长度为6-15位的密码, 不能输入特殊字符</p>

          <el-form-item label="确认新密码：" prop="confirmpass">
            <el-input
              v-model="formLabelAlign.confirmpass"
              placeholder="请确认新密码"
              style="width:65%;"
              maxlength="15"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetinput('formLabelAlign');changePasswordVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePassword('formLabelAlign')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="退出登录"
        :visible.sync="logoutVis"
        width="30%"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <span>是否确认退出？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logoutVis = false">取 消</el-button>
          <el-button type="primary" @click="logout">确 定</el-button>
        </span>
      </el-dialog>
      <el-container>
        <el-aside style="padding:20px 10px;width:220px">
          <el-menu :default-active="active" class="el-menu-vertical-demo" router>
            <el-menu-item index="/main">
              <template slot="title">
                <i class="el-icon-house"></i>
                <span>首页</span>
              </template>
            </el-menu-item>
            <el-submenu index="1" v-permission="'systemManage'">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item
                v-if="userRoles.roleQuery"
                index="/RoleManagement"
                v-permission="'roleQuery'"
              >角色管理</el-menu-item>
              <el-menu-item index="/UserManagement" v-permission="'userQuery'">用户管理</el-menu-item>
              <el-menu-item index="/OperationLog" v-permission="'logQuery'">操作日志</el-menu-item>
            </el-submenu>
            <el-submenu index="2" v-permission="'cardManage'">
              <template slot="title">
                <i class="el-icon-bank-card"></i>
                <span slot="title">卡片管理</span>
              </template>
              <el-menu-item index="/CardManagement" v-permission="'userCardQuery'">人才卡管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3" v-permission="'talentManage'">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span slot="title">人才管理</span>
                <el-badge :value="talentapp" class="pop" v-if="talentapp"></el-badge>
              </template>

              <el-menu-item index="/OrdinaryUsers" v-permission="'generalTalentQuery'">普通用户</el-menu-item>
              <el-badge :value="talentapp" class="subpop" v-if="talentapp"></el-badge>
              <el-menu-item index="/CertifiedPersonnel" v-permission="'approvalTalentQuery'">认证审批</el-menu-item>

              <el-menu-item index="/ValidateTalent" v-permission="'verifiedTalentQuery'">认证人才</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-permission="'policyManage'">
              <template slot="title">
                <i class="el-icon-document-copy"></i>
                <span slot="title">人才政策管理</span>
                <el-badge :value="policyapp" class="pop" v-if="policyapp"></el-badge>
              </template>

              <el-menu-item index="/PolicyManagement" v-permission="'policyQuery'">政策管理</el-menu-item>
              <el-badge :value="policyapp" class="subpop" v-if="policyapp"></el-badge>
              <el-menu-item index="/PolicyApproval" v-permission="'approvalPolicyQuery'">政策审批</el-menu-item>
              <el-menu-item index="/PolicyType"  v-permission="'policyTypeQuery'">政策类型</el-menu-item>
            </el-submenu>
            <el-submenu index="5" v-permission="'tagManage'">
              <template slot="title">
                <i class="el-icon-document-copy"></i>
                <span slot="title">人才标签管理</span>
              </template>
              <el-menu-item index="/TalentCategory" v-permission="'talentCategoryQuery'">人才类别</el-menu-item>
              <el-menu-item index="/talentHonor" v-permission="'talentHonourQuery'">人才荣誉</el-menu-item>
            </el-submenu>
            <el-submenu index="6" v-permission="'otherService'">
              <template slot="title">
                <i class="el-icon-connection"></i>
                <span slot="title">其他服务</span>
                <el-badge :value="approvalNum" class="pop" v-if="approvalNum"></el-badge>
              </template>
              <el-badge :value="approvalNum" class="subpop" v-if="approvalNum"></el-badge>
              <el-menu-item index="/other/active" v-permission="'eventQuery'">人才活动</el-menu-item>
            </el-submenu>
            <el-submenu index="7" v-permission="'extraFunction'">
              <template slot="title">
                <i class="el-icon-pie-chart"></i>
                <span slot="title">扩展功能</span>
              </template>
              <el-menu-item index="/extend/xcxbanner" v-permission="'bannerQuery'">banner配置</el-menu-item>
              <el-menu-item index="/extend/feedback" v-permission="'commentQuery'">意见反馈</el-menu-item>
              <el-menu-item index="/extend/travel" v-permission="'tripQuery'">免费旅游</el-menu-item>
              <el-menu-item index="/extend/agritainment" v-permission="'farmHouseQuery'">农家乐</el-menu-item>
              <el-menu-item index="/extend/staff" v-permission="'staffBindInfoQuery'">员工绑定信息</el-menu-item>
              <el-menu-item index="/extend/collection" v-permission="'questionCollectQuery'">问题收集</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="padding:20px 10px 20px 0px">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </el-row>
</template>

<script>
import { changePassword, confirmlogout } from "../api/api";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    const validateOldpass = (rule, value, callback) => {
      if (value) {
        if (this.formLabelAlign.newpass) {
          this.$refs.formLabelAlign.validateField("newpass");
        }
        callback();
      } else {
        callback(new Error("请输入旧密码"));
      }
    };
    var validateNewPwd = (rule, value, callback) => {
      if (this.formLabelAlign.oldpass === value) {
        callback(new Error("新密码与旧密码不可一致！"));
      } else {
        callback();
      }
    };
    var validateComfirmPwd = (rule, value, callback) => {
      if (this.formLabelAlign.newpass !== value) {
        callback(new Error("确认密码与新密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      active: "/mian",
      sysUserName: "",
      changePasswordVisible: false,
      logoutVis: false,
      formLabelAlign: {
        oldpass: "",
        newpass: "",
        confirmpass: "",
      },
      userRoles: {},
      rules: {
        oldpass: [
          { validator: validateOldpass, trigger: ["blur", "change"] },
          {
            min: 6,
            max: 15,
            message: "请输入长度为6~15位的密码",
          },
          {
            required: true,
            pattern: /^[A-Za-z0-9]+$/,
            message: "不能包含特殊字符与中文",
          },
        ],
        newpass: [
          {
            required: true,
            message: "请输入新密码",
            trigger: ["blur", "change"],
          },
          {
            min: 6,
            max: 15,
            message: "请输入长度为6~15位的密码",
          },
          {
            required: true,
            pattern: /^[A-Za-z0-9]+$/,
            message: "不能包含特殊字符与中文",
          },
          { validator: validateNewPwd },
        ],
        confirmpass: [
          {
            required: true,
            message: "请输入确认新密码",
            trigger: ["blur", "change"],
          },
          {
            min: 6,
            max: 15,
            message: "请输入长度为6~15位的密码",
          },
          {
            required: true,
            pattern: /^[A-Za-z0-9]+$/,
            message: "不能包含特殊字符与中文",
          },
          { validator: validateComfirmPwd },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      talentapp: (state) => state.common.talentapp,
      policyapp: (state) => state.common.policyapp,
      approvalNum: (state) => state.common.approvalNum,
    }),
  },
  mounted() {
    this.getTalentapp();
    this.getPolicyapp();
    this.getOtherApprovalNum();
    this.getHonours();
    this.getCategories();
    this.getPolicy();
    this.getResponsible();
    this.getOptions();
    this.getCardlist();
    //这里需要从 session里获取 username
  },
  created() {
    const path = this.$route.path.split("/");
    const specialPath = ["OrdinaryUsers", "PolicyManagement"];
    let selectPath = "";
    const needCheckPath = path[1] || "";
    let flag = false;
    if (needCheckPath && specialPath.includes(needCheckPath)) {
      flag = true;
    }
    if (flag) {
      selectPath = `/${needCheckPath}`;
    } else {
      path.map((i, index) => {
        if (i) {
          if (path.length <= 2) {
            selectPath += `/${i}`;
          } else {
            if (index <= 2) {
              selectPath += `/${i}`;
            }
          }
        }
      });
    }
    this.active = selectPath;
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = (user && user.username) || "";
      this.userRoles = (user && user.role) || {};
    }
  },
  methods: {
    ...mapActions([
      "getTalentapp",
      "getPolicyapp",
      "getHonours",
      "getCategories",
      "getPolicy",
      "getResponsible",
      "getOtherApprovalNum",
      "getOptions",
      "getCardlist",
    ]),
    async logout() {
      try {
        const res = await confirmlogout();
        sessionStorage.removeItem("user");
        this.$router.replace("/login");
      } catch (e) {}
    },
    changePassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var ChangepassParams = {
            oldPassword: this.formLabelAlign.oldpass,
            newPassword: this.formLabelAlign.newpass,
          };
          try {
            const res = await changePassword(ChangepassParams);
            this.$message({
              duration: 2000,
              message: "修改成功",
              type: "success",
            });
            this.$router.push({ path: "/login" });
          } catch (e) {}
        }
      });
    },
    resetinput(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.el-form-item__label :before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.homecontainer {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.homewrapper {
  background: #f3f6f9;
  height: 100%;
}
.el-main {
  padding: 38px 10px 20px 20px;
}
.el-header {
  background-color: #3698e9;
}

.el-aside {
  display: block;
  position: relative;
}
.el-menu {
  height: 100%;
}

.userinfo {
  position: relative;
  width: 120px;
  height: 80px;
  float: right;
  margin-right: 50px;
}
.triangle {
  border-color: #fff #3698e9 #3698e9 #3698e9;
  border-style: solid;
  border-width: 8px 8px 0 8px;
  height: 0;
  width: 0;
  float: right;
  margin-right: -40px;
  margin-top: 10px;
}
.el-dropdown {
  float: right;
  margin-top: 30px;
  margin-right: 50px;
  font-size: 16px;
  color: #fff;
}
.el-form-item {
  margin-left: 80px;
}
.pop {
  margin-left: 10px;
  position: absolute;
}
.subpop {
  position: absolute;
  margin-left: 120px;
  margin-top: 15px;
  z-index: 999;
}
</style>

<style>
.aside-container[data-v-f133230e] {
  margin: 36px 10px 10px 10px;
}
</style>