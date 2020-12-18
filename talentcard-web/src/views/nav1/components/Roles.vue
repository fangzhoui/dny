<template>
  <el-dialog
    :title="type == 'read' ? '查看' : '编辑'"
    :visible.sync="flag"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-divider class="dialogDivider"></el-divider>
    <el-form label-width="80px">
      <el-form-item label="角色名:">
        <p style="margin:0; color:#333333;font-weight:600;">{{roleName}}</p>
      </el-form-item>
      <el-form-item label="角色描述:">
        <p style="margin:0;color:#333333;font-weight:600;">{{roleName}}专用角色</p>
      </el-form-item>
      <el-form-item label="功能权限:">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane v-for="item in config" :key="item.key" :label="item.label" :name="item.key">
            <template v-for="subItem in item.option">
              <div :key="subItem.key">
              <el-row>
                <el-checkbox @change="(val) => checkAll(val, subItem.option)" v-model="subItem.checkAll" :indeterminate="isIndeterminate(subItem.option, subItem)" :disabled="isRead" class="checkboxstyle">{{subItem.label}}</el-checkbox>
              </el-row>
              <el-divider class="innerDivider"></el-divider>
              <el-row style="margin-left:30px;">
                <el-checkbox v-for="lastItem in subItem.option" :key="lastItem.key" :disabled="isRead"  v-model="roleAuthorityBO[lastItem.key]"  @change="(val) => checkItem(val, lastItem)">{{lastItem.label}}</el-checkbox>
              </el-row>
              <el-divider class="innerDivider"></el-divider>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitRoles" v-if="!isRead">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { config } from "../roleConfig";
export default {
  name: "roles",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "read"
    },
    form: {
      type: Object,
      default: () => {
        return {
          roleName: "",
          roleAuthorityBO: {}
        };
      }
    }
  },
  data() {
    return {
      config: config,
      activeName: "admin",
      roleName: '',
      roleAuthorityBO: {}
    };
  },
  computed: {
    isRead () {
      return this.type == 'read'
    }
  },
  watch: {
    flag (val) {
      if (val) {
        this.roleName = this.form.roleName
        for (let i in this.form.roleAuthorityBO) {
          this.$set(this.roleAuthorityBO, i, Boolean(this.form.roleAuthorityBO[i]))
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close", false);
    },
    submitRoles() {
      const obj = {}
      for (let i in this.roleAuthorityBO) {
        obj[i] = this.roleAuthorityBO[i] ? 1 : 2
      }
      this.$emit("close", true);
    },
    checkAll (flag, opt = []) {
      const { roleAuthorityBO } = this
      if (flag) {
        opt.map((item) => {
          this.$set(this.roleAuthorityBO, item.key, true)
        })
      } else {
        opt.map((item) => {
          this.$set(this.roleAuthorityBO, item.key, false)
        })
      }
    },
    isIndeterminate (opt = [], subItem) {
      const arr = opt.filter((item) => this.roleAuthorityBO[item.key])
      if (arr && arr.length > 0 && arr.length < opt.length) {
        this.$set(subItem, 'checkAll', false)
        return true
      } else if (arr.length == opt.length) {
        this.$set(subItem, 'checkAll', true)
      } else if (arr && arr.length == 0) {
        this.$set(subItem, 'checkAll', false)
      }
    },
    isCheckAll (opt = []) {
      const arr = opt.filter((item) => this.roleAuthorityBO[item.key])
      return true
    },
    checkItem (val, item) {
      this.$set(this.roleAuthorityBO, item.key, val)
    }
  }
};
</script>

<style lang="less" scoped>
.dialogDivider {
  margin-top: -20px;
}
.innerDivider {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
