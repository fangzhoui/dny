<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>编辑人才类别</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="categoryForm" :rules="rules" :model="categoryForm" label-width="auto">
        <el-form-item label="人才类别：">
          <p v-if="categoryForm.category.length == 0">无</p>
          <el-tag
            v-else
            class="tag-margin"
            :key="item"
            v-for="item in categoryForm.category"
            closable
            @close="handleClose(item)"
          >{{ formatCategory(item) }}</el-tag>
          <el-button type="text" @click="newtypeVis = true" :disabled="false">添加类别</el-button>
        </el-form-item>
        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in list" :key="item.name">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="操作原因：" prop="descp">
          <el-input
            type="textarea"
            v-model="categoryForm.descp"
            maxlength="254"
            show-word-limit
            style="width:400px"
            :rows="8"
          ></el-input>
          <p style="color:#bbb">仅作为记录，不会通知用户</p>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <template>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="submitForm('categoryForm')">确定编辑</el-button>
      </template>
    </el-footer>
    <el-dialog
      title="添加人才类别"
      width="640px"
      :visible.sync="newtypeVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-checkbox-group v-model="categoryForm.category">
        <el-checkbox-button
          v-for="item in canUserCategories"
          :label="item.value"
          :key="item.value"
        >{{ item.label }}</el-checkbox-button>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetCategory">取 消</el-button>
        <el-button type="primary" @click="newtypeVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { findPolicy, editCategory, cTalentDetail } from "../../../api/api";
import { filterData, findIdByLabel } from "../../../utils/config";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      list: [],
      categoryForm: {
        category: [],
        descp: "",
      },
      newtypeVis: false,
      rules: {
        descp: [
          {
            required: true,
            message: "请填写操作原因",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
       ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
    }),
    ...mapGetters(["canUserCategories", "canUserHonours"]),
    formatCategory() {
      return function (val) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].value == val) {
            return this.categories[i].label;
          }
        }
      };
    },
  },
  methods: {
    handleClose(tag) {
      this.categoryForm.category.splice(
        this.categoryForm.category.indexOf(tag),
        1
      );
    },
    resetCategory() {
      this.newtypeVis = false;
    },
    async getpolicies() {
      try {
        let para = {
          category: this.categoryForm.category + "",
        };
        const res = await findPolicy(para);
        this.list = res;
      } catch (e) {}
    },
    goBack() {
      this.$router.go(-1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let params = {
              openId: this.$route.query.openId,
              talentCategory: this.categoryForm.category.toString(),
              opinion: this.categoryForm.descp,
            };
            const title = "编辑操作";
            const message = "是否确定编辑此用户的人才类别？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true,
            });
            await editCategory(params);
            this.$router.go(-1);
            this.$message.success("编辑成功");
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        console.log(!res.talentInfo.category);
        if (res.talentInfo.category) {
          this.categoryForm.category = res.talentInfo.category.split(",");
          for (var i in this.categoryForm.category) {
            this.categoryForm.category[i] = parseInt(
              this.categoryForm.category[i]
            );
          }
        } else {
          this.categoryForm.category = [];
        }
      } catch (e) {}
    },
  },
  watch: {
    categoryForm: {
      handler: function (newvalue, oldvalue) {
        this.getpolicies();
      },
      deep: true,
    },
  },

  created() {
    this.getDetail();
    this.getpolicies();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.el-header {
  background: white;
  padding: 20px;
}
.el-main {
  background: white;
}
.el-footer {
  background: white;
  text-align: center;
  .el-button {
    width: 120px;
    margin-right: 40px;
  }
}
/deep/ .el-form {
  margin-top: 16px;
}
/deep/ .el-form-item {
  margin-bottom: 16px;
}
/deep/ .el-tag {
  margin-right: 16px;
}
/deep/ .el-checkbox-button__inner {
  border-left: 1px solid #dcdfe6;
}
</style>
